// import { Outlet } from "react-router-dom";
// import ScrollToTop from "../components/ScrollToTop";

// const AuthLayout = () => {
//   return (
//     <div className="min-h-screen">
//       <ScrollToTop />
//       <Outlet />
//     </div>
//   );
// };

// export default AuthLayout;


import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/Common/PageTransition";

const AuthLayout = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <PageTransition className="min-h-screen" />
    </div>
  );
};

export default AuthLayout;