import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaBuilding,
    FaSitemap,
    FaUserTie,
    FaIdBadge,
    FaUserShield,
    FaClock,
    FaArrowLeft,
    FaTachometerAlt,
    FaLayerGroup,
    FaBoxes,
    FaBoxOpen,
} from "react-icons/fa";

const configurationMenuItems = [
    {
        name: "Dashboard",
        path: "/configuration/dashboard",
        icon: <FaTachometerAlt />,
    },
    {
        name: "Modules",
        path: "/configuration/modules",
        icon: <FaLayerGroup />,
    },
    {
        name: "Employees",
        path: "/configuration/employees",
        icon: <FaUsers />,
    },
    {
        name: "Branches",
        path: "/configuration/branches",
        icon: <FaBuilding />,
    },
    {
        name: "Departments",
        path: "/configuration/departments",
        icon: <FaSitemap />,
    },
    {
        name: "Designations",
        path: "/configuration/designations",
        icon: <FaUserTie />,
    },
    {
        name: "Employee Types",
        path: "/configuration/employee-types",
        icon: <FaIdBadge />,
    },
    {
        name: "Roles",
        path: "/configuration/roles",
        icon: <FaUserShield />,
    },
    {
        name: "Shifts",
        path: "/configuration/shifts",
        icon: <FaClock />,
    },
    {
        name: "Asset Categories",
        path: "/configuration/asset-categories",
        icon: <FaBoxes />,
    },
    {
        name: "Assets",
        path: "/configuration/assets",
        icon: <FaBoxes />,
    },
    {
        name: "Asset Subcategories",
        path: "/configuration/asset-subcategories",
        icon: <FaLayerGroup />,
    },
    {
        name: "Assets",
        path: "/configuration/assets",
        icon: <FaBoxOpen />,
    },
];

export default function ConfigurationSidebar() {
    return (
        <aside className=" fixed top-0 left-0 w-[280px] h-dvh shrink-0 bg-gradient-to-b from-[#1a0510] via-[#2d0a1a] to-[#1a0510] text-white shadow-2xl flex flex-col border-r border-[#FFD963]/20 z-50 overflow-hidden sidebar-scroll " > 
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD963] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#610e1e] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FFD963]/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header Section */}
            <div className="relative z-10 px-3 py-4 border-b border-[#FFD963]/20">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3" > 
                    <Link to="/modules/dashboard"
                        className="flex items-center gap-2 text-white/70 hover:text-[#FFD963] transition-colors">
                        <FaArrowLeft className="text-lg" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-3 mt-3" > 
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FFD963] rounded-xl blur-lg opacity-40 animate-pulse"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-[#FFD963] via-[#FFC107] to-[#FFB300] rounded-xl shadow-lg flex items-center justify-center">
                            <FaUsers size={20} className="text-[#610e1e]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#FFD963] tracking-tight">
                            Configuration
                        </h2>
                        <p className="text-xs text-white/60">
                            Manage system settings
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Menu Section */}
            <div className="relative z-10 flex-1 overflow-y-auto sidebar-scroll py-2 px-2">
                {configurationMenuItems.map((item, index) => (
                    <motion.div key={item.path} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08, type: "spring" }} className="mb-1" > 
                        <Link to={item.path} className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#FFD963]/20 hover:to-transparent transition-all duration-300 border border-transparent hover:border-[#FFD963]/30">
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <span className="text-lg text-[#FFD963]">
                                    {item.icon}
                                </span>
                            </div>
                            <span className="text-sm text-white/90 group-hover:text-[#FFD963] font-medium">
                                {item.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="relative z-10 border-t border-[#FFD963]/20 p-3 bg-gradient-to-t from-black/40 to-transparent">
                <Link to="/modules/dashboard" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] hover:from-[#7a1a2e] hover:to-[#9a2a3e] text-white font-semibold shadow-xl transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD963]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="relative">Return to Dashboard</span>
                </Link>
            </div>
        </aside>
    );
}
