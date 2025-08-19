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
import AdminProtectedRoute from "./Auth/AdminProtectedRoute";
import ContactUsPage from "./Pages/Home/ContactUsPage";
import AutoScrollToTop from "./Components/AutoScrollToTop";
import JobDetails from "./Components/Artisan/JobDetails";
import OrderDetails from "./Components/Guest/OrderDetails";

import ClientDashboard from "./Components/Guest/ClientDashboard";
import ClientEditProfile from "./Components/Guest/ClientEditProfile";
import ResetPassword from "./Components/Auth/ResetPassword";
import TermsPage from "./Components/Others/TermsPage";
import PrivacyPolicy from "./Components/Others/PrivacyPolicy";
import Notification from "./Components/Others/Notification";
import KYC from "./Components/Others/KYC";
import Tracking from "./Components/Others/Tracking";

// Admins
import AdminAuth from "./Components/Admin/Auth";
import AdminDashboard from "./Components/Admin/Dashboard";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <div>
      <AuthProvider>
      <GenNavBar />
      <AutoScrollToTop>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Tracking>
        <Routes>
          {/* General / Shared */}
          <Route path="/" element={<Landing />} />
          <Route path="/welcome" element={<Home />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-conditions" element={<TermsPage/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/notify" element={<Notification/>} />
          {/* <Route path="/kyc_client" element={<KYC_Client />} /> */}

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
            <Route path="order/:id" element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path="edit-profile" element={
              <ProtectedRoute> 
                <ClientEditProfile  />
              </ProtectedRoute>
            }/>
            <Route path="kyc" element={
              <ProtectedRoute> 
                <KYC />
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
            <Route path="job/:id" element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="kyc" element={
              <ProtectedRoute> 
                <KYC />
              </ProtectedRoute>
            }/>
          </Route>

          {/* Admin routes */}
          <Route path="/admin">
            <Route path="login" element={<AdminAuth />} />
            <Route path="dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
          </Route>

        </Routes>
      </Tracking>
      </AutoScrollToTop>
      <ScrollToTop />
      <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
