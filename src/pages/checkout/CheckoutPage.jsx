import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import orderService from "../../services/order.service";
import { resolveImageUrl } from "../../common/constants";
import {
  TbTruckDelivery,
  TbArrowRight,
  TbShoppingBag,
  TbLoader2,
  TbWallet,
  TbCash,
  TbMapPin,
  TbPhone,
  TbUser,
  TbMail,
  TbCheck,
} from "react-icons/tb";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  // Clean empty shipping form state (No fake sample autofill)
  const [shippingData, setShippingData] = useState({
    fullName: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    phone: "",
    city: "",
    address: "",
    deliveryNotes: "",
  });

  // Payment Option: 'khalti' | 'cod'
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

    if (
      !shippingData.fullName.trim() ||
      !shippingData.phone.trim() ||
      !shippingData.city.trim() ||
      !shippingData.address.trim()
    ) {
      toast.error("Please fill in your recipient name, phone, city, and delivery address.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Clean existing backend cart so it matches the current frontend cart exactly
      const activeCartRes = await orderService.getCart().catch(() => null);
      const existingCart = activeCartRes?.data?.[0];
      if (existingCart && Array.isArray(existingCart.detail)) {
        const currentProductIds = new Set(cart.map((item) => String(item._id || item.id)));
        for (const item of existingCart.detail) {
          const itemProdId = String(item.product?._id || item.product);
          if (!currentProductIds.has(itemProdId)) {
            try {
              await orderService.updateCart(existingCart.orderId, {
                product: itemProdId,
                quantity: 0,
              });
            } catch (err) {
              console.warn("Clean stale cart item notice:", err.message);
            }
          }
        }
      }

      // 2. Sync current cart items to Backend Cart
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
            console.warn("Backend cart notice:", err.message);
          }
        }
      }

      let cartId = lastCartResponse?.data?.orderId;
      if (!cartId) {
        const freshCartRes = await orderService.getCart();
        cartId = freshCartRes?.data?.[0]?.orderId || freshCartRes?.data?.orderId;
      }

      if (!cartId) {
        throw new Error("Could not initialize order with cart.");
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
          toast.loading("Redirecting to Khalti payment gateway...");
          window.location.href = paymentUrl;
          return;
        } else {
          toast.info("Connecting to Khalti gateway. Please proceed to payment.");
          clearCart();
          navigate(`/orders?warning=Please complete your Khalti payment to confirm your order.&orderId=${createdOrderId}`);
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
        navigate(`/checkout/success?orderId=${createdOrderId}&payment=cod`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 text-slate-900">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
          <TbShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
          Explore verified mobile phones to add items to your checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-xs"
        >
          <span>Explore Mobiles</span>
          <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 max-w-4xl mx-auto py-4">
      {/* Clean Minimalist Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="text-xs text-slate-500 font-light mt-0.5">
          Enter your delivery address and choose your preferred payment option.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Minimalist Delivery & Payment Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <TbTruckDelivery className="w-4 h-4 text-indigo-600" />
                <span>Delivery Address</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbUser className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's full name"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbPhone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    placeholder="98XXXXXXXX"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbMail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <select
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full py-2 px-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm cursor-pointer"
                >
                  <option value="">Select City / District</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Nepalgunj">Nepalgunj</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Street / Area Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <TbMapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="Street, house no. or landmark"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Delivery Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="deliveryNotes"
                  value={shippingData.deliveryNotes}
                  onChange={handleInputChange}
                  placeholder="Any specific delivery instructions"
                  className="w-full py-2 px-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TbWallet className="w-4 h-4 text-indigo-600" />
              <span>Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Khalti Option */}
              <div
                onClick={() => setPaymentMethod("khalti")}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === "khalti"
                    ? "bg-purple-50/60 border-purple-500 ring-1 ring-purple-500/30 shadow-2xs"
                    : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    K
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Khalti Wallet</p>
                    <p className="text-[10px] text-slate-500 font-light">Online payment</p>
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

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === "cod"
                    ? "bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500/30 shadow-2xs"
                    : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <TbCash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-500 font-light">Pay at doorstep</p>
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
            </div>
          </div>
        </div>

        {/* Right Column: Minimalist Order Summary */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Order Summary ({cart.length})
            </h3>

            {/* Item List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => {
                const itemImg = resolveImageUrl(
                  item.image || item.images?.[0] || item.images,
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80"
                );

                return (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className="w-9 h-9 object-contain rounded-lg bg-slate-50 border border-slate-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-light">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0 text-xs">
                      Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-light">Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light">Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-600 font-black">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-1">
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50 active:scale-[0.99] ${
                  paymentMethod === "khalti"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <TbLoader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : paymentMethod === "khalti" ? (
                  <>
                    <span>Pay with Khalti (Rs. {cartTotal.toLocaleString()})</span>
                    <TbArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Confirm Order (Rs. {cartTotal.toLocaleString()})</span>
                    <TbArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
