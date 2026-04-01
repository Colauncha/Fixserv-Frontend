import ClientNavbar from "../components/Client-Screens/ClientNavbar";
import Footer from "../components/footer";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/Common/PageTransition";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      <ClientNavbar />

      <main className="flex-grow pt-16">
        <PageTransition className="min-h-full" />
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;