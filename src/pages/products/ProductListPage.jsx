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
import { TbFilter, TbDeviceMobileX } from "react-icons/tb";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items: products, loading, filters, categories, brands } = useSelector(
    (state) => state.products
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  // Client-side instant filter & sort guarantees 100% responsiveness
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
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
      if (filters.brand && filters.brand !== "all") {
        const targetBrand = filters.brand.toLowerCase();
        let match = false;
        if (Array.isArray(item.brand)) {
          match = item.brand.some(
            (b) =>
              b._id === filters.brand ||
              b.slug?.toLowerCase() === targetBrand ||
              b.name?.toLowerCase() === targetBrand
          );
        } else if (item.brand && typeof item.brand === "object") {
          match =
            item.brand._id === filters.brand ||
            item.brand.slug?.toLowerCase() === targetBrand ||
            item.brand.name?.toLowerCase() === targetBrand;
        } else if (typeof item.brand === "string") {
          match =
            item.brand === filters.brand ||
            item.brand.toLowerCase() === targetBrand;
        }
        if (!match) return false;
      }

      // 3. Category filter
      if (filters.category && filters.category !== "all") {
        const targetCat = filters.category.toLowerCase();
        let match = false;
        if (Array.isArray(item.category)) {
          match = item.category.some(
            (c) =>
              c._id === filters.category ||
              c.slug?.toLowerCase() === targetCat ||
              c.name?.toLowerCase() === targetCat
          );
        } else if (item.category && typeof item.category === "object") {
          match =
            item.category._id === filters.category ||
            item.category.slug?.toLowerCase() === targetCat ||
            item.category.name?.toLowerCase() === targetCat;
        } else if (typeof item.category === "string") {
          match =
            item.category === filters.category ||
            item.category.toLowerCase() === targetCat;
        }
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
    }).sort((a, b) => {
      const priceA = a.afterDiscount ? a.afterDiscount / 100 : (a.price || 0) / 100;
      const priceB = b.afterDiscount ? b.afterDiscount / 100 : (b.price || 0) / 100;

      if (filters.sortBy === "price-asc") return priceA - priceB;
      if (filters.sortBy === "price-desc") return priceB - priceA;
      if (filters.sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, filters]);

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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
              <div className="w-screen max-w-xs bg-white border-r border-slate-200 p-5 overflow-y-auto">
                <ProductFilter onClose={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <section className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
