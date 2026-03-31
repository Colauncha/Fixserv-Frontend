import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

// Layouts
import RootLayout from "./layout/RootLayout";
import ClientLayout from "./layout/ClientLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminOnboardingLayout from "./layout/AdminOnboardingLayout";
import ArtisanLayout from "./layout/ArtisanLayout";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/Contact";
import HelpSupport from "./pages/HelpSupport";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Auth
import SignUp from "./components/Sign-Auth/SignUp";
import LogIn from "./components/Sign-Auth/LogIn";
import ForgetPassword from "./components/Sign-Auth/ForgetPassword";
import ResetPassword from "./components/Sign-Auth/ResetPassword";

// Artisan Auth
import ArtisanSignUp from "./components/Artisan-Auth/ArtisanSignUp";
import ArtisanLogIn from "./components/Artisan-Auth/ArtisanLogIn";
import ArtisanForget from "./components/Artisan-Auth/ArtisanForget";
import ArtisanReset from "./components/Artisan-Auth/ArtisanReset";

// Admin Auth
import AdminSignUp from "./components/Admin-Auth/AdminSignUp";
import AdminLogIn from "./components/Admin-Auth/AdminLogIn";
import AdminForget from "./components/Admin-Auth/AdminForget";
import AdminReset from "./components/Admin-Auth/AdminReset";
import AdminConfirmSignUp from "./components/Admin-Auth/AdminConfirmSignUp";

// Client screens
import ClientHome from "./components/Client-Screens/ClientHome";
import ClientRequest from "./components/Client-Screens/ClientRequest";
import ClientHistory from "./components/Client-Screens/ClientHistory";
import TrackRepairA from "./components/Client-Screens/TrackRepairA";
import RateService from "./components/Client-Screens/RateService";

// Artisan Dashboard Screens
import Dashboard from "./components/Artisan Pages/Dashboard";
import Jobs from "./components/Artisan Pages/Jobs";
import ArtisanRepairHistory from "./components/Artisan Pages/ArtisanRepairHistory";
import Wallet from "./components/Artisan Pages/Wallet";
import Profile from "./components/Artisan Pages/Profile";
import Settings from "./components/Artisan Pages/Settings";
import VerifyArtisanEmail from "./components/Artisan-Auth/VerifyArtisanEmail";
import Verification from "./components/Artisan Pages/Verification";
import Help from "./components/Artisan Pages/Help";
import AcceptRequest from "./components/Artisan Pages/AcceptRequest";
import ArtisanCertificates from "./components/Artisan Pages/ArtisanCertificates";
import ArtisanProfile from "./components/Client-Screens/ArtisanProfile";

// Misc
import Notfound from "./components/Notfound";
import ClientArtisanProfile from "./components/Client-Screens/ClientArtisanProfile";
import ClientBooking from "./components/Client-Screens/ClientBooking";
import BookingSummary from "./components/Client-Screens/BookingSummary";
import BookingSummaryA from "./components/Client-Screens/BookingSummaryA";
import TrackRepair from "./components/Client-Screens/TrackRepair";
import UserProfile from "./components/Client-Screens/UserProfile";
import ProfileSettings from "./components/Client-Screens/ProfileSettings";
import ReferalPage from "./components/Client-Screens/Referral Screens/ReferalPage";
import RepairHistory from "./components/Client-Screens/Repair Screens/RepairHistory";
import ViewRepair from "./components/Client-Screens/Repair Screens/ViewRepair";
import RequestRepair from "./components/Client-Screens/Request Screens/RequestRepair";
import Technican from "./components/Client-Screens/Request Screens/Technican";
// import ClientNotification from "./components/Client-Screens/ClientNotification";
import Additem from "./components/Client-Screens/Additem";
import ViewTrackRepair from "./components/Client-Screens/ViewTrackRepair";
import AdminPostVerification from "./components/Admin-Auth/AdminPostVerification";
import AdminSetUp from "./components/Admin-Auth/AdminSetUp";
import AdminSetUpTwo from "./components/Admin-Auth/AdminSetUpTwo";
import AdminSetUpThree from "./components/Admin-Auth/AdminSetUpThree";
import AdminSetUpFour from "./components/Admin-Auth/AdminSetUpFour";
import AdminDashboard from "./components/Admin-Auth/AdminDashboard";
import VerifyArtisan from "./components/Admin-Auth/VerifyArtisan";
import ManageUser from "./components/Admin-Auth/ManageUser";
import MonitorTransaction from "./components/Admin-Auth/MonitorTransaction";
import Disputes from "./components/Admin-Auth/Disputes";
import ReviewRating from "./components/Client-Screens/ReviewRating";
import PostVerificationOne from "./components/Artisan-Auth/PostVerificationOne";
import PostVerificationTwo from "./components/Artisan-Auth/PostVerificationTwo";
import UploadCertificate from "./components/Artisan-Auth/UploadCertificate";
import CertificateReceived from "./components/Artisan-Auth/CertificateReceived";
import ReferEarn from "./components/Client-Screens/ReferEarn";
import Artisans from "./components/Admin-Auth/Artisans";
import AdminClients from "./components/Admin-Auth/AdminClients";

// routes
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import VerifyEmail from "./components/Sign-Auth/VerifyEmail";
import GlobalErrorAlert from "./components/Common/GlobalErrorAlert";


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contactUs" element={<ContactUs />} />
          <Route path="helpsupport" element={<HelpSupport />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<Notfound />} />
        </Route>

        {/* AUTH ROUTES — no navbar, no footer */}
        <Route element={<AuthLayout />}>
          <Route element={<PublicOnlyRoute />}>
            <Route path="sign-up" element={<SignUp />} />
            <Route path="log-in" element={<LogIn />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="artisan-signup" element={<ArtisanSignUp />} />
            <Route path="artisan-login" element={<ArtisanLogIn />} />
            <Route path="artisan-forget" element={<ArtisanForget />} />
            <Route path="artisan-reset" element={<ArtisanReset />} />
            <Route path="admin-signup" element={<AdminSignUp />} />
            <Route path="admin-login" element={<AdminLogIn />} />
            <Route path="admin-forget" element={<AdminForget />} />
            <Route path="admin-reset" element={<AdminReset />} />
            <Route path="admin-confirm-signup" element={<AdminConfirmSignUp />} />
            <Route path="verification-one" element={<PostVerificationOne />} />
            <Route path="verification-two" element={<PostVerificationTwo />} />
            <Route path="upload-certificate" element={<UploadCertificate />} />
            <Route path="certificate-received" element={<CertificateReceived />} />
            <Route path="artisan-verification" element={<VerifyArtisanEmail />} />
            <Route path="verification" element={<VerifyEmail />} />
          </Route>

          {/* auth 404 */}
          <Route path="*" element={<Notfound />} />
        </Route>

        {/* CLIENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientHome />} />
            <Route path="client-request" element={<ClientRequest />} />
            <Route path="history" element={<ClientHistory />} />

            <Route
              path="artisan-profile/:artisanId"
              element={<ClientArtisanProfile />}
            />

            <Route path="a-profile" element={<ArtisanProfile />} />
            <Route path="a-profile/:artisanId" element={<ArtisanProfile />} />

            <Route path="booking/:artisanId" element={<ClientBooking />} />
            <Route path="booking-summary-a" element={<BookingSummaryA />} />
            <Route path="booking-summary" element={<BookingSummary />} />

            <Route path="track-repair" element={<TrackRepair />} />
            <Route path="track-repair/:orderId" element={<TrackRepair />} />
            <Route path="track-repair-a" element={<TrackRepairA />} />
            <Route path="track-repair-a/:orderId" element={<TrackRepairA />} />

            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="refer-earn" element={<ReferEarn />} />
            <Route path="upload-item" element={<Additem />} />
            <Route path="view-track-repair" element={<ViewTrackRepair />} />
            <Route path ="rate-service" element={<RateService />} />
            <Route path="referral" element={<ReferalPage />} />
            <Route path="repair" element={<RepairHistory />} />
            <Route path="view" element={<ViewRepair />} />
            <Route path="request-repair" element={<RequestRepair />} />
            <Route path="technician" element={<Technican />} />
            <Route path="review-rating" element={<ReviewRating />} />

            {/* CLIENT 404 */}
            <Route path="*" element={<Notfound />} />
          </Route>
        </Route>

        {/* ARTISAN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ARTISAN"]} />}>
          <Route path="/artisan" element={<ArtisanLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="repair-history" element={<ArtisanRepairHistory />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<Profile />} />
            <Route path="verification" element={<Verification />} />
            <Route path="certificates" element={<ArtisanCertificates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="accept-request" element={<AcceptRequest />} />
            <Route path="accept-request/:orderId" element={<AcceptRequest />} />

            {/* ARTISAN 404 */}
            <Route path="*" element={<Notfound />} />
          </Route>
        </Route>

        {/* ADMIN DASHBOARD ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="verify-artisan" element={<VerifyArtisan />} />
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="monitor-transaction" element={<MonitorTransaction />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="artisans" element={<Artisans />} />
            <Route path="clients" element={<AdminClients />} />

            {/* ADMIN 404 */}
            <Route path="*" element={<Notfound />} />
          </Route>

          {/* ADMIN ONBOARDING ROUTES */}
          <Route path="/admin/onboarding" element={<AdminOnboardingLayout />}>
            <Route path="post-verification" element={<AdminPostVerification />} />
            <Route path="setup" element={<AdminSetUp />} />
            <Route path="setup-two" element={<AdminSetUpTwo />} />
            <Route path="setup-three" element={<AdminSetUpThree />} />
            <Route path="setup-four" element={<AdminSetUpFour />} />

            {/* ADMIN ONBOARDING 404 */}
            <Route path="*" element={<Notfound />} />
          </Route>
        </Route>

        {/* GLOBAL FALLBACK */}
        <Route path="*" element={<Notfound />} />
      </>
    )
  );

  //   return <RouterProvider router={router} />;
// };

  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorAlert />
    </>
  );
};

export default App;