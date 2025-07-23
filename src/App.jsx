import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";
import ContactUsPage from "./Pages/Home/ContactUsPage";

import ClientDashboard from "./Components/Guest/ClientDashboard";
import ClientEditProfile from "./Components/Guest/ClientEditProfile";
import ResetPassword from "./Components/Auth/ResetPassword";
import TermsPage from "./Components/Others/TermsPage";
import PrivacyPolicy from "./Components/Others/PrivacyPolicy";


function App() {
  return (
    <div>
      <AuthProvider>
      <GenNavBar />
      <Routes>
        {/* General / Shared */}
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Home />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/terms-conditions" element={<TermsPage/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LogInPage />} />
          <Route path="artisan-signup" element={<BuilderSignUp />} />
          <Route path="client-signup" element={<UserSignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client">
          <Route path="home" element={<ClientHomePage />} />
          <Route path="selection" element={<TechSelection />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <ClientProfilePage />
            </ProtectedRoute>
          } />
          <Route path="edit-profile" element={
            <ProtectedRoute> 
              <ClientEditProfile  />
            </ProtectedRoute>
            }/>
        </Route>

        {/* Artisan Routes */}
        <Route path="/artisans">
          <Route path="home" element={<ArtisanHomePage />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <ArtisanDashboard />
            </ProtectedRoute>
          } />
          <Route path="history" element={
            <ProtectedRoute>
              <ArtisanHistory />
            </ProtectedRoute>
          } />
          <Route path="edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
      <ScrollToTop />
      <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
