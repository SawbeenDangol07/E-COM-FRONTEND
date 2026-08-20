import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import brandService from "../../services/brand.service";
import productService from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import { TbArrowLeft, TbDeviceMobileX, TbLoader2, TbPhoto, TbTag } from "react-icons/tb";
import { resolveImageUrl } from "../../common/constants";

export default function BrandDetailPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      setLoading(true);
      try {
        const response = await brandService.getBySlug(slug);
        if (response.data) {
          const brandObj = response.data.brand || response.data.category || { name: slug };
          setBrandData(brandObj);
          let prods = response.data.products || [];
          if (prods.length === 0) {
            try {
              const prodRes = await productService.listPublic({ brand: brandObj._id || slug });
              prods = prodRes.data || [];
            } catch {}
          }
          setProducts(prods);
        }
      } catch (err) {
        console.warn("Brand slug fetch error:", err.message);
        try {
          const prodRes = await productService.listPublic({ brand: slug });
          setBrandData({ name: slug });
          setProducts(prodRes.data || []);
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <TbLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading brand devices...</p>
      </div>
    );
  }

  const brandName = brandData?.name || slug.toUpperCase();
  const logoUrl = resolveImageUrl(brandData?.logo || brandData?.image);

  return (
    <div className="space-y-8 text-slate-900">
      {/* Back Link */}
      <div>
        <Link
          to="/brands"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>All Brands</span>
        </Link>
      </div>

      {/* Brand Hero Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-center shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="w-full h-full object-contain"
            />
          ) : (
            <TbPhoto className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <PageHeadingWithSubtitle
            title={brandName}
            badge={`${products.length} Products`}
            className="mb-0"
          >
            Explore all certified devices and smartphone models manufactured by {brandName}.
          </PageHeadingWithSubtitle>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Available {brandName} Models
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
              No devices currently listed under {brandName}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm font-light">
              Check back soon or explore our other available smartphone brands.
            </p>
            <Link
              to="/brands"
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-xs"
            >
              Browse All Brands
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
