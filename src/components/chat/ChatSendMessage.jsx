import { useState } from "react";
import chatService from "../../services/chat.service";
import { toast } from "sonner";
import { TbSend } from "react-icons/tb";

export function ChatSendMessage({ activeUser, onMessageSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeUser?._id || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage({
        receiver: activeUser._id,
        message: message.trim(),
      });
      setMessage("");
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="border-t border-slate-200 bg-white px-6 py-3.5 flex items-center gap-3"
    >
      <input
        type="text"
        placeholder={`Message ${activeUser?.name || "user"}...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-indigo-500 focus:bg-white transition"
      />
      <button
        type="submit"
        disabled={!message.trim() || sending}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95"
      >
        <span>Send</span>
        <TbSend className="w-4 h-4" />
      </button>
    </form>
  );
}

export default ChatSendMessage;
