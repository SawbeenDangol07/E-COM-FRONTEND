import { useEffect, useState } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { TablePagination } from "../../components/ui/table/TablePagination";
import { RowActions } from "../../components/ui/table/RowAction";
import { useAuth } from "../../hooks/useAuth";
import brandService from "../../services/brand.service";
import { toast } from "sonner";
import { TbTag, TbPhoto } from "react-icons/tb";
import { resolveImageUrl } from "../../common/constants";

export default function BrandListPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getBrandList = async ({ search = "" } = {}) => {
    setLoading(true);
    setSearchQuery(search);
    try {
      const response = await brandService.listAll({ search });
      setBrands(response.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const onDeleteConfirm = async (id) => {
    try {
      setLoading(true);
      await brandService.delete(id);
      toast.success("Brand deleted successfully");
      await getBrandList({ search: searchQuery });
    } catch (err) {
      toast.error(err.message || "Error deleting brand");
      setLoading(false);
    }
  };

  // Filter brands locally if needed
  const filteredBrands = brands.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return b.name?.toLowerCase().includes(q) || b.status?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Mobile Brands"
        showSearch={true}
        btnTxt="Add Brand"
        btnUrl={`/${role}/brands/create`}
        getSearchResult={getBrandList}
      />

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4">Brand Name</th>
                <th className="px-6 py-4">Brand Logo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={5} columns={4} />
              ) : filteredBrands && filteredBrands.length > 0 ? (
                filteredBrands.map((item) => {
                  const logoUrl = resolveImageUrl(item.logo || item.image);

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name ? item.name[0].toUpperCase() : "B"}
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="px-6 py-4">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <TbPhoto className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
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
                          <span>{item.status === "active" ? "Published" : "Un-Published"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <RowActions
                          editUrl={`/${role}/brands/${item._id}`}
                          rowId={item._id}
                          onDeleteConfirm={onDeleteConfirm}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <TbTag className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No Brands Found</p>
                      <p className="text-xs text-slate-400 font-light">
                        No mobile brands match your query. Click &quot;Add Brand&quot; to create one.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
