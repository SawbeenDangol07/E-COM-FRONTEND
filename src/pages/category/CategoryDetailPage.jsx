import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import categoryService from "../../services/category.service";
import ProductCard from "../../components/product/ProductCard";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import { TbArrowLeft, TbDeviceMobileX, TbLoader2, TbPhoto, TbGitBranch } from "react-icons/tb";

export default function CategoryDetailPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await categoryService.getBySlug(slug);
        if (response.data) {
          setCategoryData(response.data.category || null);
          setProducts(response.data.products || []);
        }
      } catch (err) {
        console.warn("Category slug fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading category mobiles...</p>
      </div>
    );
  }

  const catName = categoryData?.name || slug;
  const imageUrl =
    categoryData?.image?.secure_url ||
    categoryData?.image?.url ||
    categoryData?.image?.thumbUrl;

  return (
    <div className="space-y-8 text-slate-900">
      {/* Back Link */}
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Category Hero Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={catName}
              className="w-full h-full object-cover"
            />
          ) : (
            <TbPhoto className="w-10 h-10 text-slate-400" />
          )}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {categoryData?.parent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                <TbGitBranch className="w-3.5 h-3.5" />
                <span>{categoryData.parent.name || "Parent"}</span>
              </span>
            )}
          </div>

          <PageHeadingWithSubtitle
            title={catName}
            badge={`${products.length} Mobiles Listed`}
            className="mb-0"
          >
            Explore smartphones curated under the {catName} catalog classification.
          </PageHeadingWithSubtitle>

          {categoryData?.brands && categoryData.brands.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <span className="text-xs text-slate-400 font-light">Brands:</span>
              {categoryData.brands.map((b) => (
                <span
                  key={b._id || b}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80"
                >
                  {b.name || "Brand"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Phones in {catName}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <TbDeviceMobileX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No devices found in this category
            </h3>
            <p className="text-xs text-slate-500 max-w-sm font-light">
              Check back soon or explore other phone categories in our marketplace.
            </p>
            <Link
              to="/categories"
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-xs"
            >
              Browse All Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
