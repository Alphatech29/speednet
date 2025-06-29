import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import {GlobalProvider } from "./components/control/globalContext.jsx"

// Create the root and render the application
ReactDOM.createRoot(document.getElementById("root")).render(
   <GlobalProvider>
  <App />
  </GlobalProvider>
);
