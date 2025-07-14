import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import { AuthDataProvider } from "./Context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <UserProvider>
      <AuthDataProvider>
        <App />
      </AuthDataProvider>
    </UserProvider>
  </Router>
);


