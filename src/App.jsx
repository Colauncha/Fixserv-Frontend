import { Routes, Route } from "react-router-dom";
// import Waiting from "./Pages/Waiting";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import BuilderSignUp from "./Pages/BuilderSignUp";
import UserSignUp from "./Pages/UserSignUp";
import LogInPage from "./Pages/LogInPage";
import ClientHomePage from "./Pages/Clients/ClientHomePage";
import TechSelection from "./Pages/Clients/TechSelection";
import ArtisanHomePage from "./Pages/ArtisanPages/ArtisanHomePage";




function App() {
  return (
    <div> 

      <Routes>
        {/* <Route path="/" element={<Waiting />} /> */}
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Home/>} />
        <Route path="/artisan-signup" element={<BuilderSignUp/>} />
        <Route path="/client-signup" element={<UserSignUp/>} />
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/client-home" element={<ClientHomePage/>} />
        <Route path="/client-navbar" element={<ClientHomePage />} />
        <Route path="/client-selection" element={<TechSelection />} />
        <Route path="/artisan-home" element={<ArtisanHomePage />} />
        
      </Routes>
      
    </div>
  
  );
}

export default App;

