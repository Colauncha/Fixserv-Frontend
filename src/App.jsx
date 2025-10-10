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
import ArtisanTranxHist from './Components/Artisan/ArtisanTranxHist';

import ClientDashboard from './Components/Guest/ClientDashboard';
import ClientEditProfile from './Components/Guest/ClientEditProfile';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import TermsPage from './Components/Others/TermsPage';
import PrivacyPolicy from './Components/Others/PrivacyPolicy';
import Notification from './Components/Others/Notification';
import KYC from './Components/Others/KYC';
import Tracking from './Components/Others/Tracking';
import ClientTranxHist from './Components/Guest/ClientTranxHist';

// Admins
import AdminAuth from "./Components/Admin/Auth";
import AdminDashboard from "./Components/Admin/Dashboard";
import AdminDashboardButton from "./Components/Others/AdminDashboardButton";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EmailVerification from "./Components/Auth/EmailVerificationPage"
import EmailVerificationTwo from "./Components/Auth/EmailVerificationPageTwo"
import TranxProvider from './Context/TranxContext';


function App() {

  return (
    <div>
      <AuthProvider>
        <TranxProvider>
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
                <Route path="/terms-conditions" element={<TermsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/notify" element={<Notification />} />
                {/* <Route path="/kyc_client" element={<KYC_Client />} /> */}

                {/* Auth Routes */}
                <Route path="/auth">
                  <Route path="login" element={<LogInPage />} />
                  <Route path="artisan-signup" element={<BuilderSignUp />} />
                  <Route
                    path="email-verification"
                    element={<EmailVerification />}
                  />
                  <Route
                    path="email-verified"
                    element={<EmailVerificationTwo />}
                  />
                  <Route path="client-signup" element={<UserSignUp />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                </Route>

                {/* Client Routes */}
                <Route path="/client">
                  <Route
                    path="home"
                    element={
                      <ProtectedRoute>
                        <ClientHomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="selection"
                    element={
                      <ProtectedRoute>
                        <TechSelection />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route path="dashboard" element={<ClientDashboard />} /> */}
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <ClientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="edit-profile"
                    element={
                      <ProtectedRoute>
                        <ClientEditProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="kyc"
                    element={
                      <ProtectedRoute>
                        <KYC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="wallet-history"
                    element={
                      <ProtectedRoute>
                        <ClientTranxHist />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Artisan Routes */}
                <Route path="/artisans">
                  <Route
                    path="home"
                    element={
                      <ProtectedRoute>
                        <ArtisanHomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <ArtisanDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="history"
                    element={
                      <ProtectedRoute>
                        <ArtisanHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="job/:id"
                    element={
                      <ProtectedRoute>
                        <JobDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="edit-profile"
                    element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="kyc"
                    element={
                      <ProtectedRoute>
                        <KYC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="wallet-history"
                    element={
                      <ProtectedRoute>
                        <ArtisanTranxHist />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Admin routes */}
                <Route path="/admin">
                  <Route path="login" element={<AdminAuth />} />
                  <Route
                    path="dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Tracking>
          </AutoScrollToTop>
          <AdminDashboardButton />
          <ScrollToTop />
          <Footer />
        </TranxProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
