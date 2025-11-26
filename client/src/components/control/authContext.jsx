import React, {
  createContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import { getWebSettings } from "../backendApis/general/general";
import { getCurrentUser } from "../backendApis/user/user";
import { logoutUser } from "../backendApis/auth/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load cart from localStorage on first render
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("speednet_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(null);
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("speednet_cart", JSON.stringify(cart));
  }, [cart]);


  // Fetch global site settings
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

  // Fetch authenticated user
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

  // Manual sign-in or auto login after refresh
  const signIn = async () => {
    try {
      const currentUser = await fetchUser();
      if (currentUser) {
        await fetchWebSettings();
        if (currentUser.role === "merchant") {
          navigate("/user/dashboard");
        } else {
          navigate("/user/marketplace");
        }
      }
    } catch (error) {
      console.error("Error in signIn:", error);
      setUser(null);
    }
  };

  // Run on page load / refresh
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchWebSettings(), fetchUser()]);
      setLoading(false);
    };
    initialize();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
    setCart([]);
    localStorage.removeItem("paysparq_cart");
    setWebSettings(null);

    navigate("/auth/login");
  };

  // Update cart
  const updateCartState = (newCart) => setCart(newCart);

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Memoized context value
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

  // Loading screen
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
