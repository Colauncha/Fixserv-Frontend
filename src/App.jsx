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
import ArtisanDashboard from "./Components/Artisan/ArtisanDashboard";
// import ArtisanProfile from "./Components/Artisan/ArtisanDashboard";
import ClientProfilePage from "./Components/Guest/ClientProfilePage";
import ArtisanHistory from "./Components/Artisan/ArtisanHistory";
import EditProfile from "./Components/Artisan/EditProfile";


function App() {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Waiting />} /> */}
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Home />} />
        <Route path="/artisan-signup" element={<BuilderSignUp />} />
        <Route path="/client-signup" element={<UserSignUp />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/client-home" element={<ClientHomePage />} />
        <Route path="/client-navbar" element={<ClientHomePage />} />
        <Route path="/client-selection" element={<TechSelection />} />
        <Route path="/artisan-home" element={<ArtisanHomePage />} />
        <Route path="artisan-dashboard" element={<ArtisanDashboard />} />
        <Route path="/client-profile" element={<ClientProfilePage />} />
        <Route path="/artisan-history" element={<ArtisanHistory />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;
