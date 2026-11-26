import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    FaBullhorn,
    FaArrowLeft,
} from "react-icons/fa";


const communicationMenuItems = [
    {
        name: "Notices",
        path: "/communication/notices",
        icon: FaBullhorn,
    },
];


export default function CommunicationSidebar() {

    const currentPath = window.location.pathname;


    const isActive = (path) => {

        if (path === "/communication/notices") {

            return (
                currentPath === "/communication/notices" ||
                currentPath === "/communication/notices/inactive" ||
                currentPath === "/communication/notices/create" ||
                /^\/communication\/notices\/\d+$/.test(currentPath) ||
                /^\/communication\/notices\/\d+\/edit$/.test(currentPath)
            );

        }


        return (
            currentPath === path ||
            currentPath.startsWith(`${path}/`)
        );

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

            {/* =====================================================
                ANIMATED BACKGROUND
            ===================================================== */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-10
                    pointer-events-none
                "
            >

                <div
                    className="
                        absolute
                        top-0
                        left-0
                        w-96
                        h-96
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
                        absolute
                        bottom-0
                        right-0
                        w-[500px]
                        h-[500px]
                        bg-[#610e1e]
                        rounded-full
                        blur-[120px]
                        translate-x-1/2
                        translate-y-1/2
                        animate-pulse
                    "
                    style={{
                        animationDelay: "1s",
                    }}
                />

                <div
                    className="
                        absolute
                        top-1/2
                        left-1/2
                        w-80
                        h-80
                        bg-[#FFD963]/30
                        rounded-full
                        blur-[80px]
                        -translate-x-1/2
                        -translate-y-1/2
                        animate-pulse
                    "
                    style={{
                        animationDelay: "2s",
                    }}
                />

            </div>


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    px-3
                    py-4
                    border-b
                    border-[#FFD963]/20
                "
            >

                {/* Back */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >

                    <Link
                        to="/modules/dashboard"
                        className="
                            flex
                            items-center
                            gap-2
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
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                    }}
                    className="
                        flex
                        items-center
                        gap-3
                        mt-3
                    "
                >

                    {/* Icon */}

                    <div className="relative">

                        <div
                            className="
                                absolute
                                inset-0
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
                                w-11
                                h-11
                                bg-gradient-to-br
                                from-[#FFD963]
                                via-[#FFC107]
                                to-[#FFB300]
                                rounded-xl
                                shadow-lg
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaBullhorn
                                size={20}
                                className="text-[#610e1e]"
                            />

                        </div>

                    </div>


                    {/* Title */}

                    <div>

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-[#FFD963]
                                tracking-tight
                            "
                        >
                            Communication
                        </h2>

                        <p className="text-xs text-white/60">
                            Communication Management
                        </p>

                    </div>

                </motion.div>

            </div>


            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex-1
                    overflow-y-auto
                    py-3
                    px-2
                    sidebar-scroll
                "
            >

                {communicationMenuItems.map((item, index) => {

                    const Icon = item.icon;

                    const active =
                        isActive(item.path);


                    return (

                        <motion.div
                            key={item.path}
                            initial={{
                                opacity: 0,
                                x: -30,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
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
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-3
                                    rounded-xl
                                    transition-all
                                    duration-300
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
                                        w-7
                                        h-7
                                        flex
                                        items-center
                                        justify-center
                                        rounded-lg
                                        transition-all
                                        duration-300
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
                                            transition-all
                                            duration-300
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
                                        transition-colors
                                        duration-300
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
                                        layoutId="communication-active-indicator"
                                        className="
                                            ml-auto
                                            w-1.5
                                            h-6
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


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    border-t
                    border-[#FFD963]/20
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
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                        hover:from-[#7a1a2e]
                        hover:to-[#9a2a3e]
                        text-white
                        font-semibold
                        shadow-xl
                        transition-all
                        duration-300
                        group
                        relative
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-[#FFD963]/20
                            to-transparent
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            duration-300
                        "
                    />

                    <FaArrowLeft
                        className="
                            relative
                            group-hover:-translate-x-1
                            transition-transform
                            duration-300
                        "
                    />

                    <span className="relative">
                        Return to Dashboard
                    </span>

                </Link>

            </div>

        </aside>

    );

}