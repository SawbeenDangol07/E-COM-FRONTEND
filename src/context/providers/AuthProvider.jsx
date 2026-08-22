import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import authService from "../../services/auth.service";
import { toast } from "sonner";

export const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role || "customer",
    image: user.image,
    phone: user.phone || "",
    address: user.address || "",
    avatar:
      user.image?.url ||
      (typeof user.image === "string" ? user.image : null) ||
      user.avatar ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    status: user.status || "active",
    storeName: user.storeName || (user.role === "seller" ? `${user.name}'s Mobiles` : undefined),
    city: user.city || user.Address || "Kathmandu, NP",
    verified: user.status === "active",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export default function AuthProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const saved = localStorage.getItem("mobimarket_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("mobimarket_user", JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem("mobimarket_user");
    }
  }, [loggedInUser]);

  const getLoggedInUser = async () => {
    try {
      const res = await authService.getMe();
      const user = normalizeUser(res.data);
      setLoggedInUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  // Validate active JWT session on application mount
  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      getLoggedInUser().catch((err) => {
        console.warn("Session check notice:", err.message);
        if (err.status === 401 || err.status === 403) {
          Cookies.remove("token");
          localStorage.removeItem("token");
          localStorage.removeItem("mobimarket_user");
          setLoggedInUser(null);
        }
      });
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      // res.data is JWT token string
      const authToken = res.data;
      
      // Store auth token in both cookies and localStorage for cross-redirect persistence
      Cookies.set("token", authToken, {
        expires: 1,
        secure: window.location.protocol === "https:",
        sameSite: "lax",
      });
      localStorage.setItem("token", authToken);

      // Fetch user profile
      const user = await getLoggedInUser();
      return user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      const updatedUser = normalizeUser(res.data);
      setLoggedInUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activate = async (token) => {
    return await authService.activate(token);
  };

  const reactivate = async (token) => {
    return await authService.reactivate(token);
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("mobimarket_user");
    setLoggedInUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        loading,
        login,
        getLoggedInUser,
        register,
        updateProfile,
        activate,
        reactivate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
