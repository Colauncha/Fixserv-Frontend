import { Outlet } from "react-router-dom";
import ClientNavbar from "../components/Client-Screens/ClientNavbar";
<<<<<<< Updated upstream
import Footer from "../components/footer";
=======
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
>>>>>>> Stashed changes

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <ClientNavbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

       <Footer />
    </div>
  );
};

export default ClientLayout;
