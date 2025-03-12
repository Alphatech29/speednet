import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../control/authContext";

const PrivateRoute = () => {
  const { authToken } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [authToken]);

  if (loading) return null; 

  return authToken ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
