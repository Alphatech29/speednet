import { useContext } from "react";
import { Navigate, Outlet,useLocation } from "react-router-dom";
import { AdminAuthContext } from "./adminContext"; 

const AdminPrivateRoute = () => {
  const { adminToken, adminDetails } = useContext(AdminAuthContext);
   const location = useLocation();

  const loading = !adminToken || !adminDetails;

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-white/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-solid"></div>
      </div>;
  }

  return adminToken && adminDetails ? <Outlet /> : <Navigate to="/admin/login" replace  state={{ from: location }}/>;
};

export default AdminPrivateRoute;
