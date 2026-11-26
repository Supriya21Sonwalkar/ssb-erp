import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAttendanceReportFilters,
    getDailyAttendanceReport,
    exportAttendanceExcel,
} from "../../../services/attendanceReportApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";

export default function DailyReport() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [reportData, setReportData] = useState(null);

    const [filters, setFilters] = useState({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        attendance_date: new Date().toISOString().split("T")[0],
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
            const response = await getDailyAttendanceReport(filters);
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
                report_type: "daily",
                ...filters,
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Daily_Attendance_Report.xlsx");
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
                return "bg-green-100 text-green-800";
            case "Absent":
            case "A":
                return "bg-red-100 text-red-800";
            case "Late":
            case "L":
                return "bg-yellow-100 text-yellow-800";
            case "Half-Day":
            case "HD":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-[#610e1e]">Daily Attendance Report</h1>
                <p className="text-gray-500 mt-2">View attendance for a specific date</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-semibold mb-2">Date</label>
                            <input
                                type="date"
                                value={filters.attendance_date}
                                onChange={(e) => setFilters({ ...filters, attendance_date: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#610e1e] hover:bg-[#4b0b18] text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Report"}
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
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Total Students</p>
                            <p className="text-2xl font-bold text-[#610e1e]">{reportData.summary.total_students}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Present</p>
                            <p className="text-2xl font-bold text-green-600">{reportData.summary.present}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Absent</p>
                            <p className="text-2xl font-bold text-red-600">{reportData.summary.absent}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Late</p>
                            <p className="text-2xl font-bold text-yellow-600">{reportData.summary.late}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Attendance %</p>
                            <p className="text-2xl font-bold text-blue-600">{reportData.summary.attendance_percentage}%</p>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end">
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

                    {/* Students Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[#610e1e] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Roll No</th>
                                        <th className="px-4 py-3 text-left">Admission No</th>
                                        <th className="px-4 py-3 text-left">Student Name</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Arrival Time</th>
                                        <th className="px-4 py-3 text-left">Departure Time</th>
                                        <th className="px-4 py-3 text-left">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.students.map((student) => (
                                        <tr key={student.attendance_id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{student.roll_no}</td>
                                            <td className="px-4 py-3">{student.admission_no}</td>
                                            <td className="px-4 py-3">{student.student_name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(student.attendance_status)}`}>
                                                    {student.attendance_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{student.arrival_time || "-"}</td>
                                            <td className="px-4 py-3">{student.departure_time || "-"}</td>
                                            <td className="px-4 py-3">{student.remarks || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}