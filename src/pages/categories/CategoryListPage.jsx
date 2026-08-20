import { useEffect, useState } from "react";
import { TableHeader } from "../../components/ui/TableHeader";
import { RowSkeleton } from "../../components/ui/table/TableSkeleton";
import { RowActions } from "../../components/ui/table/RowAction";
import { useAuth } from "../../hooks/useAuth";
import categoryService from "../../services/category.service";
import { toast } from "sonner";
import { TbCategory, TbPhoto, TbGitBranch } from "react-icons/tb";

export default function CategoryListPage() {
  const { loggedInUser } = useAuth();
  const role = loggedInUser?.role || "admin";
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryList = async ({ search = "" } = {}) => {
    setLoading(true);
    setSearchQuery(search);
    try {
      const response = await categoryService.listAll();
      setCategories(response.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const onDeleteConfirm = async (id) => {
    try {
      setLoading(true);
      await categoryService.delete(id);
      toast.success("Category deleted successfully");
      await getCategoryList({ search: searchQuery });
    } catch (err) {
      toast.error(err.message || "Error deleting category");
      setLoading(false);
    }
  };

  // Filter categories by search query if present
  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.parent?.name?.toLowerCase().includes(q) ||
      cat.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <TableHeader
        title="Mobile Categories"
        showSearch={true}
        btnTxt="Add Category"
        btnUrl={`/${role}/category/create`}
        getSearchResult={getCategoryList}
      />

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Parent Category</th>
                <th className="px-6 py-4">Associated Brands</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <RowSkeleton rows={5} columns={6} />
              ) : filteredCategories && filteredCategories.length > 0 ? (
                filteredCategories.map((item) => {
                  const imageUrl =
                    item.image?.secure_url || item.image?.url || item.image?.thumbUrl;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name ? item.name[0].toUpperCase() : "C"}
                          </div>
                          <div>
                            <p className="leading-tight">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono font-normal">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="px-6 py-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <TbPhoto className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Parent */}
                      <td className="px-6 py-4">
                        {item.parent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100">
                            <TbGitBranch className="w-3.5 h-3.5" />
                            <span>{item.parent.name || "Subcategory"}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-light italic text-[11px]">
                            — Root Category —
                          </span>
                        )}
                      </td>

                      {/* Brands */}
                      <td className="px-6 py-4">
                        {item.brands && item.brands.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {item.brands.map((b) => (
                              <span
                                key={b._id || b}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                              >
                                {b.name || "Brand"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-light">None</span>
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
                          <span>
                            {item.status === "active" ? "Published" : "Un-Published"}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <RowActions
                          editUrl={`/${role}/category/${item._id}`}
                          rowId={item._id}
                          onDeleteConfirm={onDeleteConfirm}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <TbCategory className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">
                        No Categories Found
                      </p>
                      <p className="text-xs text-slate-400 font-light">
                        No mobile categories match your query. Click &quot;Add Category&quot; to create one.
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
