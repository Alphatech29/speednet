import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Retrieve auth token from either localStorage or cookies
      const token = localStorage.getItem("authToken") || Cookies.get("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setAuthToken(token);
        setUser(JSON.parse(storedUser));
      }

      console.log("🔹 Retrieved from storage:", { token, storedUser });
    } catch (error) {
      console.error("❌ Error retrieving auth data:", error);
    }
  }, []);

  const signIn = ({ token, user }) => {
    try {
      if (!token || !user) throw new Error("Invalid login response");
  
      console.log("🔹 Storing token & user:", { token, user });
  
      // Store token & user data in state
      setAuthToken(token);
      setUser(user);
  
      console.log("🔹 After setting state:", { authToken: token, user });
  
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
      console.error("❌ Login Error:", error);
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
