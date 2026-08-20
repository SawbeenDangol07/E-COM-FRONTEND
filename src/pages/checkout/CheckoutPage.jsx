import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import orderService from "../../services/order.service";
import { resolveImageUrl } from "../../common/constants";
import {
  TbTruckDelivery,
  TbShieldCheck,
  TbArrowRight,
  TbLock,
  TbCheck,
  TbShoppingBag,
  TbLoader2,
  TbWallet,
  TbCash,
  TbMapPin,
  TbPhone,
  TbUser,
  TbMail,
} from "react-icons/tb";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  // Shipping Form State (Aligned with Nepal Delivery Details)
  const [shippingData, setShippingData] = useState({
    fullName: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    phone: loggedInUser?.phone || "9841000000",
    city: loggedInUser?.city || "Kathmandu",
    address: loggedInUser?.address || "New Road, Kathmandu",
    deliveryNotes: "Please call before arriving for delivery.",
  });

  // Payment Option: 'khalti' | 'cod' (Aligned strictly with Backend PaymentDTO)
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!loggedInUser) {
      toast.info("Please sign in to place and track your order.");
      navigate("/login");
      return;
    }

    if (!shippingData.fullName.trim() || !shippingData.phone.trim() || !shippingData.address.trim()) {
      toast.error("Please complete all required shipping fields.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Sync cart items to Backend Cart
      let lastCartResponse = null;
      for (const item of cart) {
        const prodId = item._id || item.id;
        if (prodId) {
          try {
            lastCartResponse = await orderService.addToCart({
              product: prodId,
              quantity: item.quantity || 1,
            });
          } catch (err) {
            console.warn("Backend add-to-cart notice:", err.message);
          }
        }
      }

      // If lastCartResponse didn't contain orderId, attempt getCart
      let cartId = lastCartResponse?.data?.orderId;
      if (!cartId) {
        const activeCartRes = await orderService.getCart();
        cartId = activeCartRes?.data?.[0]?.orderId || activeCartRes?.data?.orderId;
      }

      if (!cartId) {
        throw new Error("Could not initialize order with backend cart.");
      }

      // 2. Checkout the cart to transition to 'new' status
      const checkoutRes = await orderService.checkout({
        cartId,
        discount: 0,
      });
      const createdOrderId = checkoutRes.data?.orderId || cartId;

      // 3. Initiate Payment (Khalti vs COD)
      if (paymentMethod === "khalti") {
        const payRes = await orderService.initiatePayment({
          orderId: createdOrderId,
          method: "khalti",
        });

        const paymentUrl =
          payRes.data?.payment_url ||
          payRes.data?.data?.payment_url ||
          payRes.data?.url;

        if (paymentUrl) {
          clearCart();
          toast.info("Connecting to Khalti payment gateway...");
          window.location.href = paymentUrl;
          return;
        } else {
          toast.info("Order created. Please proceed to payment in your orders portal.");
          clearCart();
          navigate("/orders");
          return;
        }
      } else {
        // Cash on Delivery
        await orderService.initiatePayment({
          orderId: createdOrderId,
          method: "cod",
        });

        clearCart();
        toast.success("Order Placed Successfully with Cash on Delivery!");
        navigate(`/orders`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 text-slate-900">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
          <TbShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 font-light max-w-sm mx-auto">
          You have no mobile phones in your cart right now. Explore verified listings to add a phone to your order.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
        >
          <span>Explore Mobiles</span>
          <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-900 max-w-5xl mx-auto py-4">
      {/* Heading */}
      <PageHeadingWithSubtitle
        title="Checkout & Payment"
        badge="Khalti & Escrow Verified"
        className="mb-0"
      >
        Complete your delivery details and choose your payment method.
      </PageHeadingWithSubtitle>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Option Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TbTruckDelivery className="w-4 h-4 text-indigo-600" />
                <span>1. Delivery & Shipping Information</span>
              </h2>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Free Express Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1 font-bold">
                  Recipient Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbUser className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sabin Dangol"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbPhone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="98XXXXXXXX"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbMail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    placeholder="sabin@example.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <select
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Nepalgunj">Nepalgunj</option>
                  <option value="Other">Other City / District</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Street / Tole / Area <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbMapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. New Road, Ward 22"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1 font-bold">
                  Delivery Notes / Landmark
                </label>
                <input
                  type="text"
                  name="deliveryNotes"
                  value={shippingData.deliveryNotes}
                  onChange={handleInputChange}
                  placeholder="e.g. Near main square, call when arriving"
                  className="w-full p-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TbWallet className="w-4 h-4 text-indigo-600" />
                <span>2. Select Payment Method</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-light flex items-center gap-1">
                <TbLock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Escrow Security</span>
              </span>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Khalti Digital Wallet */}
              <div
                onClick={() => setPaymentMethod("khalti")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between gap-3 ${
                  paymentMethod === "khalti"
                    ? "bg-purple-50/70 border-purple-600 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      K
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">Khalti Wallet</p>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                          INSTANT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        Wallet, e-Banking, Mobile Banking, SCT
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === "khalti"
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "khalti" && <TbCheck className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[10px] text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-lg font-medium">
                  Direct official Khalti payment gateway integration
                </p>
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between gap-3 ${
                  paymentMethod === "cod"
                    ? "bg-indigo-50/70 border-indigo-600 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <TbCash className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        Pay upon doorstep inspection
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === "cod"
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "cod" && <TbCheck className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg font-medium">
                  Inspect phone in person before handing payment
                </p>
              </div>
            </div>

            {/* Khalti Banner Callout */}
            {paymentMethod === "khalti" && (
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3 text-xs text-purple-900 animate-in fade-in duration-150">
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Instant Khalti Gateway Redirection</p>
                  <p className="text-[11px] text-purple-700 leading-relaxed font-light">
                    When you click "Pay with Khalti", you will be securely redirected to the official Khalti payment portal to complete payment with your Khalti account, ConnectIPS, or digital banking.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Order Summary ({cart.length} item{cart.length > 1 ? "s" : ""})
            </h3>

            {/* List of items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => {
                const itemImg = resolveImageUrl(
                  item.image || item.images?.[0] || item.images,
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80"
                );

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0"
                      />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-light">
                        {typeof item.brand === "object"
                          ? item.brand?.name || (Array.isArray(item.brand) ? item.brand[0]?.name : "")
                          : item.brand || "Mobile"}
                        {item.storage ? ` • ${item.storage}` : ""} • Qty: {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              );
            })}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier (Nepal)</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>48h Inspection Protection</span>
                <span className="text-emerald-600 font-semibold">Included</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-indigo-600 font-black">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Escrow Note */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-[11px] text-emerald-800">
              <TbShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                Your payment is held in safe escrow and only released to the seller after your 48-hour inspection period.
              </p>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full py-3.5 px-4 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50 active:scale-98 ${
                paymentMethod === "khalti"
                  ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
              }`}
            >
              {isProcessing ? (
                <>
                  <TbLoader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Order...</span>
                </>
              ) : paymentMethod === "khalti" ? (
                <>
                  <span>Pay with Khalti (Rs. {cartTotal.toLocaleString()})</span>
                  <TbArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Place Order with COD (Rs. {cartTotal.toLocaleString()})</span>
                  <TbArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
