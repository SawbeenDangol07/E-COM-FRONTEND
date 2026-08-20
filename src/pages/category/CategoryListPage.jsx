import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../reducer/ProductReducer";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import { TbArrowRight, TbPhoto, TbGitBranch } from "react-icons/tb";
import { resolveImageUrl, getCategoryFallbackImage } from "../../common/constants";

export default function CategoryListPage() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900">
      {/* Heading */}
      <PageHeadingWithSubtitle
        title="Mobile Categories"
        badge={`${categories.length} Collections`}
      >
        Browse smartphones organized by form factor, hardware tier, and ecosystem.
      </PageHeadingWithSubtitle>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const fallbackImg = getCategoryFallbackImage(cat);
          const imageUrl = resolveImageUrl(cat.image, fallbackImg);

          return (
            <Link
              key={cat._id || cat.id}
              to={`/category/${cat.slug}`}
              className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-xs"
            >
              <div className="space-y-3.5">
                {/* Image banner */}
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                  />

                  {cat.parent && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 shadow-2xs flex items-center gap-1">
                      <TbGitBranch className="w-3 h-3" />
                      <span>{cat.parent.name || "Subcategory"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 font-normal">
                    /{cat.slug}
                  </p>
                </div>

                {/* Brands badges */}
                {cat.brands && cat.brands.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.brands.map((b) => (
                      <span
                        key={b._id || b}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200/60"
                      >
                        {b.name || "Brand"}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action link */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition">
                <span>Explore collection</span>
                <TbArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
