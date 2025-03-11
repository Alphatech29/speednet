import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve auth token from either localStorage or cookies
    const token = localStorage.getItem("authToken") || Cookies.get("authToken");
    const storedUserId = localStorage.getItem("userId") || Cookies.get("userId");

    if (token && storedUserId) {
      setAuthToken(token);
      setUserId(storedUserId);
    }
  }, []);

  const signIn = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.userId;

      // Store token & user ID in state
      setAuthToken(token);
      setUserId(userId);
      
      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      // Store in cookies (expires in 7 days)
      Cookies.set("authToken", token, { expires: 7 });
      Cookies.set("userId", userId, { expires: 7 });

      // Redirect to dashboard
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    
    // Remove from localStorage & cookies
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    Cookies.remove("authToken");
    Cookies.remove("userId");

    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
