import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home";
import Login from "./views/login";
import Layout from "./components/control/layout";
import Register from "./views/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout hideHeaderFooter={true}>
              <Login />
            </Layout>
          }
        />
         <Route
          path="/register"
          element={
            <Layout hideHeaderFooter={true}>
              <Register />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
