
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

// Auth
import SignUp from "./components/Sign-Auth/SignUp";
import LogIn from "./components/Sign-Auth/LogIn";
import ForgetPassword from "./components/Sign-Auth/ForgetPassword";
import ResetPassword from "./components/Sign-Auth/ResetPassword";

//Artisan Auth
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

// Artisan Dashboard Screens
import Dashboard from "./components/Artisan Pages/Dashboard";
import Jobs from "./components/Artisan Pages/Jobs";
import Notification from "./components/Artisan Pages/Notification";
import Wallet from "./components/Artisan Pages/Wallet";
import Profile from "./components/Artisan Pages/Profile";
import Settings from "./components/Artisan Pages/Settings";
import Verification from "./components/Artisan Pages/Verification";
import Help from "./components/Artisan Pages/Help";



// Misc
import Notfound from "./components/Notfound";
import ClientArtisanProfile from "./components/Client-Screens/ClientArtisanProfile";
import ClientBooking from "./components/Client-Screens/ClientBooking";
import BookingSummary from "./components/Client-Screens/BookingSummary";
import TrackRepair from "./components/Client-Screens/TrackRepair";
import UserProfile from "./components/Client-Screens/UserProfile";
import ProfileSettings from "./components/Client-Screens/ProfileSettings";
import ReferalPage from "./components/Client-Screens/Referral Screens/ReferalPage";
import RepairHistory from "./components/Client-Screens/Repair Screens/RepairHistory";
import ViewRepair from "./components/Client-Screens/Repair Screens/ViewRepair";
import RequestRepair from "./components/Client-Screens/Request Screens/RequestRepair";
import Technican from "./components/Client-Screens/Request Screens/Technican";
import ClientNotification from "./components/Client-Screens/ClientNotification";
import Additem from "./components/Client-Screens/Additem";
import RateServiceRepair from "./components/Client-Screens/RateServiceRepair";
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


// import Text from "./pages/text";


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* PUBLIC ROUTES */}
<Route path="/" element={<RootLayout />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="contactUs" element={<ContactUs />} />
  <Route path="*" element={<Notfound />} />
  {/* <Route path="text" element={<Text />} /> */}
</Route>

{/* AUTH ROUTES — no navbar, no footer */}
<Route element={<AuthLayout />}>
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
</Route>


        {/* CLIENT ROUTES */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientHome />} />
          <Route path="client-request" element={<ClientRequest />} />
          <Route path="history" element={<ClientHistory />} />
          <Route path="artisan-profile" element={<ClientArtisanProfile />} />
          <Route path="booking" element={<ClientBooking />} />
          <Route path="booking-summary" element={<BookingSummary />} />
          <Route path="track-repair" element={<TrackRepair />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="notifications" element={<ClientNotification />} /> 
          <Route path="refer-earn" element={<ReferEarn />} />
          <Route path="upload-item" element={<Additem />} />
          <Route path="rate-service" element={<RateServiceRepair />} />
          <Route path="referral" element={<ReferalPage />} />
          <Route path="repair" element={<RepairHistory />} />
          <Route path="view" element={<ViewRepair />} />
          <Route path="request-repair" element={<RequestRepair />} />
          <Route path="technician" element={<Technican />} />
          <Route path="review-rating" element={<ReviewRating />} />

        </Route>


<Route path="/artisan" element={<ArtisanLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="jobs" element={<Jobs />} />
  <Route path="notification" element={<Notification />} />
  <Route path="wallet" element={<Wallet />} />
  <Route path="profile" element={<Profile />} />
  <Route path="verification" element={<Verification />} />
  <Route path="settings" element={<Settings />} />
  <Route path="help" element={<Help />} />
</Route>


       {/* ADMIN DASHBOARD ROUTES (WITH AdminNavbar) */}
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="verify-artisan" element={<VerifyArtisan />} />
  <Route path="manage-user" element={<ManageUser />} />
  <Route path="monitor-transaction" element={<MonitorTransaction />} />
  <Route path="disputes" element={<Disputes />} />
</Route>

{/* ADMIN ONBOARDING ROUTES (WITHOUT AdminNavbar) */}
<Route path="/admin" element={<AdminOnboardingLayout />}>
  <Route path="admin-post-verification" element={<AdminPostVerification />} />
  <Route path="admin-setup" element={<AdminSetUp />} />
  <Route path="admin-setup-two" element={<AdminSetUpTwo />} />
  <Route path="admin-setup-three" element={<AdminSetUpThree />} />
  <Route path="admin-setup-four" element={<AdminSetUpFour />} />
</Route>

      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
