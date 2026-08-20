import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import productService from "../../services/product.service";
import { setActiveUser } from "../../reducer/UserReducer";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { ImeiVerifiedBadge } from "../../components/common/Badge";
import ProductCard from "../../components/product/ProductCard";
import {
  TbMessageDots,
  TbShoppingBag,
  TbShieldCheck,
  TbTruckDelivery,
  TbLock,
  TbArrowLeft,
  TbPhoto,
  TbGitBranch,
  TbTag,
} from "react-icons/tb";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { loggedInUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try getBySlug first, or fallback to getDetail
        let res;
        try {
          res = await productService.getBySlug(id);
        } catch {
          res = await productService.getDetail(id);
        }

        if (res.data) {
          const prod = res.data.product || res.data;
          setProduct(prod);
          setRelatedProducts(res.data.related || []);
        }
      } catch (err) {
        console.warn("Fetch product detail error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    setSelectedImageIndex(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-slate-900">
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-slate-100 rounded-3xl border border-slate-200" />
          <div className="lg:col-span-5 h-96 bg-slate-100 rounded-3xl border border-slate-200" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4 text-slate-900">
        <h2 className="text-xl font-bold text-slate-900">Mobile product not found</h2>
        <p className="text-xs text-slate-500 font-light">
          The listing you are looking for has either been sold or removed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) => (typeof img === "object" ? img.url : img))
      : [];

  const mainImageUrl = images[selectedImageIndex] || null;

  const displayPrice = (product.price ? product.price / 100 : 0).toFixed(2);
  const displayAfterDiscount = (
    product.afterDiscount ? product.afterDiscount / 100 : product.price ? product.price / 100 : 0
  ).toFixed(2);

  const brandName = Array.isArray(product.brand)
    ? product.brand[0]?.name || product.brand[0]?.slug || ""
    : typeof product.brand === "object"
    ? product.brand?.name || product.brand?.slug || ""
    : product.brand;

  const handleChatWithSeller = () => {
    if (!loggedInUser) {
      toast.info("Please sign in to chat and negotiate with the seller");
      navigate("/login");
      return;
    }
    if (product.seller) {
      dispatch(setActiveUser(product.seller));
      navigate("/chat");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: productId,
      price: Number(displayAfterDiscount),
      image: mainImageUrl,
    });
  };

  return (
    <div className="space-y-12 text-slate-900">
      {/* Breadcrumb back */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Back to Mobile Marketplace</span>
        </Link>
      </div>

      {/* Main Showcase: Gallery (Left) + Details & Purchase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-white rounded-3xl border border-slate-200/90 p-8 flex items-center justify-center overflow-hidden shadow-xs">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt={product.name}
                className="w-full h-full object-contain object-center transition-all duration-300"
              />
            ) : (
              <TbPhoto className="w-20 h-20 text-slate-300" />
            )}

            {/* Badges on main image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
              <ImeiVerifiedBadge />
              {product.discount > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl bg-white border p-1.5 overflow-hidden shrink-0 transition cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pricing, Specs, Seller, CTAs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-1.5">
              {brandName && (
                <Link
                  to={`/brand/${brandName.toLowerCase()}`}
                  className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition"
                >
                  {brandName}
                </Link>
              )}
              {Array.isArray(product.category) &&
                product.category.map((c) => (
                  <Link
                    key={c._id || c}
                    to={`/category/${c.slug || c}`}
                    className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium hover:bg-slate-200 transition"
                  >
                    {c.name || "Category"}
                  </Link>
                ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-baseline justify-between shadow-2xs">
            <div>
              <span className="text-xs text-indigo-600/80 block mb-0.5 font-medium">
                Verified Marketplace Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  Rs. {displayAfterDiscount}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    Rs. {displayPrice}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  (product.stock || 0) > 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {(product.stock || 0) > 0 ? `${product.stock} In Stock` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* CTAs: Add to Cart & Chat with Seller */}
          <div className="space-y-2.5">
            <button
              onClick={handleAddToCart}
              disabled={(product.stock || 0) <= 0}
              className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-99 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 transition cursor-pointer"
            >
              <TbShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            {product.seller && (
              <button
                onClick={handleChatWithSeller}
                className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-50 active:scale-99 border border-slate-200 text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <TbMessageDots className="w-5 h-5 text-indigo-600" />
                <span>Chat & Negotiate with Seller</span>
              </button>
            )}
          </div>

          {/* Seller Profile Summary Card */}
          {product.seller && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Device Seller
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Active Seller</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {product.seller.name ? product.seller.name[0].toUpperCase() : "S"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {product.seller.name}
                    </h4>
                    <TbShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" title="Verified Seller" />
                  </div>
                  <p className="text-xs text-slate-400 font-light truncate">
                    {product.seller.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-2 font-light">
            <div className="flex items-center gap-2">
              <TbLock className="w-4 h-4 text-slate-700 shrink-0" />
              <span>
                <strong className="text-slate-800 font-semibold">Escrow Protection:</strong> Funds held safe until device verification.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TbTruckDelivery className="w-4 h-4 text-slate-700 shrink-0" />
              <span>
                <strong className="text-slate-800 font-semibold">Fast Shipping:</strong> Tracked courier dispatch nationwide.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="pt-8 border-t border-slate-200 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-3 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Seller Notes & Condition Description
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl font-light whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Related Mobile Devices
            </h3>
            <Link
              to="/products"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              Browse all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
