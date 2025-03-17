import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // 🛒 Cart State
  const navigate = useNavigate();

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload.exp * 1000 < Date.now(); 
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || Cookies.get("authToken");
      const storedUser = localStorage.getItem("user");
      const storedCart = localStorage.getItem("cart");

      if (token && storedUser) {
        if (isTokenExpired(token)) {
          logout(); 
        } else {
          setAuthToken(token);
          setUser(JSON.parse(storedUser));
          setCart(storedCart ? JSON.parse(storedCart) : []); // Load cart from storage
        }
      }
    } catch (error) {
      console.error("Error retrieving auth data:", error);
    }
  }, []);

  // 🛒 Function to Add to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      
      // Save cart to localStorage & Cookies
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });

      return updatedCart;
    });
  };

  // 🛒 Function to Remove from Cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);

      // Update storage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });

      return updatedCart;
    });
  };

  const signIn = ({ token, user }) => {
    try {
      if (!token || !user) throw new Error("Invalid login response");

      setAuthToken(token);
      setUser(user);

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      console.log("✅ Data successfully stored in localStorage & cookies.");

      setTimeout(() => {
        if (user.role === "merchant") {
          navigate("/user/dashboard"); 
        } else {
          navigate("/user/marketplace");
        }
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = () => {
    console.log("🔹 Logging out...");

    setAuthToken(null);
    setUser(null);
    setCart([]); // Clear cart on logout

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    
    Cookies.remove("authToken");
    Cookies.remove("user");
    Cookies.remove("cart");

    console.log("✅ User logged out successfully.");
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, cart, addToCart, removeFromCart, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
