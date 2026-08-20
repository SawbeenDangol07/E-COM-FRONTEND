import { Link } from "react-router";
import { useCart } from "../../hooks/useCart";
import { TbPlus, TbPhoto } from "react-icons/tb";
import { resolveImageUrl } from "../../common/constants";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const productId = product._id || product.id;
  const productSlug = product.slug || productId;

  const rawImage = product.images?.[0] || product.image;
  const imageUrl = resolveImageUrl(rawImage);

  const brandName = Array.isArray(product.brand)
    ? product.brand[0]?.name || product.brand[0]?.slug || ""
    : typeof product.brand === "object"
    ? product.brand?.name || product.brand?.slug || ""
    : product.brand;

  // Real backend stores price * 100 in cents
  const finalPrice = product.afterDiscount
    ? (product.afterDiscount / 100).toFixed(2)
    : product.price
    ? (product.price / 100).toFixed(2)
    : "0.00";

  const originalPrice =
    product.discount > 0 && product.price
      ? (product.price / 100).toFixed(2)
      : product.originalPrice
      ? Number(product.originalPrice).toFixed(2)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      id: productId,
      price: Number(finalPrice),
      image: imageUrl,
    });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50/80 flex items-center justify-center p-6">
        <Link
          to={`/products/${productSlug}`}
          className="w-full h-full flex items-center justify-center"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <TbPhoto className="w-12 h-12 text-slate-300" />
          )}
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          {/* Subtitle: Brand */}
          {brandName && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <span className="text-indigo-600 font-semibold">{brandName}</span>
            </div>
          )}

          {/* Title */}
          <Link
            to={`/products/${productSlug}`}
            className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-900">
                Rs. {finalPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  Rs. {originalPrice}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-light truncate max-w-[140px]">
              {product.seller?.name || "Verified Listing"}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold transition cursor-pointer shadow-xs shadow-indigo-500/20"
            title="Add to Cart"
          >
            <TbPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
