import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { getWebSettings } from "../../components/backendApis/general/general";
import { getAdmin } from "../../components/backendApis/admin/admin";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null); // this will store 'user'
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = Cookies.get("adminToken") || localStorage.getItem("adminToken");
        const storedAdminDetails = Cookies.get("adminDetails");
        const storedWebSettings = localStorage.getItem("webSettings");

        if (token && token.split(".").length === 3) {
          setAdminToken(token);

          if (storedAdminDetails) {
            setAdminDetails(JSON.parse(storedAdminDetails));
          }

          if (storedWebSettings) {
            setWebSettings(JSON.parse(storedWebSettings));
          } else {
            await fetchWebSettings();
          }

          // Optional: validate token
          try {
            jwtDecode(token); // Just to ensure token is valid
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
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // ✅ Login handler: Store token + user as adminDetails
  const signInAdmin = ({ token, user }) => {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid token passed to signInAdmin");
      return;
    }

    setAdminToken(token);
    setAdminDetails(user); // 👈 Store user as adminDetails
    setLoading(false);

    Cookies.set("adminToken", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Cookies.set("adminDetails", JSON.stringify(user), { expires: 7 });

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminDetails", JSON.stringify(user));

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

    navigate("/admin/login");
  };

  if (loading) return <div>Loading admin session...</div>;

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminDetails, // ⬅️ This will now contain the user
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
