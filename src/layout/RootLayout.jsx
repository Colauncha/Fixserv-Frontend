import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/Common/PageTransition";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-16">
        <ScrollToTop />
        <PageTransition className="min-h-full" />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;