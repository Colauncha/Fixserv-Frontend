import { Outlet } from "react-router-dom";
import ArtisanSidebar from "../components/Artisan Pages/ArtisanSidebar";
import ScrollToTop from "../components/ScrollToTop";

const ArtisanLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ScrollToTop />
      <ArtisanSidebar />

      <main className="lg:ml-56 pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ArtisanLayout;