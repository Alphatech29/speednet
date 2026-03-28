import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/general/index";
import Login from "./views/general/login";
import AdminLogin from "./views/admin/auth/login";
import Layout from "./components/control/layout";
import Register from "./views/general/register";
import { AuthProvider } from "./components/control/authContext";
import PrivateRoute from "./components/control/private";
import { AdminAuthProvider } from "./components/control/adminContext";
import AdminPrivateRoute from "./components/control/adminPrivate";
import AdminRoute from "./views/admin/adminRoute/adminRoute";
import UserRoute from "./userRoute/userRoute";
import ForgetPassword from "./views/general/ForgetPassword";
import ResetPassword from "./views/general/resetPaword";
import SeoManager from "./components/utils/seoManager";
import Page from "./views/user/page/page";
import ContactUs from "./views/general/contact";
import NotFound from "./views/general/NotFound";
import MarketplacePage from "./views/general/services/marketplace";
import VtuPage from "./views/general/services/vtu";
import VpnPage from "./views/general/services/vpn";
import VirtualNumbersPage from "./views/general/services/virtualNumbers";
import P2PTradingPage from "./views/general/services/p2pTrading";
import PaymentsPage from "./views/general/services/payments";
import { ShoppingProvider } from "./components/control/shoppingContext";
import { ThemeProvider } from "./components/control/themeContext";

function App() {
  return (

    <Router>
      <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <ShoppingProvider >
           <SeoManager />
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
              path="/contact"
              element={
                <Layout>
                  <ContactUs />
                </Layout>
              }
            />
            <Route path="/services/marketplace" element={<Layout><MarketplacePage /></Layout>} />
            <Route path="/services/vtu" element={<Layout><VtuPage /></Layout>} />
            <Route path="/services/vpn" element={<Layout><VpnPage /></Layout>} />
            <Route path="/services/virtual-numbers" element={<Layout><VirtualNumbersPage /></Layout>} />
            <Route path="/services/p2p-trading" element={<Layout><P2PTradingPage /></Layout>} />
            <Route path="/services/payments" element={<Layout><PaymentsPage /></Layout>} />
             <Route
              path="/page/:slug"
              element={
                <Layout>
                  <Page />
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
            <Route
              path="/auth/forgot-password"
              element={
                <Layout hideHeaderFooter>
                  <ForgetPassword />
                </Layout>
              }
            />

            <Route
              path="/auth/reset-password/:token"
              element={
                <Layout hideHeaderFooter>
                  <ResetPassword />
                </Layout>
              }
            />

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

            {/* 404 Catch-all */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
          </ShoppingProvider>
        </AdminAuthProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
