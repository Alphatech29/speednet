import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/general/index";
import Login from "./views/general/login";
import AdminLogin from "./views/admin/auth/login";
import Layout from "./components/control/layout";
import Register from "./views/general/register";
import Wallet from "./views/user/wallet/wallet";

import { AuthProvider } from "./components/control/authContext";
import PrivateRoute from "./components/control/private";

import { AdminAuthProvider } from "./components/control/adminContext";
import AdminPrivateRoute from "./components/control/adminPrivate"; 
import AdminRoute from "./views/admin/adminRoute/adminRoute"; 

import UserRoute from "./userRoute/userRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/auth/login"
              element={
                <Layout hideHeaderFooter>
                  <Login />
                </Layout>
              }
            />
            <Route path="/wallet" element={<Wallet />} />
            <Route
              path="/auth/register"
              element={
                <Layout hideHeaderFooter>
                  <Register />
                </Layout>
              }
            />

            {/* Protected User Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/user/*" element={<UserRoute />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminPrivateRoute />}>
              <Route path="/admin/*" element={<AdminRoute />} />
            </Route>
              <Route
              path="/admin/login"
              element={
                <Layout hideHeaderFooter>
                  <AdminLogin />
                </Layout>
              }
            />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
