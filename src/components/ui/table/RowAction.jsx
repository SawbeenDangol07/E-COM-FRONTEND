import { Link } from "react-router";
import { TbPencil, TbTrash } from "react-icons/tb";
import Swal from "sweetalert2";

export const RowActions = ({ editUrl, rowId, onDeleteConfirm }) => {
  const deleteConfirm = async () => {
    const result = await Swal.fire({
      title: "Delete Brand?",
      text: "Are you sure you want to delete this brand? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl font-bold px-5 py-2.5",
        cancelButton: "rounded-xl font-bold px-5 py-2.5",
      },
    });

    if (result.isConfirmed) {
      await onDeleteConfirm(rowId);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        to={editUrl}
        className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition shadow-2xs"
        title="Edit Brand"
      >
        <TbPencil className="w-4 h-4" />
      </Link>
      <button
        type="button"
        onClick={deleteConfirm}
        className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition shadow-2xs cursor-pointer"
        title="Delete Brand"
      >
        <TbTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RowActions;
