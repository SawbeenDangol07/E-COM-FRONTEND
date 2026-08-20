import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  setFilters,
  resetFilters,
} from "../../reducer/ProductReducer";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import {
  TbFilter,
  TbDeviceMobileX,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";

const ITEMS_PER_PAGE = 9;

export default function ProductListPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items: products, loading, filters, categories, brands } = useSelector(
    (state) => state.products
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load Categories & Brands on mount if empty
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (!brands || brands.length === 0) {
      dispatch(fetchBrands());
    }
  }, [dispatch]);

  // Sync URL search params with filters on mount or url change
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const updated = {};
    if (brandParam) updated.brand = brandParam;
    if (categoryParam) updated.category = categoryParam;
    if (searchParam) updated.search = searchParam;

    if (Object.keys(updated).length > 0) {
      dispatch(setFilters(updated));
    }

    dispatch(
      fetchProducts({
        ...filters,
        ...updated,
      })
    );
  }, [searchParams]);

  // Re-fetch when Redux filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Lookup maps for resolving IDs <-> slugs <-> names
  const brandLookup = useMemo(() => {
    const map = new Map();
    if (Array.isArray(brands)) {
      brands.forEach((b) => {
        if (b._id) map.set(String(b._id), b);
        if (b.id) map.set(String(b.id), b);
        if (b.slug) map.set(b.slug.toLowerCase(), b);
        if (b.name) map.set(b.name.toLowerCase(), b);
      });
    }
    return map;
  }, [brands]);

  const categoryLookup = useMemo(() => {
    const map = new Map();
    if (Array.isArray(categories)) {
      categories.forEach((c) => {
        if (c._id) map.set(String(c._id), c);
        if (c.id) map.set(String(c.id), c);
        if (c.slug) map.set(c.slug.toLowerCase(), c);
        if (c.name) map.set(c.name.toLowerCase(), c);
      });
    }
    return map;
  }, [categories]);

  // Client-side instant filter & sort guarantees 100% responsiveness
  const filteredProducts = useMemo(() => {
    const targetBrand = filters.brand && filters.brand !== "all" ? filters.brand.toLowerCase() : null;
    const targetCat = filters.category && filters.category !== "all" ? filters.category.toLowerCase() : null;

    return products
      .filter((item) => {
        // 1. Search query filter
        if (filters.search && filters.search.trim()) {
          const query = filters.search.toLowerCase().trim();
          const nameMatch = item.name?.toLowerCase().includes(query);
          const descMatch = item.description?.toLowerCase().includes(query);
          const brandMatch =
            typeof item.brand === "object"
              ? item.brand?.name?.toLowerCase().includes(query)
              : String(item.brand || "").toLowerCase().includes(query);
          if (!nameMatch && !descMatch && !brandMatch) return false;
        }

        // 2. Brand filter
        if (targetBrand) {
          const itemBrands = Array.isArray(item.brand)
            ? item.brand
            : item.brand
            ? [item.brand]
            : [];

          const match = itemBrands.some((b) => {
            if (!b) return false;
            if (typeof b === "object") {
              const bId = String(b._id || b.id || "");
              const bSlug = (b.slug || "").toLowerCase();
              const bName = (b.name || "").toLowerCase();
              return (
                bId === filters.brand ||
                bSlug === targetBrand ||
                bName === targetBrand
              );
            } else {
              const rawStr = String(b).toLowerCase();
              if (rawStr === targetBrand || String(b) === filters.brand) return true;
              const resolved = brandLookup.get(String(b)) || brandLookup.get(rawStr);
              if (resolved) {
                return (
                  String(resolved._id) === filters.brand ||
                  resolved.slug?.toLowerCase() === targetBrand ||
                  resolved.name?.toLowerCase() === targetBrand
                );
              }
              return false;
            }
          });

          if (!match) return false;
        }

        // 3. Category filter
        if (targetCat) {
          const itemCats = Array.isArray(item.category)
            ? item.category
            : item.category
            ? [item.category]
            : [];

          const match = itemCats.some((c) => {
            if (!c) return false;
            if (typeof c === "object") {
              const cId = String(c._id || c.id || "");
              const cSlug = (c.slug || "").toLowerCase();
              const cName = (c.name || "").toLowerCase();
              return (
                cId === filters.category ||
                cSlug === targetCat ||
                cName === targetCat
              );
            } else {
              const rawStr = String(c).toLowerCase();
              if (rawStr === targetCat || String(c) === filters.category) return true;
              const resolved = categoryLookup.get(String(c)) || categoryLookup.get(rawStr);
              if (resolved) {
                return (
                  String(resolved._id) === filters.category ||
                  resolved.slug?.toLowerCase() === targetCat ||
                  resolved.name?.toLowerCase() === targetCat
                );
              }
              return false;
            }
          });

          if (!match) return false;
        }

        // 4. Price range filter
        const effectivePrice = item.afterDiscount ? item.afterDiscount / 100 : (item.price || 0) / 100;
        if (filters.minPrice && !isNaN(+filters.minPrice) && effectivePrice < +filters.minPrice) {
          return false;
        }
        if (filters.maxPrice && !isNaN(+filters.maxPrice) && effectivePrice > +filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.afterDiscount ? a.afterDiscount / 100 : (a.price || 0) / 100;
        const priceB = b.afterDiscount ? b.afterDiscount / 100 : (b.price || 0) / 100;

        if (filters.sortBy === "price-asc") return priceA - priceB;
        if (filters.sortBy === "price-desc") return priceB - priceA;
        if (filters.sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, filters]);

  // Total pages and pagination slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, startIndex]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const activeFiltersCount = [
    filters.brand !== "all" && filters.brand,
    filters.category !== "all" && filters.category,
    filters.minPrice && `Min Rs. ${filters.minPrice}`,
    filters.maxPrice && `Max Rs. ${filters.maxPrice}`,
    filters.search && `"${filters.search}"`,
  ].filter(Boolean);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeadingWithSubtitle
          title="Explore Mobile Marketplace"
          badge={`${filteredProducts.length} Devices Listed`}
          className="mb-0"
        >
          Browse verified iPhones, Samsung flagships, Google Pixels, and certified refurbished mobiles.
        </PageHeadingWithSubtitle>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs self-start"
        >
          <TbFilter className="w-4 h-4 text-indigo-600" />
          <span>Filters ({activeFiltersCount.length})</span>
        </button>
      </div>

      {/* Active filter pills */}
      {activeFiltersCount.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-slate-500 font-light">Active filters:</span>
          {activeFiltersCount.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs"
            >
              <span>{tag}</span>
            </span>
          ))}
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-xs text-rose-600 hover:underline ml-2 font-medium cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <ProductFilter />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 z-10">
              <div className="w-screen max-w-sm bg-white border-r border-slate-200 p-5 overflow-y-auto shadow-2xl">
                <ProductFilter onClose={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <section className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <TbDeviceMobileX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No mobiles match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm font-light">
                Try widening your price range or removing brand/category constraints.
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Storefront Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-xs text-slate-500 font-medium">
                    Showing{" "}
                    <span className="font-bold text-slate-900">
                      {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
                    </span>{" "}
                    of <span className="font-bold text-slate-900">{filteredProducts.length}</span> devices
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {/* First Page */}
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(1)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition shadow-2xs cursor-pointer"
                      title="First Page"
                    >
                      <TbChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Button */}
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition shadow-2xs cursor-pointer"
                      title="Previous Page"
                    >
                      <TbChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((pageNum, ind) => {
                      if (pageNum === "...") {
                        return (
                          <span key={`dots-${ind}`} className="px-2 text-slate-400 font-bold">
                            ...
                          </span>
                        );
                      }
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 text-white font-bold shadow-xs shadow-indigo-600/20"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition shadow-2xs cursor-pointer"
                      title="Next Page"
                    >
                      <TbChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition shadow-2xs cursor-pointer"
                      title="Last Page"
                    >
                      <TbChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
