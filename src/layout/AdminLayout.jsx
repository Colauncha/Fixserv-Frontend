import AdminNavbar from "../components/Admin-Auth/AdminNavbar";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "../components/Common/PageTransition";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      <AdminNavbar />

      <main className="flex-grow pt-16 bg-[#FFFFFF]">
        <PageTransition className="min-h-full" />
      </main>
    </div>
  );
};

export default AdminLayout;