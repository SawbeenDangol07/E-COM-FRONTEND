import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TbSearch, TbPlus } from "react-icons/tb";

export const TableHeader = ({
  title,
  showSearch = true,
  btnUrl = null,
  btnTxt = null,
  getSearchResult,
}) => {
  const [search, setSearch] = useState("");

  // Debounce search by 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (getSearchResult) {
        getSearchResult({ search: search, page: 1, limit: 20 });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        {showSearch && (
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <TbSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 shadow-2xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        )}

        {btnUrl && btnTxt && (
          <Link
            to={btnUrl}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-500/20 shrink-0"
          >
            <TbPlus className="w-4 h-4" />
            <span>{btnTxt}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
