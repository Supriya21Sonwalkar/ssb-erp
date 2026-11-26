import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { motion } from "framer-motion";
import {
    FaSchool,
    FaCalendarAlt,
    FaChalkboardTeacher,
    FaBook,
    FaClock,
    FaTable,
    FaArrowLeft,
} from "react-icons/fa";

const academicMenuItems = [
    {
        name: "Academic Year",
        path: "/academic-management/academic-year",
        icon: <FaCalendarAlt />,
    },
    {
        name: "Class",
        path: "/academic-management/classes",
        icon: <FaChalkboardTeacher />,
    },
    {
        name: "Sections",
        path: "/academic-management/sections",
        icon: <FaChalkboardTeacher />,
    },
    {
        name: "Subjects",
        path: "/academic-management/subjects",
        icon: <FaBook />,
    },
    {
        name: "Class Subject Mapping",
        path: "/academic-management/class-subjects",
        icon: <FaBook />,
    },
    {
        name: "Teacher Allocation",
        path: "/academic-management/teacher-allocations",
        icon: <FaChalkboardTeacher />,
    },
    {
        name: "Period",
        path: "/academic-management/period",
        icon: <FaClock />,
    },
    {
        name: "Timetable",
        path: "/academic-management/timetable",
        icon: <FaTable />,
    },
];

export default function AcademicSidebar() {
    const [allowedPaths, setAllowedPaths] = useState(null);
    const [permissionError, setPermissionError] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await api.get(
                    "/user-management/role-menu-permissions/my-menu-permissions"
                );

                const menus = response.data?.data || [];
                setIsSuperAdmin(response.data?.is_super_admin === true);

                const academicPaths = menus
                    .filter(
                        (menu) =>
                            menu.module_slug === "academic-management" &&
                            menu.route
                    )
                    .map((menu) => normalizePath(menu.route));

                setAllowedPaths(new Set(academicPaths));
                setPermissionError(false);
            } catch (error) {
                console.error(
                    "Failed to load academic menu permissions:",
                    error
                );

                setAllowedPaths(new Set());
                setIsSuperAdmin(false);
                setPermissionError(true);
            }
        };

        fetchPermissions();
    }, []);

    const normalizePath = (path) =>
        path.replace(/\/+$/, "") || "/";

    const visibleAcademicMenus =
        allowedPaths === null
            ? []
            : isSuperAdmin
            ? academicMenuItems
            : academicMenuItems.filter((item) =>
                allowedPaths.has(normalizePath(item.path))
            );

    return (
        <aside
            className="
                fixed
                top-0
                left-0
                w-[280px]
                h-dvh
                shrink-0
                bg-gradient-to-b
                from-[#1a0510]
                via-[#2d0a1a]
                to-[#1a0510]
                text-white
                shadow-2xl
                flex
                flex-col
                border-r
                border-[#FFD963]/20
                z-50
                overflow-hidden
                sidebar-scroll
            "
        >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD963] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#610e1e] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FFD963]/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header Section */}
            <div className="relative z-10 px-3 py-4 border-b border-[#FFD963]/20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <Link
                        to="/modules/dashboard"
                        className="flex items-center gap-2 text-white/70 hover:text-[#FFD963] transition-colors"
                    >
                        <FaArrowLeft className="text-lg" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-3 mt-3"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FFD963] rounded-xl blur-lg opacity-40 animate-pulse"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-[#FFD963] via-[#FFC107] to-[#FFB300] rounded-xl shadow-lg flex items-center justify-center">
                            <FaSchool size={20} className="text-[#610e1e]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#FFD963] tracking-tight">
                            Academic Management
                        </h2>
                        <p className="text-xs text-white/60">
                            Manage academic settings
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Menu Section */}
            <div className="relative z-10 flex-1 overflow-y-auto sidebar-scroll py-2 px-2">
                {allowedPaths === null && (
                    <p className="px-3 py-4 text-sm text-white/60">
                        Loading permissions...
                    </p>
                )}

                {allowedPaths !== null && visibleAcademicMenus.length === 0 && (
                    <p className="px-3 py-4 text-sm text-white/60">
                        {permissionError
                            ? "Unable to load permissions. Please check your login session."
                            : "No academic menus have been assigned to your role."}
                    </p>
                )}
                {visibleAcademicMenus.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, type: "spring" }}
                        className="mb-1"
                    >
                        <Link
                            to={item.path}
                            className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#FFD963]/20 hover:to-transparent transition-all duration-300 border border-transparent hover:border-[#FFD963]/30"
                        >
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
                <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] hover:from-[#7a1a2e] hover:to-[#9a2a3e] text-white font-semibold shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD963]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="relative">Return to Dashboard</span>
                </Link>
            </div>
        </aside>
    );
}
