import { Routes, Route } from "react-router-dom";
// import Waiting from "./Pages/Waiting";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import LogInPage from "./Pages/LogInPage";
import BuilderSignUp from "./Pages/BuilderSignUp";
import UserSignUp from "./Pages/UserSignUp";
import ClientHomePage from "./Pages/Clients/ClientHomePage";
import TechSelection from "./Pages/Clients/TechSelection";



function App() {
  return (
    
      <Routes>
        {/* <Route path="/" element={<Waiting />} /> */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/welcome" element={<Home/>} />
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/artisan-signup" element={<BuilderSignUp/>} />
        <Route path="/guest-signup" element={<UserSignUp/>} />
        <Route path="/client-home" element={<ClientHomePage/>} />
        <Route path="/client-navbar" element={<ClientHomePage />} />
        <Route path="/client-selection" element={<TechSelection />} />
        
      </Routes>
  
  );
}

export default App;

