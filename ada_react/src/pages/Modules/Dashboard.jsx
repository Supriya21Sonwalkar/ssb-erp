import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTh, FaBook, FaUsers, FaClipboardList, FaBus, FaChartBar, FaCog, FaCalendar, FaGraduationCap, FaBuilding, FaMoneyBill, FaFileAlt, FaBell, FaShieldAlt, FaClock, FaChevronUp, FaChevronDown, FaRocket, FaStar } from "react-icons/fa";
import moduleApi from "../../services/moduleApi";
import api from "../../services/api";


const iconMap = {
    'communication': FaBell,
    'lesson-planning': FaBook,
    'transport': FaBus,
    'academic': FaGraduationCap,
    'administration': FaBuilding,
    'finance': FaMoneyBill,
    'reports': FaChartBar,
    'settings': FaCog,
    'attendance': FaClipboardList,
    'calendar': FaCalendar,
    'users': FaUsers,
    'faschools': FaUsers,
    'default': FaTh
};

export default function ModuleDashboard() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentModules, setRecentModules] = useState([]);
    const [showAllModules, setShowAllModules] = useState(true);

    const [permittedMenus, setPermittedMenus] = useState([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);


    const [permittedModuleSlugs, setPermittedModuleSlugs] = useState(null);
    const [permissionLoadFailed, setPermissionLoadFailed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadModules();
        loadRecentModules();
        loadModulePermissions();
    }, []);

    const loadRecentModules = () => {
        const recentIds = JSON.parse(localStorage.getItem('recentModules') || '[]');
        setRecentModules(recentIds);
    };

    const saveToRecent = (moduleId) => {
        let recent = JSON.parse(localStorage.getItem('recentModules') || '[]');
        recent = recent.filter(id => id !== moduleId);
        recent.unshift(moduleId);
        if (recent.length > 6) {
            recent = recent.slice(0, 6);
        }
        localStorage.setItem('recentModules', JSON.stringify(recent));
        setRecentModules(recent);
    };

    const loadModules = async () => {
        try {
            const response = await moduleApi.getAll();
            const activeModules = response.data.data.filter(m => m.status);
            setModules(activeModules);
        } catch (error) {
            console.error(error);
            alert("Unable to load modules.");
        } finally {
            setLoading(false);
        }
    };

    const loadModulePermissions = async () => {
        try {
            const response = await api.get(
                "/user-management/role-menu-permissions/my-menu-permissions"
            );

            const menus = Array.isArray(response.data?.data)
                ? response.data.data
                : [];

            const allowedModules = new Set(
                menus
                    .map((menu) => menu.module_slug)
                    .filter(Boolean)
            );

            setPermittedMenus(menus);
            setIsSuperAdmin(response.data?.is_super_admin === true);
            setPermittedModuleSlugs(allowedModules);
            setPermissionLoadFailed(false);
        } catch (error) {
            console.error("Failed to load module permissions:", error);

            setPermittedMenus([]);
            setIsSuperAdmin(false);
            setPermittedModuleSlugs(new Set());
            setPermissionLoadFailed(true);
        }
    };

    const visibleModules =
        permittedModuleSlugs === null
            ? []
            : isSuperAdmin
            ? modules
            : modules.filter((module) =>
                permittedModuleSlugs.has(module.module_slug)
            );

    const getIcon = (iconName) => {
        const normalizedIcon = iconName?.toLowerCase().replace(/[^a-z-]/g, '');
        return iconMap[normalizedIcon] || iconMap['default'];
    };

    const getModuleColor = (index) => {
        const colors = [
            'bg-gradient-to-br from-blue-500 to-blue-600',
            'bg-gradient-to-br from-purple-500 to-purple-600',
            'bg-gradient-to-br from-green-500 to-green-600',
            'bg-gradient-to-br from-orange-500 to-orange-600',
            'bg-gradient-to-br from-pink-500 to-pink-600',
            'bg-gradient-to-br from-teal-500 to-teal-600',
            'bg-gradient-to-br from-indigo-500 to-indigo-600',
            'bg-gradient-to-br from-red-500 to-red-600',
        ];
        return colors[index % colors.length];
    };

    const getModuleLetter = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'M';
    };

    const getCategoryModules = (category) => {
        return modules.filter(m => 
            m.module_name?.toLowerCase().includes(category.toLowerCase())
        );
    };


    
const handleModuleClick = (moduleName) => {
    const module = visibleModules.find(
        (item) => item.module_name === moduleName
    );

    if (!module) {
        return;
    }

    // Find an accessible menu using module ID.
    const permittedMenu = permittedMenus.find(
        (menu) =>
            Number(menu.module_id) === Number(module.id) &&
            menu.route &&
            menu.route.trim() !== ""
    );

    // Navigate to the first available menu.
    if (permittedMenu) {
        navigate(permittedMenu.route);
        return;
    }

    // Super Admin has unrestricted access.
    if (isSuperAdmin) {
        const defaultRoutes = {
            "academic-management": "/academic-management/academic-year",
            "student-management": "/student-management/students",
            "attendance-management": "/attendance-management/daily-attendance",
            "homework-assignment-management": "/homework-assignment",
            "configuration": "/configuration/dashboard",
            "fees-management": "/fees/courses",
            "user-management": "/user-management/dashboard",
        };

        const defaultRoute = defaultRoutes[module.module_slug];

        if (defaultRoute) {
            navigate(defaultRoute);
            return;
        }

        navigate(`/modules/show/${module.id}`);
        return;
    }

    // Other roles cannot access unassigned modules.
    alert("No accessible pages are assigned to this module.");
};

    if (loading || permittedModuleSlugs === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#faf8f6] via-[#f5f3f0] to-[#e8e4df] flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#610e1e]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative w-24 h-24 border-4 border-[#610e1e] border-t-[#FFD963] rounded-full animate-spin mx-auto mb-6"></div>
                    </div>
                    <p className="text-[#2b2b2b] text-xl font-semibold tracking-wide">Loading modules...</p>
                    <p className="text-gray-500 text-sm mt-2">Preparing your workspace</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf8f6] via-[#f5f3f0] to-[#e8e4df] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FFD963]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#610e1e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFD963]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <main className="px-6 py-10 relative z-10">
                {permissionLoadFailed && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        Unable to load your permissions. Please check your login session
                        and try again.
                    </div>
                )}
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Welcome Section */}
                        
                        {/* Recently Accessed Header with Toggle */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-6 flex justify-between items-center border border-gray-100/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] rounded-xl flex items-center justify-center shadow-lg">
                                    <FaFileAlt className="text-xl text-[#FFD963]" />
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-[#2b2b2b]">Recently Accessed Modules</span>
                                    <p className="text-gray-500 text-sm mt-0.5">Quick access to your recent work</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAllModules(!showAllModules)}
                                className="bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all duration-300 hover:from-[#8a1a2e] hover:to-[#a02a3e] text-sm"
                            >
                                {showAllModules ? (
                                    <>
                                        View Less <FaChevronUp />
                                    </>
                                ) : (
                                    <>
                                        View All <FaChevronDown />
                                    </>
                                )}
                            </motion.button>
                        </motion.div> */}

                        {/* Recently Accessed Modules Grid */}
                        {!showAllModules && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-wrap gap-6 mb-8"
                            >
                                {recentModules.map((moduleId, index) => {
                                    const module = visibleModules.find(m => m.id === moduleId);
                                    if (!module) return null;
                                    const IconComponent = getIcon(module.module_icon);
                                    return (
                                        <motion.div
                                            key={module.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleModuleClick(module.module_name)}
                                            className="group flex flex-col items-center w-[140px] p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-[#FFD963] cursor-pointer"
                                        >
                                            <div className={`w-[70px] h-[70px] rounded-2xl ${getModuleColor(visibleModules.indexOf(module))} flex items-center justify-center mb-4 relative overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                                <IconComponent className="text-3xl text-white relative z-10" />
                                            </div>
                                            <h3 className="text-sm font-bold text-[#2b2b2b] text-center leading-tight group-hover:text-[#610e1e] transition-colors">
                                                {module.module_name}
                                            </h3>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* All Modules by Category - Only show when View All is clicked */}
                        {showAllModules && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-[#2b2b2b] flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] rounded-xl flex items-center justify-center shadow-lg">
                                            <FaTh className="text-xl text-[#FFD963]" />
                                        </div>
                                        All Modules
                                    </h2>
                                </div> */}

                                {/* Academic Structure */}
                                <div className="mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border-l-4 border-blue-500 shadow-md"
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <FaGraduationCap className="text-blue-600" />
                                            Academic Structure
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">Manage academic years, classes, subjects & more</p>
                                    </motion.div>
                                    <div className="flex flex-wrap gap-5">
                                        {visibleModules.map((module, index) => {
                                            const IconComponent = getIcon(module.module_icon);
                                            const isAcademic = ['academic', 'lesson', 'class', 'subject', 'student', 'teacher', 'attendance', 'attendence', 'homework', 'assignment'].some(keyword =>
                                                module.module_name?.toLowerCase().includes(keyword)
                                            );

                                            if (!isAcademic) return null;

                                            return (
                                                <motion.div
                                                    key={module.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleModuleClick(module.module_name)}
                                                    className="group flex flex-col items-center w-[140px] p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-blue-500 cursor-pointer"
                                                >
                                                    <div className={`w-[70px] h-[70px] rounded-2xl ${getModuleColor(index)} flex items-center justify-center mb-4 relative overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                                        <IconComponent className="text-3xl text-white relative z-10" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-[#2b2b2b] text-center leading-tight group-hover:text-blue-600 transition-colors">
                                                        {module.module_name}
                                                    </h3>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Administration */}
                                <div className="mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border-l-4 border-purple-500 shadow-md"
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <FaBuilding className="text-purple-600" />
                                            Administration
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">System configuration & settings</p>
                                    </motion.div>
                                    <div className="flex flex-wrap gap-5">
                                        {visibleModules.map((module, index) => {
                                            const IconComponent = getIcon(module.module_icon);
                                            const isAdmin = ['admin', 'finance', 'transport', 'report', 'setting', 'hr', 'employee', 'branch', 'configuration', 'fees', 'fee', 'communication','user management'].some(keyword =>
                                                module.module_name?.toLowerCase().includes(keyword)
                                            );

                                            if (!isAdmin) return null;

                                            return (
                                                <motion.div
                                                    key={module.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleModuleClick(module.module_name)}
                                                    className="group flex flex-col items-center w-[140px] p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-purple-500 cursor-pointer"
                                                >
                                                    <div className={`w-[70px] h-[70px] rounded-2xl ${getModuleColor(visibleModules.indexOf(module) + 4)} flex items-center justify-center mb-4 relative overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                                        <IconComponent className="text-3xl text-white relative z-10" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-[#2b2b2b] text-center leading-tight group-hover:text-purple-600 transition-colors">
                                                        {module.module_name}
                                                    </h3>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </motion.section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
