import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { getWebSettings } from "../backendApis/general/general";
import { getCurrentUser } from "../backendApis/user/user";
import { logoutUser } from "../backendApis/auth/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ==========================
  // CART STATE
  // ==========================
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("speednet_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(null);
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // SAVE CART TO LOCALSTORAGE
  // ==========================
  useEffect(() => {
    localStorage.setItem("speednet_cart", JSON.stringify(cart));
  }, [cart]);

  // ==========================
  // FETCH WEB SETTINGS
  // ==========================
  const fetchWebSettings = async () => {
    try {
      const result = await getWebSettings();
      if (result?.success && result.data) {
        setWebSettings(result.data);
        return result.data;
      }
    } catch (error) {
      console.error("Failed to fetch web settings:", error);
    }
    return null;
  };

  // ==========================
  // FETCH CURRENT USER
  // ==========================
  const fetchUser = async () => {
    try {
      const result = await getCurrentUser();
      if (result?.success && result.data) {
        setUser(result.data);
        return result.data;
      }
      setUser(null);
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
      return null;
    }
  };

  // ==========================
  // SIGN IN
  // ==========================
  const signIn = async () => {
    try {
      const currentUser = await fetchUser();
      if (currentUser) {
        await fetchWebSettings();
        navigate(
          currentUser.role === "merchant"
            ? "/user/dashboard"
            : "/user/marketplace"
        );
      }
    } catch (error) {
      console.error("Error in signIn:", error);
      setUser(null);
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchWebSettings(), fetchUser()]);
      setLoading(false);
    };
    initialize();
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
    setCart([]);
    localStorage.removeItem("speednet_cart");
    setWebSettings(null);
    navigate("/auth/login");
  };

  // ==========================
  // CART ACTIONS (DARKSHOP SAFE)
  // ==========================

  // Normalize cart (force non-darkshop qty = 1)
  const normalizeCart = (items) =>
    items.map((item) => ({
      ...item,
      quantity:
        item.store === "darkshop"
          ? item.quantity || 1
          : 1,
    }));

  // External update
  const updateCartState = (newCart) => {
    setCart(normalizeCart(newCart));
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Increase quantity (Darkshop only)
  const increaseQty = (itemId) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (item.store !== "darkshop") return item;

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  // Decrease quantity (Darkshop only)
  const decreaseQty = (itemId) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== itemId) return item;
          if (item.store !== "darkshop") return item;

          return { ...item, quantity: item.quantity - 1 };
        })
        .filter((item) =>
          item.store === "darkshop" ? item.quantity > 0 : true
        )
    );
  };

  // ==========================
  // CONTEXT VALUE
  // ==========================
  const contextValue = useMemo(
    () => ({
      user,
      cart,
      webSettings,
      signIn,
      logout,
      updateCartState,
      removeFromCart,
      increaseQty,
      decreaseQty,
    }),
    [user, cart, webSettings]
  );

  // ==========================
  // LOADING SCREEN
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-solid"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
