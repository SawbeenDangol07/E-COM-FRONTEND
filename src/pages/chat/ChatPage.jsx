import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { getAllUsers } from "../../reducer/UserReducer";
import ChatUserList from "../../components/chat/ChatUserList";
import ChatActiveUser from "../../components/chat/ChatActiveUser";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatSendMessage from "../../components/chat/ChatSendMessage";
import {
  TbMessage,
  TbArrowLeft,
  TbLock,
  TbArrowRight,
  TbShieldCheck,
  TbBuildingStore,
} from "react-icons/tb";

export default function ChatPage() {
  const { loggedInUser } = useAuth();
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.user.activeUser);
  const [showMobileList, setShowMobileList] = useState(!activeUser);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(getAllUsers());
    }
  }, [dispatch, loggedInUser]);

  // When activeUser changes on mobile, show the chat pane
  useEffect(() => {
    if (activeUser) {
      setShowMobileList(false);
    }
  }, [activeUser]);

  const handleMessageSent = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // GUEST ACCESS RESTRICTION: If user is not logged in
  if (!loggedInUser) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-18 h-18 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-indigo-600/10">
          <TbLock className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Authentication Required
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign In to Access Live Chat
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md mx-auto leading-relaxed">
            Live messaging and seller negotiations are reserved for authenticated members. Please sign in or create an account to talk directly with verified device sellers.
          </p>
        </div>

        {/* Feature Highlights for members */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 gap-3 text-left text-xs">
          <div className="flex items-start gap-2.5">
            <TbBuildingStore className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Direct Negotiation</p>
              <p className="text-[11px] text-slate-400 font-light">Discuss phone conditions and offers</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <TbShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Escrow Security</p>
              <p className="text-[11px] text-slate-400 font-light">Protected conversation records</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <span>Sign In to Continue</span>
            <TbArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition shadow-2xs cursor-pointer"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  // LOGGED IN CHAT CONSOLE
  return (
    <div className="space-y-4 text-slate-900">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Messages & Negotiations
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Direct communication between buyers, sellers, and store admins.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="h-[75vh] min-h-[520px] rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Left: Chat User List */}
        <div
          className={`${
            showMobileList ? "block" : "hidden"
          } md:block h-full w-full md:w-80 shrink-0`}
        >
          <ChatUserList activeUser={activeUser} />
        </div>

        {/* Right: Active Chat Pane */}
        <div
          className={`${
            showMobileList ? "hidden" : "flex"
          } md:flex flex-1 flex-col h-full bg-white relative overflow-hidden`}
        >
          {activeUser ? (
            <>
              {/* Mobile Back Button */}
              <div className="md:hidden p-2.5 bg-white border-b border-slate-200 flex items-center">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
                >
                  <TbArrowLeft className="w-4 h-4" />
                  <span>All Conversations</span>
                </button>
              </div>

              {/* Top Active User Bar with Green Indicator and Clear Chat */}
              <ChatActiveUser
                activeUser={activeUser}
                onChatCleared={handleMessageSent}
              />

              {/* Message Thread */}
              <ChatMessage refreshTrigger={refreshKey} />

              {/* Send Message Box */}
              <ChatSendMessage
                activeUser={activeUser}
                onMessageSent={handleMessageSent}
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2.5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <TbMessage className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No conversation selected</h3>
              <p className="text-xs text-slate-500 max-w-xs font-light">
                Choose a user or seller from the sidebar to view your chat history and negotiate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
