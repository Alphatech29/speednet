import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getWebSettings } from "../backendApis/general/general";
import { getCurrentUser } from "../backendApis/user/user";
import { logoutUser } from "../backendApis/auth/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWebSettings = async () => {
    try {
      const result = await getWebSettings();
      if (result?.success && result.data) {
        setWebSettings(result.data);
        return result.data;
      }
    } catch (error) {
      console.error("❌ Error fetching web settings:", error);
    }
    return null;
  };

  const fetchUser = async () => {
    try {
      const result = await getCurrentUser();

      if (result?.success && result.data) {
        console.log("👤 Current user fetched:", result.data);
        setUser(result.data);
        return result.data;
      } else {
        setUser(null);
        console.log("⚠️ No user data in response.");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      setUser(null);
      return null;
    }
  };

  const signIn = async () => {
    console.log("signIn started");
    try {
      const currentUser = await fetchUser();
      if (currentUser) {
        await fetchWebSettings();
        if (currentUser?.role === "merchant") {
          navigate("/user/dashboard");
        } else {
          navigate("/user/marketplace");
        }
      } else {
        console.error("❌ Failed to retrieve user after login.");
      }
    } catch (error) {
      console.error("❌ signIn error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchWebSettings(), fetchUser()]);
      setLoading(false);
    };
    initialize();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("⚠️ Logout API failed:", error);
    }
    setUser(null);
    setCart([]);
    setWebSettings(null);
    navigate("/auth/login");
  };

  const updateCartState = (newCart) => setCart(newCart);

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const contextValue = useMemo(
    () => ({
      user,
      cart,
      webSettings,
      signIn,
      logout,
      updateCartState,
      removeFromCart,
    }),
    [user, cart, webSettings]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
