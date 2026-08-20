import { useEffect, useState, useCallback } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { TablePagination } from "../../components/ui/table/TablePagination";
import { RowActions } from "../../components/ui/table/RowAction";
import { useAuth } from "../../hooks/useAuth";
import bannerService from "../../services/banner.service";
import { toast } from "sonner";
import { TbPhoto, TbExternalLink, TbLayoutBoardSplit } from "react-icons/tb";

export default function BannerListPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";

  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    total: 0,
    totalNoOfpages: 1,
  });

  const getBannerList = useCallback(
    async ({ page = 1, limit = 20, search = "" } = {}) => {
      setLoading(true);
      try {
        const response = await bannerService.listAll({ page, limit, search });
        setBanners(response.data || []);
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
        toast.error(err.message || "Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getBannerList({ page: 1, limit: 20, search: "" });
  }, [getBannerList]);

  const onDeleteConfirm = async (id) => {
    try {
      setLoading(true);
      await bannerService.delete(id);
      toast.success("Banner deleted successfully");
      await getBannerList({ page: 1, limit: 20, search: "" });
    } catch (err) {
      toast.error(err.message || "Error deleting banner");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Promotional Banners"
        showSearch={true}
        btnTxt="Add Banner"
        btnUrl={`/${role}/banners/create`}
        getSearchResult={getBannerList}
      />

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Banner Image</th>
                <th className="px-5 py-4">Destination Link</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={5} columns={5} />
              ) : banners && banners.length > 0 ? (
                banners.map((item) => {
                  const bannerImg = item.image?.url || (typeof item.image === "string" ? item.image : null);

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      {/* Title */}
                      <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                        <div className="min-w-0 max-w-xs">
                          <p className="truncate hover:text-indigo-600 transition">
                            {item.title}
                          </p>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="px-5 py-4">
                        {bannerImg ? (
                          <img
                            src={bannerImg}
                            alt={item.title}
                            className="w-32 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-32 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <TbPhoto className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Destination Link */}
                      <td className="px-5 py-4">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium hover:underline max-w-xs truncate"
                          >
                            <span className="truncate">{item.url}</span>
                            <TbExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-light">None</span>
                        )}
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
                        <div className="flex items-center justify-center">
                          <RowActions
                            editUrl={`/${role}/banners/${item._id}`}
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <TbLayoutBoardSplit className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No Banners Found</p>
                      <p className="text-xs text-slate-400 font-light">
                        No promotional banners listed yet. Click &quot;Add Banner&quot; to create one.
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
            <TablePagination pagination={pagination} getDataAction={getBannerList} />
          </div>
        )}
      </div>
    </div>
  );
}
