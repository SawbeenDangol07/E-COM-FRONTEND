import { useEffect, useState, useCallback } from "react";
import chatService from "../../services/chat.service";
import { TbUsers, TbShieldCheck, TbSearch, TbX, TbUser, TbLoader2 } from "react-icons/tb";

export default function AdminUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const response = await chatService.listUsers({ search: q, limit: 100 });
      setUsers(response.data || []);
    } catch (err) {
      console.warn("Failed to fetch platform users:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadUsers(val);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TbUsers className="w-6 h-6 text-indigo-600" />
            <span>Platform Users & Accounts</span>
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Audit registered members, merchant accounts, and platform roles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <TbSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4">User Profile</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <TbLoader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                    <span>Loading platform users...</span>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const avatarUrl = u.image?.url || (typeof u.image === "string" ? u.image : null);
                  const dateStr = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Active";

                  return (
                    <tr key={u._id || u.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {u.name ? u.name[0].toUpperCase() : <TbUser className="w-4 h-4" />}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {u.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-light">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : u.role === "seller"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            u.status === "active" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span>{u.status === "active" ? "Active" : "Inactive"}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500 font-light">{dateStr}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No users found matching your search.
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
