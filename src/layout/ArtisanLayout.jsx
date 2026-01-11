import { Outlet } from "react-router-dom";
import ArtisanSidebar from "../components/Artisan Pages/ArtisanSidebar";
import ScrollToTop from "../components/ScrollToTop";

const ArtisanLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ScrollToTop />
      <ArtisanSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtisanLayout;
