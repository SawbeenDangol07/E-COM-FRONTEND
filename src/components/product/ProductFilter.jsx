import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  resetFilters,
  fetchCategories,
  fetchBrands,
} from "../../reducer/ProductReducer";
import { SORT_OPTIONS } from "../../common/constants";
import { TbFilter, TbRefresh, TbX, TbCategory, TbDeviceMobile } from "react-icons/tb";

export default function ProductFilter({ onClose = null }) {
  const dispatch = useDispatch();
  const { filters, brands, categories, items: products } = useSelector(
    (state) => state.products
  );

  // Ensure categories and brands are loaded
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (!brands || brands.length === 0) {
      dispatch(fetchBrands());
    }
  }, [dispatch, categories, brands]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  // Combine DB categories with any categories present in loaded products as fallback
  const availableCategories = useMemo(() => {
    const map = new Map();

    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        if (cat && cat.name) {
          const slug = cat.slug || cat.name.toLowerCase();
          map.set(slug, { _id: cat._id || cat.id, name: cat.name, slug });
        }
      });
    }

    // Fallback: extract from products
    if (Array.isArray(products)) {
      products.forEach((prod) => {
        if (Array.isArray(prod.category)) {
          prod.category.forEach((c) => {
            if (c && typeof c === "object" && c.name) {
              const slug = c.slug || c.name.toLowerCase();
              if (!map.has(slug)) {
                map.set(slug, { _id: c._id || c.id, name: c.name, slug });
              }
            } else if (typeof c === "string" && !map.has(c.toLowerCase())) {
              map.set(c.toLowerCase(), { _id: c, name: c, slug: c.toLowerCase() });
            }
          });
        } else if (prod.category && typeof prod.category === "object" && prod.category.name) {
          const slug = prod.category.slug || prod.category.name.toLowerCase();
          if (!map.has(slug)) {
            map.set(slug, {
              _id: prod.category._id || prod.category.id,
              name: prod.category.name,
              slug,
            });
          }
        }
      });
    }

    return Array.from(map.values());
  }, [categories, products]);

  // Combine DB brands with any brands present in loaded products as fallback
  const availableBrands = useMemo(() => {
    const map = new Map();

    if (Array.isArray(brands)) {
      brands.forEach((b) => {
        if (b && b.name) {
          const slug = b.slug || b.name.toLowerCase();
          map.set(slug, { _id: b._id || b.id, name: b.name, slug });
        }
      });
    }

    // Fallback: extract from products
    if (Array.isArray(products)) {
      products.forEach((prod) => {
        if (Array.isArray(prod.brand)) {
          prod.brand.forEach((b) => {
            if (b && typeof b === "object" && b.name) {
              const slug = b.slug || b.name.toLowerCase();
              if (!map.has(slug)) {
                map.set(slug, { _id: b._id || b.id, name: b.name, slug });
              }
            } else if (typeof b === "string" && !map.has(b.toLowerCase())) {
              map.set(b.toLowerCase(), { _id: b, name: b, slug: b.toLowerCase() });
            }
          });
        } else if (prod.brand && typeof prod.brand === "object" && prod.brand.name) {
          const slug = prod.brand.slug || prod.brand.name.toLowerCase();
          if (!map.has(slug)) {
            map.set(slug, {
              _id: prod.brand._id || prod.brand.id,
              name: prod.brand.name,
              slug,
            });
          }
        } else if (typeof prod.brand === "string" && prod.brand.trim()) {
          const slug = prod.brand.toLowerCase().trim();
          if (!map.has(slug)) {
            map.set(slug, { _id: slug, name: prod.brand, slug });
          }
        }
      });
    }

    return Array.from(map.values());
  }, [brands, products]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 space-y-6 text-slate-800 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <TbFilter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition cursor-pointer"
          >
            <TbRefresh className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <TbX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TbCategory className="w-3.5 h-3.5 text-indigo-600" />
            <span>Category</span>
          </label>
          {filters.category !== "all" && (
            <button
              onClick={() => handleFilterChange("category", "all")}
              className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleFilterChange("category", "all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              filters.category === "all"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Categories
          </button>

          {availableCategories.map((c) => {
            const isSelected =
              filters.category?.toLowerCase() === c.slug?.toLowerCase() ||
              filters.category?.toLowerCase() === c.name?.toLowerCase() ||
              filters.category === c._id;

            return (
              <button
                key={c._id || c.slug}
                type="button"
                onClick={() => handleFilterChange("category", c.slug || c._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TbDeviceMobile className="w-3.5 h-3.5 text-indigo-600" />
            <span>Brand</span>
          </label>
          {filters.brand !== "all" && (
            <button
              onClick={() => handleFilterChange("brand", "all")}
              className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleFilterChange("brand", "all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              filters.brand === "all"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Brands
          </button>

          {availableBrands.map((b) => {
            const isSelected =
              filters.brand?.toLowerCase() === b.slug?.toLowerCase() ||
              filters.brand?.toLowerCase() === b.name?.toLowerCase() ||
              filters.brand === b._id;

            return (
              <button
                key={b._id || b.slug}
                type="button"
                onClick={() => handleFilterChange("brand", b.slug || b._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Price Range (Rs.)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min Rs."
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-1/2 p-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
          />
          <span className="text-slate-400 text-xs font-bold">-</span>
          <input
            type="number"
            placeholder="Max Rs."
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-1/2 p-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
