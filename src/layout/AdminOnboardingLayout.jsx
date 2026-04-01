// import { Outlet } from "react-router-dom";
// import AdNavbar from "../components/Admin-Auth/AdNavbar";
// import ScrollToTop from "../components/ScrollToTop";


// const AdminOnboardingLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <ScrollToTop />
//       <AdNavbar />


//       <main className="flex-grow pt-16 bg-[#F6F6F6]">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminOnboardingLayout;


import AdNavbar from "../components/Admin-Auth/AdNavbar";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/Common/PageTransition";

const AdminOnboardingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      <AdNavbar />

      <main className="flex-grow pt-16 bg-[#F6F6F6]">
        <PageTransition className="min-h-full" />
      </main>
    </div>
  );
};

export default AdminOnboardingLayout;