import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { getWebSettings } from "../../components/backendApis/general/general";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [webSettings, setWebSettings] = useState(null);

  const navigate = useNavigate();
  const logoutTimeoutRef = useRef(null);

  const fetchWebSettings = async () => {
    try {
      const result = await getWebSettings();
      if (result?.success && result.data) {
        setWebSettings(result.data);
        localStorage.setItem("webSettings", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Error fetching web settings:", error);
    }
  };

  const scheduleAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = exp - now;

      if (timeUntilExpiry <= 0) {
        logoutAdmin();
        return;
      }

      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);

      logoutTimeoutRef.current = setTimeout(() => {
        logoutAdmin();
      }, timeUntilExpiry);
    } catch (error) {
      console.error("Failed to decode or schedule logout:", error);
      logoutAdmin();
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!window.location.pathname.startsWith("/admin")) return;

        const token = Cookies.get("adminToken") || localStorage.getItem("adminToken");
        const storedAdminDetails = Cookies.get("adminDetails");
        const storedWebSettings = localStorage.getItem("webSettings");

        if (token && token.split(".").length === 3) {
          setAdminToken(token);
          scheduleAutoLogout(token);

          if (storedAdminDetails) {
            setAdminDetails(JSON.parse(storedAdminDetails));
          }

          if (storedWebSettings) {
            setWebSettings(JSON.parse(storedWebSettings));
          } else {
            await fetchWebSettings();
          }

          try {
            jwtDecode(token);
          } catch (err) {
            console.error("Invalid token:", err);
            logoutAdmin();
          }
        } else {
          logoutAdmin();
        }
      } catch (err) {
        console.error("Session init error:", err);
        logoutAdmin();
      }
    };

    initialize();

    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, []);

  const signInAdmin = ({ token, user }) => {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid token passed to signInAdmin");
      return;
    }

    setAdminToken(token);
    setAdminDetails(user);

    Cookies.set("adminToken", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Cookies.set("adminDetails", JSON.stringify(user), { expires: 7 });

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminDetails", JSON.stringify(user));

    scheduleAutoLogout(token);
    fetchWebSettings();
    navigate("/admin/dashboard");
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminDetails(null);
    setWebSettings(null);

    Cookies.remove("adminToken");
    Cookies.remove("adminDetails");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    localStorage.removeItem("webSettings");

    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);

    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminDetails,
        webSettings,
        signInAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
