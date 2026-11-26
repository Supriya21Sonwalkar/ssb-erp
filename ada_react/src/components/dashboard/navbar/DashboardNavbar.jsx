import { useState } from "react";
import { FaBars, FaBell, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const globalSearchItems = [
    // Academic Management
    { name: "Academic Year", path: "/academic-management/academic-year", category: "Academic" },
    { name: "Class", path: "/academic-management/classes", category: "Academic" },
    { name: "Sections", path: "/academic-management/sections", category: "Academic" },
    { name: "Subjects", path: "/academic-management/subjects", category: "Academic" },
    { name: "Class Subject Mapping", path: "/academic-management/class-subjects", category: "Academic" },
    { name: "Teacher Allocation", path: "/academic-management/teacher-allocation", category: "Academic" },
    { name: "Period", path: "/academic-management/period", category: "Academic" },
    { name: "Timetable", path: "/academic-management/timetable", category: "Academic" },
    // Configuration
    { name: "Dashboard", path: "/dashboard", category: "General" },
    { name: "Modules", path: "/configuration/modules", category: "Configuration" },
    { name: "Employees", path: "/configuration/employees", category: "Configuration" },
    { name: "Branches", path: "/configuration/branches", category: "Configuration" },
    { name: "Departments", path: "/configuration/departments", category: "Configuration" },
    { name: "Designations", path: "/configuration/designations", category: "Configuration" },
    { name: "Employee Types", path: "/configuration/employee-types", category: "Configuration" },
    { name: "Roles", path: "/configuration/roles", category: "Configuration" },
    { name: "Students Bulk Import", path: "/student-management/students/bulk-import", category: "Student" },
    { name: "Shifts", path: "/configuration/shifts", category: "Configuration" },
    // Student Management
    { name: "Student Registration", path: "/student-management/students", category: "Student" },

    { name: "Student Profiles", path: "/students", category: "Student" },
    { name: "Parent Information", path: "/students", category: "Student" },
    // Attendance
    { name: "Daily Student Attendance", path: "/attendance", category: "Attendance" },
    { name: "Attendance Reports", path: "/attendance", category: "Attendance" },
    // Homework
    { name: "Homework Posting", path: "/homework", category: "Homework" },
    { name: "Assignment Tracking", path: "/homework", category: "Homework" },
    // Examination
    { name: "Examination Setup", path: "/examination", category: "Examination" },
    { name: "Marks Entry", path: "/examination", category: "Examination" },
    { name: "Report Card Generation", path: "/examination", category: "Examination" },
    // Fee
    { name: "Fee Structure", path: "/fees", category: "Fee" },
    { name: "Fee Collection", path: "/fees", category: "Fee" },
];

export default function DashboardNavbar({hasSidebar = false,sidebarWidth = "280px",}) {

    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const navigate = useNavigate();

    const filteredResults = globalSearchItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchItemClick = (path) => {
        navigate(path);
        setSearchQuery("");
        setShowSearchResults(false);
    };

    return (
<header
    className={`
        h-20
        bg-gradient-to-r
        from-white
        via-white
        to-gray-50
        shadow-lg
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        px-8
        sticky
        top-0
        z-50
        transition-all
        duration-300
        ${hasSidebar ? "ml-[250px]" : ""}
    `}
>
            {/* Left Section */}
            <div className="flex items-center gap-5">

                <button className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] text-white flex items-center justify-center hover:from-[#8a1a2e] hover:to-[#a02a3e] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <FaBars size={18} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] bg-clip-text text-transparent">
                        Dashboard
                    </h1>

                    <p className="text-sm text-gray-500">
                        Welcome to Aaryans Defence Academy ERP
                    </p>
                </div>

            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">

                {/* Global Search */}
                <div className="relative hidden lg:block">
                    <div className="relative">
                        <FaSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search modules, pages..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearchResults(e.target.value.length > 0);
                            }}
                            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                            className="w-80 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:shadow-lg transition-all duration-300 border border-gray-200"
                        />

                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setShowSearchResults(false);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <FaTimes size={14} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && filteredResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                            <div className="p-2">
                                {filteredResults.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearchItemClick(item.path)}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#FFD963]/10 hover:to-transparent transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 group-hover:text-[#610e1e] transition-colors">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {item.category}
                                                </p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-[#FFD963] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {showSearchResults && filteredResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
                            <p className="text-sm text-gray-500 text-center">
                                No results found for "{searchQuery}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Notification */}
                <button className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF8E6] to-[#FFE4B5] text-[#610e1e] flex items-center justify-center hover:from-[#FFD963] hover:to-[#FFC107] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">

                    <FaBell size={18} />

                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] flex items-center justify-center shadow-md">
                        3
                    </span>

                </button>

                {/* Profile */}
                <Link
                    to="/profile"
                    className="flex items-center gap-3 group"
                >

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] text-[#FFD963] flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        A
                    </div>

                    <div className="hidden md:block">
                        <h4 className="font-semibold text-[#610e1e] group-hover:text-[#8a1a2e] transition-colors">
                            Administrator
                        </h4>

                        <p className="text-xs text-gray-500">
                            Super Admin
                        </p>
                    </div>

                </Link>

            </div>

        </header>
    );
}