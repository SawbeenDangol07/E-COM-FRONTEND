import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser, getAllUsers } from "../../reducer/UserReducer";
import { TbUsers, TbSearch, TbUser } from "react-icons/tb";

export default function ChatUserList({ activeUser }) {
  const dispatch = useDispatch();
  const { allUserList: users, loading } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    dispatch(getAllUsers({ search: val }));
  };

  return (
    <aside className="w-80 bg-slate-50/80 border-r border-slate-200 flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white space-y-3">
        <div className="flex items-center gap-2">
          <TbUsers className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-base tracking-tight">
            Conversations
          </h2>
        </div>

        {/* Search input */}
        <div className="relative">
          <TbSearch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users or sellers..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {loading && users.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading contacts...</div>
        ) : users && users.length > 0 ? (
          users.map((user) => {
            const isSelected = activeUser?._id === user._id;
            const avatarUrl = user.image?.url || (typeof user.image === "string" ? user.image : null);

            return (
              <div
                key={user._id}
                onClick={() => dispatch(setActiveUser(user))}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  isSelected
                    ? "bg-indigo-50/80 border border-indigo-100 shadow-2xs"
                    : "bg-white/60 hover:bg-white hover:shadow-2xs border border-transparent"
                }`}
              >
                {/* Avatar with Green Online Indicator Dot */}
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {user.name ? user.name[0].toUpperCase() : <TbUser className="w-5 h-5" />}
                    </div>
                  )}
                  {/* Green online indicator dot */}
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white shadow-2xs"
                    title="Online"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={`text-sm font-bold truncate ${
                        isSelected ? "text-indigo-900" : "text-slate-900"
                      }`}
                    >
                      {user.name}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        user.role === "admin"
                          ? "bg-rose-50 text-rose-700"
                          : user.role === "seller"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate font-light mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600">No users found</p>
            <p className="font-light">No matching platform members.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
