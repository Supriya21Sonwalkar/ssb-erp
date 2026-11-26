import { Outlet } from "react-router-dom";

import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
import FeesManagementSidebar from "../components/dashboard/sidebar/FeesManagementSidebar";

export default function FeesManagementLayout() {

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Navbar */}
            <DashboardNavbar />

            {/* Main Content */}
            <div className="flex">

                {/* Sidebar */}
                <FeesManagementSidebar />

                {/* Page Content */}
                <main
                    className="
                        flex-1
                        ml-[280px]
                        mt-20
                        p-6
                        min-h-[calc(100vh-80px)]
                        overflow-auto
                    "
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}