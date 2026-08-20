import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../reducer/ProductReducer";
import bannerService from "../services/banner.service";
import ProductCard from "../components/product/ProductCard";
import { TbArrowRight, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { resolveImageUrl } from "../common/constants";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: products, categories } = useSelector((state) => state.products);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [banners, setBanners] = useState([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());

    // Fetch active banners for storefront carousel
    bannerService
      .listForHome()
      .then((res) => {
        setBanners(res.data || []);
      })
      .catch((err) => console.warn("Failed to load home banners:", err.message));
  }, [dispatch]);

  // Auto-advance banner carousel every 5s if multiple banners exist
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const filteredProducts =
    selectedCategoryTab === "all"
      ? products.slice(0, 8)
      : products.filter((p) => {
          if (Array.isArray(p.category)) {
            return p.category.some(
              (c) => (c.slug || c._id || c) === selectedCategoryTab
            );
          }
          return (p.category?.slug || p.category) === selectedCategoryTab;
        });

  return (
    <div className="space-y-8 sm:space-y-12 text-slate-900">
      {/* PROMOTIONAL BANNER CAROUSEL SLIDER */}
      {banners.length > 0 && (
        <section className="relative rounded-3xl overflow-hidden shadow-lg shadow-slate-900/10 group aspect-16/9 sm:aspect-21/9 min-h-[220px] sm:min-h-[280px] max-h-[420px] bg-slate-950 flex items-center justify-center">
          {banners.map((b, idx) => {
            const bannerImg = resolveImageUrl(b.image);
            const isActive = idx === currentBannerIdx;

            return (
              <a
                key={b._id || idx}
                href={b.url || "#"}
                target={b.url?.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex items-center justify-center ${
                  isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                {bannerImg && (
                  <img
                    src={bannerImg}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Subtle Gradient & Title overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4 sm:p-8 lg:p-10">
                  <div className="space-y-1.5 sm:space-y-2 max-w-xl text-white">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-indigo-600/90 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                      Special Offer
                    </span>
                    <h2 className="text-base sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug line-clamp-2">
                      {b.title}
                    </h2>
                  </div>
                </div>
              </a>
            );
          })}

          {/* Carousel navigation buttons */}
          {banners.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
                }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-md shadow-md z-20 transition cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                title="Previous banner"
              >
                <TbChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
                }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-md shadow-md z-20 transition cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                title="Next banner"
              >
                <TbChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBannerIdx(i)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      i === currentBannerIdx ? "w-5 sm:w-6 bg-white" : "w-1.5 sm:w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* FEATURED PRODUCTS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Featured Mobiles & Flagships
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
              Verified smartphones with clean IMEI checks and escrow protection.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                selectedCategoryTab === "all"
                  ? "bg-indigo-600 text-white font-bold shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              All Phones
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat._id || cat.id}
                onClick={() => setSelectedCategoryTab(cat.slug || cat._id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                  selectedCategoryTab === (cat.slug || cat._id)
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs space-y-1">
            <p className="font-semibold text-slate-700">No mobile listings found in this category.</p>
            <p className="font-light">Try selecting another category or view all devices.</p>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition shadow-2xs"
          >
            <span>View All Mobile Listings ({products.length})</span>
            <TbArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
