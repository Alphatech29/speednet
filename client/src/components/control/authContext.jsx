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
  const navigate = useNavigate();

  // ✅ Check if User is a Merchant
  const isMerchant = user?.role === "merchant";

  const fetchWebSettings = async () => {
    try {
      const result = await getWebSettings();
      if (result?.success && result.data) {
        const storedWebSettings = JSON.parse(localStorage.getItem("webSettings"));

        // Check if the data has changed
        if (JSON.stringify(result.data) !== JSON.stringify(storedWebSettings)) {
          setWebSettings(result.data);
          localStorage.setItem("webSettings", JSON.stringify(result.data));
        }
      } else {
        console.error("❌ Failed to load web settings:", result?.message);
      }
    } catch (error) {
      console.error("❌ Error fetching web settings:", error);
    }
  };

  const fetchUser = async (userUid) => {
    if (!userUid || (typeof userUid !== "string" && typeof userUid !== "number")) {
      console.error("❌ Invalid user UID:", userUid);
      return;
    }

    try {
      const result = await getUser(userUid.toString());
      if (result?.success && result.data) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        Cookies.set("user", JSON.stringify(result.data), { expires: 7 });
      } else {
        console.error("❌ Failed to load user:", result?.message);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  // Fetch user, webSettings, and cart on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken") || Cookies.get("authToken");
        const storedWebSettings = localStorage.getItem("webSettings");
        const storedCart = localStorage.getItem("cart");

        if (token) {
          setAuthToken(token);

          // Fetch and update web settings
          if (storedWebSettings) {
            setWebSettings(JSON.parse(storedWebSettings));
          } else {
            await fetchWebSettings();
          }

          // Fetch and update cart if needed
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }

          // Fetch and update user data
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.uid) {
              fetchUser(parsedUser.uid);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error retrieving auth data:", error);
      }
    };

    fetchData();
  }, []); // This effect runs only once on mount

  // ✅ Sign In with Role-Based Redirect
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

  // ✅ Logout (Explicitly called by the user)
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setCart([]);  // Clear the cart state
    setWebSettings(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("webSettings");
    Cookies.remove("authToken");
    Cookies.remove("user");
    Cookies.remove("cart");
    navigate("/auth/login");
  };

  // Function to update cart state and persist it
  const updateCartState = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const updated = [...prev, product];
      updateCartState(updated);  // Persist changes to cart
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      updateCartState(updated);  // Persist changes to cart
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        cart,
        isMerchant,
        addToCart,
        removeFromCart,
        signIn,
        logout,
        webSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
