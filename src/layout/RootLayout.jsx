import { Outlet } from "react-router-dom";
<<<<<<< Updated upstream
import Navbar from "../components/navbar";
import Footer from "../components/footer";
=======
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop"
>>>>>>> Stashed changes

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <ScrollToTop />  

      <Navbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};


export default RootLayout;


