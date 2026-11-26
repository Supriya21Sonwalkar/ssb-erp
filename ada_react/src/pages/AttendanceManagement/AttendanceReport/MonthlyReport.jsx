import { useState, useEffect } from "react";
import { getMonthlyAttendanceReport, exportAttendanceExcel } from "../../../services/attendanceReportApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";

export default function MonthlyReport() {
    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [reportData, setReportData] = useState(null);

    const [filters, setFilters] = useState({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (filters.class_id) {
            fetchSectionsByClass(filters.class_id);
        } else {
            setSections([]);
        }
    }, [filters.class_id]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const academicYearResponse = await academicYearApi.getAll();
            const years = academicYearResponse.data?.data ?? academicYearResponse.data ?? [];
            setAcademicYears(years);

            // Auto-select current academic year
            const currentYear = new Date().getFullYear();
            const currentAcademicYear = years.find(year => {
                const yearStr = year.academic_year;
                return yearStr.includes(currentYear.toString());
            });
            if (currentAcademicYear) {
                setFilters(prev => ({ ...prev, academic_year_id: currentAcademicYear.id }));
            }

            const classResponse = await classApi.getAll();
            setClasses(classResponse.data?.data ?? classResponse.data ?? []);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSectionsByClass = async (classId) => {
        try {
            const response = await sectionApi.getByClass(classId);
            setSections(response.data?.data ?? response.data ?? []);
        } catch (error) {
            console.error("Error fetching sections:", error);
            setSections([]);
        }
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await getMonthlyAttendanceReport(filters);
            setReportData(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            const response = await exportAttendanceExcel({
                report_type: "monthly",
                ...filters,
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Monthly_Attendance_Register.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert("Failed to export report.");
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceStatusColor = (status) => {
        switch (status) {
            case "Present":
            case "P":
                return "bg-green-500 text-white";
            case "Absent":
            case "A":
                return "bg-red-500 text-white";
            case "Late":
            case "L":
                return "bg-yellow-500 text-white";
            case "Half-Day":
            case "HD":
                return "bg-orange-500 text-white";
            default:
                return "bg-gray-200 text-gray-600";
        }
    };

    const getAttendanceStatusShort = (status) => {
        switch (status) {
            case "Present":
                return "P";
            case "Absent":
                return "A";
            case "Late":
                return "L";
            case "Half-Day":
                return "HD";
            default:
                return "-";
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-[#610e1e]">Monthly Attendance Register</h1>
                <p className="text-gray-500 mt-2">View monthly attendance calendar for a class</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Academic Year</label>
                            <select
                                value={filters.academic_year_id}
                                onChange={(e) => setFilters({ ...filters, academic_year_id: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select</option>
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.academic_year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Class</label>
                            <select
                                value={filters.class_id}
                                onChange={(e) => setFilters({ ...filters, class_id: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select</option>
                                {classes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.class_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Section</label>
                            <select
                                value={filters.section_id}
                                onChange={(e) => setFilters({ ...filters, section_id: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.section_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Month</label>
                            <select
                                value={filters.month}
                                onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                {monthNames.map((name, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Year</label>
                            <input
                                type="number"
                                value={filters.year}
                                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                                className="w-full border rounded-lg p-2"
                                required
                                min="2020"
                                max="2030"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#610e1e] hover:bg-[#4b0b18] text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Register"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setReportData(null);
                                setFilters({
                                    ...filters,
                                    academic_year_id: "",
                                    class_id: "",
                                    section_id: "",
                                });
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            {/* Report Results */}
            {reportData && (
                <>
                    {/* Summary */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#610e1e]">
                                    {monthNames[filters.month - 1]} {filters.year}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    Total Students: {reportData.students.length}
                                </p>
                            </div>
                            <button
                                onClick={handleExportExcel}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Export to Excel
                            </button>
                        </div>
                    </div>

                    {/* Monthly Register Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[#610e1e] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left sticky left-0 bg-[#610e1e] z-10">Roll No</th>
                                        <th className="px-4 py-3 text-left sticky left-16 bg-[#610e1e] z-10">Student Name</th>
                                        {reportData.days.map((day) => (
                                            <th key={day} className="px-2 py-3 text-center min-w-[35px]">
                                                {day}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-center">P</th>
                                        <th className="px-4 py-3 text-center">A</th>
                                        <th className="px-4 py-3 text-center">L</th>
                                        <th className="px-4 py-3 text-center">HD</th>
                                        <th className="px-4 py-3 text-center">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.students.map((student) => (
                                        <tr key={student.student_id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-2 sticky left-0 bg-white z-10">{student.roll_no}</td>
                                            <td className="px-4 py-2 sticky left-16 bg-white z-10 max-w-[200px] truncate">
                                                {student.student_name}
                                            </td>
                                            {reportData.days.map((day) => (
                                                <td key={day} className="px-1 py-2 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-medium ${getAttendanceStatusColor(student.attendance[day])}`}
                                                    >
                                                        {getAttendanceStatusShort(student.attendance[day])}
                                                    </span>
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 text-center text-green-600 font-semibold">{student.present}</td>
                                            <td className="px-4 py-2 text-center text-red-600 font-semibold">{student.absent}</td>
                                            <td className="px-4 py-2 text-center text-yellow-600 font-semibold">{student.late}</td>
                                            <td className="px-4 py-2 text-center text-orange-600 font-semibold">{student.half_day}</td>
                                            <td className="px-4 py-2 text-center text-blue-600 font-semibold">{student.attendance_percentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-green-500 rounded"></span>
                                <span className="text-sm">Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-red-500 rounded"></span>
                                <span className="text-sm">Absent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-yellow-500 rounded"></span>
                                <span className="text-sm">Late</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-orange-500 rounded"></span>
                                <span className="text-sm">Half-Day</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-gray-200 rounded"></span>
                                <span className="text-sm">Not Marked</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}