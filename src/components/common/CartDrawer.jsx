import { useCart } from "../../hooks/useCart";
import { Link, useNavigate } from "react-router";
import { resolveImageUrl } from "../../common/constants";
import {
  TbX,
  TbTrash,
  TbPlus,
  TbMinus,
  TbShoppingBag,
  TbArrowRight,
  TbShieldCheck,
} from "react-icons/tb";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 z-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <TbShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <TbShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs font-light">
                  Find verified mobile listings on MobiMarket to add to your order.
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm"
                >
                  Explore Mobiles
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const itemImg = resolveImageUrl(
                  item.image || item.images?.[0] || item.images,
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80"
                );

                return (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 transition"
                  >
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-xl bg-white border border-slate-200 shrink-0 p-1"
                    />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <span>
                            {typeof item.brand === "object"
                              ? item.brand?.name || (Array.isArray(item.brand) ? item.brand[0]?.name : "")
                              : item.brand || "Mobile"}
                          </span>
                          {item.storage && (
                            <>
                              <span>•</span>
                              <span>{item.storage}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                        >
                          <TbMinus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                        >
                          <TbPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Protection Fee</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600 font-black">Rs. {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <TbShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Buyer Escrow: Payment is held safe until you inspect the device.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-99 text-white text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shadow-indigo-500/20"
              >
                <span>Proceed to Checkout</span>
                <TbArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
