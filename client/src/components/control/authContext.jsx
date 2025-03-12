import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.exp * 1000 < Date.now(); // Compare expiry time
    } catch (error) {
      return true; // If there's an error decoding, assume token is invalid
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || Cookies.get("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        if (isTokenExpired(token)) {
          logout(); // Logout if token is expired
        } else {
          setAuthToken(token);
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("Error retrieving auth data:", error);
    }
  }, []);

  const signIn = ({ token, user }) => {
    try {
      if (!token || !user) throw new Error("Invalid login response");

      // Store token & user data in state
      setAuthToken(token);
      setUser(user);

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Store in cookies (expires in 7 days)
      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      console.log("✅ Data successfully stored in localStorage & cookies.");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = () => {
    console.log("🔹 Logging out...");

    setAuthToken(null);
    setUser(null);

    // Remove from localStorage & cookies
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    Cookies.remove("authToken");
    Cookies.remove("user");

    console.log("✅ User logged out successfully.");
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
