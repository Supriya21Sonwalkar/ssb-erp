import { Link } from "react-router-dom";

export default function AttendanceReportIndex() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-[#610e1e]">Attendance Reports</h1>
                <p className="text-gray-500 mt-2">Generate and view various attendance reports</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Daily Report */}
                <Link
                    to="/attendance-management/reports/daily"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#610e1e]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#610e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#610e1e]">Daily Report</h3>
                        <p className="text-gray-500 text-sm mt-2">View attendance for a specific date</p>
                    </div>
                </Link>

                {/* Student Report */}
                <Link
                    to="/attendance-management/reports/student"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#610e1e]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#610e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#610e1e]">Student Report</h3>
                        <p className="text-gray-500 text-sm mt-2">View student-wise attendance</p>
                    </div>
                </Link>

                {/* Class Report */}
                <Link
                    to="/attendance-management/reports/class"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#610e1e]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#610e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#610e1e]">Class Report</h3>
                        <p className="text-gray-500 text-sm mt-2">View class-wise attendance</p>
                    </div>
                </Link>

                {/* Monthly Report */}
                <Link
                    to="/attendance-management/reports/monthly"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#610e1e]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#610e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#610e1e]">Monthly Register</h3>
                        <p className="text-gray-500 text-sm mt-2">View monthly attendance register</p>
                    </div>
                </Link>
            </div>

            {/* Back Link */}
            <div className="text-center">
                <Link
                    to="/attendance-management/daily-attendance"
                    className="inline-flex items-center text-[#610e1e] hover:underline"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Daily Attendance
                </Link>
            </div>
        </div>
    );
}