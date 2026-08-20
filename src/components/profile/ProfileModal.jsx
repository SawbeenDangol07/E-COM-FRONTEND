import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import {
  TbX,
  TbCamera,
  TbUser,
  TbMail,
  TbBuildingStore,
  TbLoader2,
  TbCheck,
  TbShieldCheck,
} from "react-icons/tb";

export default function ProfileModal({ isOpen, onClose }) {
  const { loggedInUser, updateProfile } = useAuth();
  const [name, setName] = useState(loggedInUser?.name || "");
  const [storeName, setStoreName] = useState(loggedInUser?.storeName || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !loggedInUser) return null;

  const currentAvatar =
    previewUrl ||
    loggedInUser.avatar ||
    loggedInUser.image?.url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide your full name");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (loggedInUser.role === "seller" && storeName.trim()) {
        formData.append("storeName", storeName.trim());
      }
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Edit Your Profile</h3>
            <p className="text-xs text-slate-500 font-light">
              Update your avatar photo and account information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="relative group">
              <img
                src={currentAvatar}
                alt={loggedInUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-indigo-500/20 group-hover:opacity-90 transition"
              />
              <label
                htmlFor="profile-avatar-input"
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Change profile picture"
              >
                <TbCamera className="w-6 h-6" />
                <span className="text-[10px] font-bold mt-0.5">Change</span>
              </label>
              <input
                id="profile-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="text-center">
              <label
                htmlFor="profile-avatar-input"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline"
              >
                {selectedFile ? "Replace Selected Photo" : "Upload New Photo"}
              </label>
              <p className="text-[10px] text-slate-400 font-light">
                JPG, PNG or WEBP (Max 5MB)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <TbUser className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            {/* Store Name (If Seller) */}
            {loggedInUser.role === "seller" && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Store / Business Name
                </label>
                <div className="relative flex items-center">
                  <TbBuildingStore className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Apex Mobile Hub"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Email (Read Only) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Registered Email (Verified)
              </label>
              <div className="relative flex items-center">
                <TbMail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={loggedInUser.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 text-slate-500 text-xs sm:text-sm rounded-xl border border-slate-200 cursor-not-allowed select-none"
                />
                <span className="absolute right-3 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <TbShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm shadow-indigo-600/20 active:scale-95 cursor-pointer"
            >
              {saving ? (
                <>
                  <TbLoader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <TbCheck className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
