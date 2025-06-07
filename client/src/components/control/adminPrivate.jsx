import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminAuthContext } from "./adminContext"; // adjust path if needed

const AdminPrivateRoute = () => {
  const { adminToken, adminDetails } = useContext(AdminAuthContext);

  // Optional: you can lift `loading` state from context if needed
  const loading = !adminToken || !adminDetails;

  if (loading) {
    return <p>Loading admin session...</p>; // you can replace with <LoadingSpinner /> if preferred
  }

  return adminToken && adminDetails ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
