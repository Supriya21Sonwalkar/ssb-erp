import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function ModuleDashboardLayout() {
    return (
        <div className="bg-[#f5f7fb]">
            {/* Main Content */}
            <div className="flex min-h-screen flex-col">
                <DashboardNavbar />

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
