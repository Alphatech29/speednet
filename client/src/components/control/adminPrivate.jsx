import { useContext } from "react";
import { Navigate, Outlet,useLocation } from "react-router-dom";
import { AdminAuthContext } from "./adminContext"; 

const AdminPrivateRoute = () => {
  const { adminToken, adminDetails } = useContext(AdminAuthContext);
   const location = useLocation();

  const loading = !adminToken || !adminDetails;

  if (loading) {
    return <p>Loading admin session...</p>;
  }

  return adminToken && adminDetails ? <Outlet /> : <Navigate to="/admin/login" replace  state={{ from: location }}/>;
};

export default AdminPrivateRoute;
