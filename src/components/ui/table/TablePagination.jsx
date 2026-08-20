import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

export const TablePagination = ({ pagination, getDataAction }) => {
  if (!pagination || pagination.totalNoOfpages <= 1) {
    return null;
  }

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalNoOfpages || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
      <div>
        Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span> (Total: {pagination.total || 0})
      </div>

      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          disabled={currentPage <= 1}
          onClick={() => getDataAction({ page: currentPage - 1 })}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition shadow-2xs cursor-pointer"
          title="Previous Page"
        >
          <TbChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, ind) => {
          const pageNum = ind + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => {
                if (!isActive) {
                  getDataAction({ page: pageNum });
                }
              }}
              className={`w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white font-bold shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => getDataAction({ page: currentPage + 1 })}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition shadow-2xs cursor-pointer"
          title="Next Page"
        >
          <TbChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
