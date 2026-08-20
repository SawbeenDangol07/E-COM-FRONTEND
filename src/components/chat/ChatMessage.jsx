import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import chatService from "../../services/chat.service";
import { TbUser, TbLoader2, TbTrash } from "react-icons/tb";
import { toast } from "sonner";
import { resolveImageUrl } from "../../common/constants";

export function ChatMessage({ refreshTrigger }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const activeUser = useSelector((state) => state.user.activeUser);
  const { loggedInUser } = useAuth();
  const chatContainerRef = useRef(null);
  const chatBottomRef = useRef(null);
  const prevMessagesCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const scrollToBottom = (behavior = "smooth") => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior });
    }
  };

  const fetchMessages = useCallback(
    async (showLoading = false) => {
      if (!activeUser?._id) return;
      if (showLoading) setLoading(true);
      try {
        const response = await chatService.getChatDetail(activeUser._id, { limit: 100 });
        const raw = response.data || [];
        const reversed = [...raw].reverse();

        setMessages((prev) => {
          // Check if messages actually changed to prevent unnecessary re-renders
          const isSameLength = prev.length === reversed.length;
          const isSameLatest =
            isSameLength &&
            (prev.length === 0 || prev[prev.length - 1]?._id === reversed[reversed.length - 1]?._id);

          if (isSameLength && isSameLatest) {
            return prev; // No change, keep previous reference
          }

          return reversed;
        });
      } catch (err) {
        console.warn("Failed to fetch messages:", err.message);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [activeUser]
  );

  // Reset when active user changes
  useEffect(() => {
    isInitialLoadRef.current = true;
    prevMessagesCountRef.current = 0;
    fetchMessages(true);
  }, [activeUser?._id, fetchMessages]);

  // Trigger when new message is sent locally
  useEffect(() => {
    if (refreshTrigger) {
      fetchMessages(false);
    }
  }, [refreshTrigger, fetchMessages]);

  // Polling every 4 seconds for live messages
  useEffect(() => {
    if (!activeUser?._id) return;
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeUser?._id, fetchMessages]);

  // Smart scroll: Only scroll down if new message arrived or initial load
  useEffect(() => {
    if (messages.length === 0) return;

    if (isInitialLoadRef.current) {
      scrollToBottom("auto");
      isInitialLoadRef.current = false;
      prevMessagesCountRef.current = messages.length;
      return;
    }

    // If new message was appended
    if (messages.length > prevMessagesCountRef.current) {
      const container = chatContainerRef.current;
      const isNearBottom =
        container &&
        container.scrollHeight - container.scrollTop - container.clientHeight < 150;

      const latestMessage = messages[messages.length - 1];
      const isMine =
        (latestMessage?.sender?._id || latestMessage?.sender) ===
        (loggedInUser?._id || loggedInUser?.id);

      if (isNearBottom || isMine) {
        scrollToBottom("smooth");
      }
      prevMessagesCountRef.current = messages.length;
    }
  }, [messages, loggedInUser]);

  const handleDeleteMessage = async (chatId) => {
    try {
      await chatService.deleteMessage(chatId);
      setMessages((prev) => prev.filter((m) => m._id !== chatId));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete message");
    }
  };

  const currentUserId = loggedInUser?._id || loggedInUser?.id;

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 bg-slate-50/60"
    >
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
          <TbLoader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <p className="text-xs">Loading conversation history...</p>
        </div>
      ) : messages && messages.length > 0 ? (
        messages.map((item, index) => {
          const senderId = item.sender?._id || item.sender;
          const isMine = senderId === currentUserId;
          const senderAvatar = resolveImageUrl(item.sender?.avatar || item.sender?.image);
          const timeStr = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={item._id || index}
              className={`flex items-end gap-2 sm:gap-2.5 group/msg ${isMine ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar for incoming */}
              {!isMine &&
                (senderAvatar ? (
                  <img
                    src={senderAvatar}
                    alt=""
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {item.sender?.name ? item.sender.name[0].toUpperCase() : <TbUser className="w-4 h-4" />}
                  </div>
                ))}

              {/* Message Bubble Container */}
              <div className="relative group flex items-center gap-1.5">
                {/* Delete button for own messages on hover */}
                {isMine && item._id && (
                  <button
                    onClick={() => handleDeleteMessage(item._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete message"
                  >
                    <TbTrash className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                    isMine
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                  }`}
                >
                  <p className="leading-relaxed break-words whitespace-pre-wrap">{item.message}</p>
                  {timeStr && (
                    <span
                      className={`block text-[10px] text-right mt-1 font-light ${
                        isMine ? "text-indigo-200" : "text-slate-400"
                      }`}
                    >
                      {timeStr}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-24 text-center text-slate-400 space-y-1">
          <p className="font-semibold text-slate-600 text-sm">No messages yet</p>
          <p className="text-xs font-light">Send a message below to start the conversation.</p>
        </div>
      )}
      <div ref={chatBottomRef} />
    </div>
  );
}

export default ChatMessage;
