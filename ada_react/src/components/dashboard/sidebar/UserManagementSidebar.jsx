import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
    FaTachometerAlt,
    FaUsers,
    FaUserShield,
    FaArrowLeft,
    FaUserCog,
} from "react-icons/fa";

const userManagementMenuItems = [
    {
        name: "Dashboard",
        path: "/user-management/dashboard",
        icon: FaTachometerAlt,
    },
     {
        name: "User Roles",
        path: "/user-management/roles",
        icon: FaUserShield,
    },
    {
        name: "Users",
        path: "/user-management/users",
        icon: FaUsers,
    },
    {
        name: "Roles & Permissions",
        path: "/user-management/roles-permissions",
        icon: FaUserShield,
    },
];

export default function UserManagementSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    // Keep the relevant menu item active on child pages too.
    const isActive = (path) => {
        if (path === "/user-management/dashboard") {
            return currentPath === path;
        }

        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

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
            "
        >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    className="
                        absolute top-0 left-0
                        w-96 h-96
                        bg-[#FFD963]
                        rounded-full
                        blur-[100px]
                        -translate-x-1/2
                        -translate-y-1/2
                        animate-pulse
                    "
                />

                <div
                    className="
                        absolute bottom-0 right-0
                        w-[500px] h-[500px]
                        bg-[#610e1e]
                        rounded-full
                        blur-[120px]
                        translate-x-1/2
                        translate-y-1/2
                        animate-pulse
                    "
                    style={{ animationDelay: "1s" }}
                />

                <div
                    className="
                        absolute top-1/2 left-1/2
                        w-80 h-80
                        bg-[#FFD963]/30
                        rounded-full
                        blur-[80px]
                        -translate-x-1/2
                        -translate-y-1/2
                        animate-pulse
                    "
                    style={{ animationDelay: "2s" }}
                />
            </div>

            {/* Header */}
            <div className="relative z-10 px-4 py-4 border-b border-[#FFD963]/20">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        to="/modules/dashboard"
                        className="
                            flex items-center gap-2
                            text-white/70
                            hover:text-[#FFD963]
                            transition-colors
                        "
                    >
                        <FaArrowLeft className="text-lg" />
                        <span className="text-sm font-medium">
                            Back
                        </span>
                    </Link>
                </motion.div>

                {/* Module Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-3 mt-4"
                >
                    {/* Icon */}
                    <div className="relative shrink-0">
                        <div
                            className="
                                absolute inset-0
                                bg-[#FFD963]
                                rounded-xl
                                blur-lg
                                opacity-40
                                animate-pulse
                            "
                        />

                        <div
                            className="
                                relative
                                w-11 h-11
                                bg-gradient-to-br
                                from-[#FFD963]
                                via-[#FFC107]
                                to-[#FFB300]
                                rounded-xl
                                shadow-lg
                                flex items-center justify-center
                            "
                        >
                            <FaUserCog
                                size={21}
                                className="text-[#610e1e]"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-[#FFD963] tracking-tight">
                            User Management
                        </h2>

                        <p className="mt-1 text-xs text-white/60">
                            Administration Panel
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <div
                className="
                    relative z-10
                    flex-1
                    overflow-y-auto
                    py-4 px-2
                    sidebar-scroll
                "
            >
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                    Main Menu
                </p>

                {userManagementMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: index * 0.08,
                                type: "spring",
                            }}
                            className="mb-1"
                        >
                            <Link
                                to={item.path}
                                className={`
                                    group
                                    w-full
                                    flex items-center gap-3
                                    px-3 py-3
                                    rounded-xl
                                    transition-all duration-300
                                    border
                                    ${
                                        active
                                            ? `
                                                bg-gradient-to-r
                                                from-[#FFD963]/20
                                                to-transparent
                                                border-[#FFD963]/40
                                                shadow-lg
                                            `
                                            : `
                                                border-transparent
                                                hover:bg-gradient-to-r
                                                hover:from-[#FFD963]/20
                                                hover:to-transparent
                                                hover:border-[#FFD963]/30
                                            `
                                    }
                                `}
                            >
                                {/* Icon */}
                                <div
                                    className={`
                                        relative
                                        w-8 h-8
                                        shrink-0
                                        flex items-center justify-center
                                        rounded-lg
                                        transition-all duration-300
                                        ${
                                            active
                                                ? "bg-[#FFD963] shadow-md"
                                                : "group-hover:bg-[#FFD963]/10"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`
                                            text-lg
                                            transition-all duration-300
                                            ${
                                                active
                                                    ? "text-[#610e1e]"
                                                    : "text-[#FFD963]"
                                            }
                                        `}
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                                        text-sm
                                        transition-colors duration-300
                                        ${
                                            active
                                                ? "text-[#FFD963] font-semibold"
                                                : "text-white/90 group-hover:text-[#FFD963] font-medium"
                                        }
                                    `}
                                >
                                    {item.name}
                                </span>

                                {/* Active Indicator */}
                                {active && (
                                    <motion.div
                                        layoutId="user-management-active-indicator"
                                        className="
                                            ml-auto
                                            w-1.5 h-6
                                            rounded-full
                                            bg-[#FFD963]
                                        "
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div
                className="
                    relative z-10
                    border-t border-[#FFD963]/20
                    p-3
                    bg-gradient-to-t
                    from-black/40
                    to-transparent
                "
            >
                <Link
                    to="/modules/dashboard"
                    className="
                        w-full
                        flex items-center justify-center gap-2
                        px-4 py-2.5
                        rounded-xl
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                        hover:from-[#7a1a2e]
                        hover:to-[#9a2a3e]
                        text-white
                        font-semibold
                        shadow-xl
                        transition-all duration-300
                        group
                        relative
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            absolute inset-0
                            bg-gradient-to-r
                            from-[#FFD963]/20
                            to-transparent
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity duration-300
                        "
                    />

                    <FaArrowLeft
                        className="
                            relative
                            group-hover:-translate-x-1
                            transition-transform duration-300
                        "
                    />

                    <span className="relative">
                        Return to Dashboard
                    </span>
                </Link>

                <p className="mt-3 text-center text-xs text-white/40">
                    User Management Module
                </p>
            </div>
        </aside>
    );
}