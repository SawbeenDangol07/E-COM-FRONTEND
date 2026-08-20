import { useState } from "react";
import { TbUser, TbTrash, TbLoader2, TbArrowLeft } from "react-icons/tb";
import Swal from "sweetalert2";
import chatService from "../../services/chat.service";
import { toast } from "sonner";
import { resolveImageUrl } from "../../common/constants";

export function ChatActiveUser({ activeUser, onChatCleared, onBack }) {
  const [clearing, setClearing] = useState(false);
  if (!activeUser) return null;
  const avatarUrl = resolveImageUrl(activeUser.avatar || activeUser.image);

  const handleClearConversation = async () => {
    const result = await Swal.fire({
      title: "Clear Conversation?",
      text: `Are you sure you want to delete all messages with ${activeUser.name}? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, clear chat",
    });

    if (result.isConfirmed) {
      setClearing(true);
      try {
        await chatService.clearConversation(activeUser._id);
        toast.success("Conversation cleared successfully");
        if (onChatCleared) onChatCleared();
      } catch (err) {
        toast.error(err.message || "Failed to clear conversation");
      } finally {
        setClearing(false);
      }
    }
  };

  return (
    <div className="border-b border-slate-200 px-3.5 sm:px-6 py-3 sm:py-4 bg-white flex items-center justify-between shadow-2xs shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {/* Mobile Back to contacts button */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition mr-0.5 shrink-0 cursor-pointer"
            title="Back to contacts"
          >
            <TbArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Avatar with prominent Green Online Indicator */}
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={activeUser.name}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-400"
            />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-indigo-100 border-2 border-emerald-400 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm">
              {activeUser.name ? activeUser.name[0].toUpperCase() : <TbUser className="w-5 h-5" />}
            </div>
          )}
          {/* Green Status Dot Indicator */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs"
            title="Online"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base truncate">
              {activeUser.name}
            </h3>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {activeUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light truncate">
            {activeUser.email}
          </p>
        </div>
      </div>

      {/* Right Actions: Online Badge & Clear Conversation */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleClearConversation}
          disabled={clearing}
          className="inline-flex items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          title="Clear full conversation history"
        >
          {clearing ? (
            <TbLoader2 className="w-4 h-4 animate-spin text-rose-600" />
          ) : (
            <TbTrash className="w-4 h-4" />
          )}
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Online</span>
        </span>
      </div>
    </div>
  );
}

export default ChatActiveUser;
