import { useEffect, useState } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { TablePagination } from "../../components/ui/table/TablePagination";
import { RowActions } from "../../components/ui/table/RowAction";
import { useAuth } from "../../hooks/useAuth";
import productService from "../../services/product.service";
import { toast } from "sonner";
import { TbDeviceMobile, TbPhoto, TbEye } from "react-icons/tb";
import { Link } from "react-router";
import { resolveImageUrl } from "../../common/constants";

export default function AdminProductListPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    total: 0,
    totalNoOfpages: 1,
  });

  const getProductList = async ({ page = 1, limit = 20, search = "" } = {}) => {
    setLoading(true);
    try {
      const response = await productService.listAll({ page, limit, search });
      setProducts(response.data || []);
      if (response.meta?.pagination) {
        setPagination(response.meta.pagination);
      } else if (response.meta) {
        setPagination({
          page: response.meta.page || page,
          limit: response.meta.limit || limit,
          total: response.meta.total || (response.data ? response.data.length : 0),
          totalNoOfpages: Math.ceil((response.meta.total || 1) / (response.meta.limit || limit)),
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductList({ page: 1, limit: 20, search: "" });
  }, []);

  const onDeleteConfirm = async (id) => {
    try {
      setLoading(true);
      await productService.delete(id);
      toast.success("Product deleted successfully");
      await getProductList({ page: 1, limit: 20, search: "" });
    } catch (err) {
      toast.error(err.message || "Error deleting product");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Mobile Products"
        showSearch={true}
        btnTxt="Add Product"
        btnUrl={`/${role}/products/create`}
        getSearchResult={getProductList}
      />

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4">Phone / Model</th>
                <th className="px-5 py-4">Thumbnail</th>
                <th className="px-5 py-4">Price (NPR)</th>
                <th className="px-5 py-4">Brand</th>
                <th className="px-5 py-4">Seller</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={5} columns={7} />
              ) : products && products.length > 0 ? (
                products.map((item) => {
                  const firstImg = resolveImageUrl(item.images?.[0] || item.image || item.images);
                  const displayPrice = (item.price / 100).toFixed(2);
                  const displayAfterDiscount = (item.afterDiscount / 100).toFixed(2);

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      {/* Name & SKU */}
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                        <div className="min-w-0 max-w-xs">
                          <p className="truncate hover:text-indigo-600 transition">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.sku && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                SKU: {item.sku}
                              </span>
                            )}
                            <span className="text-[10px] text-indigo-500 font-mono">
                              /{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="px-5 py-4">
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <TbPhoto className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-sm">
                            Rs. {displayAfterDiscount}
                          </p>
                          {item.discount > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="line-through text-slate-400 font-light">
                                Rs. {displayPrice}
                              </span>
                              <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                {item.discount}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Brand & Category */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {item.brand && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                              {Array.isArray(item.brand)
                                ? item.brand[0]?.name || "Brand"
                                : typeof item.brand === "object"
                                ? item.brand?.name || "Brand"
                                : item.brand}
                            </span>
                          )}
                          {item.category && Array.isArray(item.category) && item.category.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.category.map((c, i) => (
                                <span
                                  key={c._id || c.slug || i}
                                  className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] border border-slate-200 font-medium"
                                >
                                  {typeof c === "object" ? c?.name || c?.slug || "Category" : c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            (item.stock || 0) > 0
                              ? "bg-slate-100 text-slate-700"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {(item.stock || 0) > 0 ? `${item.stock} in stock` : "Out of stock"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                            item.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>
                            {item.status === "active" ? "Published" : "Un-Published"}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/products/${item.slug || item._id}`}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
                            title="View Public Page"
                          >
                            <TbEye className="w-4 h-4" />
                          </Link>
                          <RowActions
                            editUrl={`/${role}/products/${item._id}`}
                            rowId={item._id}
                            onDeleteConfirm={onDeleteConfirm}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <TbDeviceMobile className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No Products Found</p>
                      <p className="text-xs text-slate-400 font-light">
                        No mobile devices match your search. Click &quot;Add Product&quot; to list one.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && (
          <div className="p-4 bg-slate-50/50">
            <TablePagination pagination={pagination} getDataAction={getProductList} />
          </div>
        )}
      </div>
    </div>
  );
}
