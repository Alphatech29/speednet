import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home";
import Login from "./views/login";
import Layout from "./components/control/layout";
import Register from "./views/register";
import { AuthProvider } from "./components/control/authContext";
import PrivateRoute from "./components/control/private";
import UserRoute from "./userRoute/userRoute";
import Wallet from "./views/user/wallet/wallet";

function App() {
  return (
    <Router>
      <AuthProvider>
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

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/*" element={<UserRoute />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
