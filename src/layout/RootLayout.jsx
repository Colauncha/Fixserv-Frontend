import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollToTop from "../components/ScrollToTop"

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


