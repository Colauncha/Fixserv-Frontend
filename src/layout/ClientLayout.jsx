import { Outlet } from "react-router-dom";
import ClientNavbar from "../components/Client-Screens/ClientNavbar";
import Footer from "../components/footer";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientNavbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

       <Footer />
    </div>
  );
};

export default ClientLayout;
