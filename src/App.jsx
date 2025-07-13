import { Routes, Route } from "react-router-dom";
// import Waiting from "./Pages/Waiting";
import Landing from "./Pages/Home/Landing";
import GenNavBar from "./Components/Navbar/GenNavBar";
import Home from "./Pages/Home/Home";
import BuilderSignUp from "./Pages/Auth/BuilderSignUp";
import UserSignUp from "./Pages/Auth/UserSignUp";
import LogInPage from "./Pages/Auth/LogInPage";
import ClientHomePage from "./Pages/Clients/ClientHomePage";
import TechSelection from "./Pages/Clients/TechSelection";
import ArtisanHomePage from "./Pages/ArtisanPages/ArtisanHomePage";
import ArtisanDashboard from "./Components/Artisan/ArtisanDashboard";
// import ArtisanProfile from "./Components/Artisan/ArtisanDashboard";
import ClientProfilePage from "./Components/Guest/ClientProfilePage";
import ArtisanHistory from "./Components/Artisan/ArtisanHistory";
import EditProfile from "./Components/Artisan/EditProfile";
import ScrollToTop from "./Components/ScrollToTop";
import Footer from "./Components/Footer";
import AboutUsPage from "./Pages/Home/AboutUsPage";


function App() {
  return (
    <div>
      <GenNavBar />
      <Routes>
        {/* General / Shared */}
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Home />} />
        <Route path="/about-us" element={<AboutUsPage />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LogInPage />} />
          <Route path="artisan-signup" element={<BuilderSignUp />} />
          <Route path="client-signup" element={<UserSignUp />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client">
          <Route path="home" element={<ClientHomePage />} />
          <Route path="selection" element={<TechSelection />} />
          <Route path="profile" element={<ClientProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* Artisan Routes */}
        <Route path="/artisans">
          <Route path="home" element={<ArtisanHomePage />} />
          <Route path="dashboard" element={<ArtisanDashboard />} />
          <Route path="history" element={<ArtisanHistory />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;
