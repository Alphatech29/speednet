import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getWebSettings } from "../backendApis/general/general";
import { getUser } from "../backendApis/user/user";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWebSettings = async () => {
    try {
      const result = await getWebSettings();
      if (result?.success && result.data) {
        const storedWebSettings = JSON.parse(localStorage.getItem("webSettings"));
        if (JSON.stringify(result.data) !== JSON.stringify(storedWebSettings)) {
          setWebSettings(result.data);
          localStorage.setItem("webSettings", JSON.stringify(result.data));
        }
      }
    } catch (error) {
      console.error("❌ Error fetching web settings:", error);
    }
  };

  const fetchUser = async (userUid) => {
    try {
      const result = await getUser(userUid.toString());
      if (result?.success && result.data) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        Cookies.set("user", JSON.stringify(result.data), { expires: 7 });
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken") || Cookies.get("authToken");
        const storedWebSettings = localStorage.getItem("webSettings");
        const storedCart = localStorage.getItem("cart");

        if (token) {
          setAuthToken(token);

          if (storedWebSettings) {
            setWebSettings(JSON.parse(storedWebSettings));
          } else {
            await fetchWebSettings();
          }

          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }

          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.uid) {
              await fetchUser(parsedUser.uid);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error retrieving auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const signIn = ({ token, user }) => {
    try {
      if (!token || !user) throw new Error("Invalid login response");
      setAuthToken(token);
      setUser(user);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      fetchWebSettings();

      setTimeout(() => {
        navigate(user.role === "merchant" ? "/user/dashboard" : "/user/marketplace");
      }, 2000);
    } catch (error) {
      console.error("❌ Login Error:", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setCart([]);
    setWebSettings(null);
    localStorage.clear();
    Cookies.remove("authToken");
    Cookies.remove("user");
    Cookies.remove("cart");
    navigate("/auth/login");
  };

  const updateCartState = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
  };

  // ✅ New: removeFromCart by item ID
  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        cart,
        webSettings,
        signIn,
        logout,
        updateCartState,
        removeFromCart, // ✅ Expose in context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
