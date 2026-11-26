import { Outlet } from "react-router-dom";
import UserManagementSidebar from "../components/dashboard/sidebar/UserManagementSidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

export default function UserManagementLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <UserManagementSidebar />

      {/* Main Content Area */}
      <div className="ml-[260px] min-h-screen">
        {/* Navbar */}
        <div className="fixed right-0 top-0 z-30 ml-[260px] w-[calc(100%-260px)]">
          <DashboardNavbar />
        </div>

        {/* Page Content */}
        <main className="pt-20">
          <div className="min-h-[calc(100vh-80px)] p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}