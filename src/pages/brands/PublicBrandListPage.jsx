import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../../reducer/ProductReducer";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import { TbSearch, TbArrowRight, TbPhoto, TbTag } from "react-icons/tb";

export default function PublicBrandListPage() {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = brands.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeadingWithSubtitle
          title="Mobile Brands"
          badge={`${brands.length} Manufacturers`}
          className="mb-0"
        >
          Explore devices from top global smartphone manufacturers and tech pioneers.
        </PageHeadingWithSubtitle>

        {/* Search */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands (e.g. Apple, Samsung)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 shadow-2xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {filteredBrands.map((brand) => (
            <Link
              key={brand._id || brand.id}
              to={`/brand/${brand.slug || brand.name.toLowerCase()}`}
              className="group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 p-5 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden"
            >
              {/* Brand Logo Container */}
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200">
                {brand.logo?.url ? (
                  <img
                    src={brand.logo.url}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <TbPhoto className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Title & Explore */}
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                  {brand.name}
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <TbArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto space-y-2">
          <TbTag className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-sm">No Brands Found</p>
          <p className="text-xs text-slate-400 font-light">
            No smartphone brands match &quot;{search}&quot;. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
