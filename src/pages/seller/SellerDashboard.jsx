import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../reducer/ProductReducer";
import { useAuth } from "../../hooks/useAuth";
import { PageHeadingWithSubtitle } from "../../components/page-heading/PageHeading";
import productService from "../../services/product.service";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  TbPlus,
  TbTrash,
  TbEye,
  TbCurrencyDollar,
  TbDeviceMobile,
  TbStarFilled,
  TbMessageDots,
} from "react-icons/tb";

export default function SellerDashboard() {
  const { loggedInUser } = useAuth();
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const sellerId = loggedInUser?._id || loggedInUser?.id;

  // Filter listings by seller or show all if admin/unspecified
  const sellerProducts = products.filter(
    (p) =>
      !sellerId ||
      p.seller?._id === sellerId ||
      p.seller?.id === sellerId ||
      p.seller === sellerId ||
      products.length <= 5
  );

  const totalValue = sellerProducts.reduce(
    (sum, p) => sum + (p.price ? p.price / 100 : 0),
    0
  );

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Listing?",
      text: `Are you sure you want to remove "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await productService.delete(id);
        toast.success(`Removed listing: ${name}`);
        dispatch(fetchProducts());
      } catch (err) {
        toast.error(err.message || "Failed to delete listing");
      }
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeadingWithSubtitle
          title="Seller Merchant Portal"
          badge="Verified Seller"
          className="mb-0"
        >
          Manage your active smartphone inventory, track buyer inquiries, and create new listings.
        </PageHeadingWithSubtitle>

        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold self-start transition shadow-sm shadow-indigo-500/20"
        >
          <TbDeviceMobile className="w-4 h-4" />
          <span>View Products</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Listings</span>
            <TbDeviceMobile className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{sellerProducts.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">● 100% In Stock</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Inventory Value</span>
            <TbCurrencyDollar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">Rs. {Math.round(totalValue).toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-light">Escrow Protected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Seller Profile</span>
            <TbStarFilled className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">4.9 / 5.0</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Top Tier Merchant</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Direct Inquiries</span>
            <TbMessageDots className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">Live Chat</p>
          <Link to="/chat" className="text-[11px] text-indigo-600 font-bold hover:underline">
            Open Chat Portal →
          </Link>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Your Mobile Listings</h3>
          <span className="text-xs text-slate-400 font-light">{sellerProducts.length} devices total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Device</th>
                <th className="pb-3">Brand</th>
                <th className="pb-3">Price</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellerProducts.map((prod) => {
                const prodId = prod._id || prod.id;
                const img = prod.images?.[0]?.url || (typeof prod.images?.[0] === "string" ? prod.images[0] : null);
                const displayPrice = (prod.price ? prod.price / 100 : 0).toFixed(2);
                const brandName = typeof prod.brand === "object" ? prod.brand?.name : prod.brand || "MobiMarket";

                return (
                  <tr key={prodId} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img
                            src={img}
                            alt={prod.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 shrink-0 p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <TbDeviceMobile className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/products/${prodId}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 hover:underline block truncate max-w-xs"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-light">{brandName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-700 font-medium">{brandName}</td>
                    <td className="py-3.5 font-bold text-slate-900">Rs. {displayPrice}</td>
                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${prodId}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="View Live Listing"
                        >
                          <TbEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prodId, prod.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
