import { useState, useEffect } from "react";
import { getStudentAttendanceReport, exportAttendanceExcel } from "../../../services/attendanceReportApi";
import studentApi from "../../../services/studentApi";

export default function StudentReport() {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [reportData, setReportData] = useState(null);

    const [filters, setFilters] = useState({
        student_id: "",
        from_date: "",
        to_date: "",
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentApi.getAll();
            setStudents(response.data?.data ?? response.data ?? []);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await getStudentAttendanceReport(filters);
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
                report_type: "student",
                ...filters,
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Student_Attendance_Report.xlsx");
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
                <h1 className="text-2xl font-bold text-[#610e1e]">Student Attendance Report</h1>
                <p className="text-gray-500 mt-2">View student-wise attendance for a date range</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleGenerateReport}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Student</label>
                            <select
                                value={filters.student_id}
                                onChange={(e) => setFilters({ ...filters, student_id: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.student_code} - {student.first_name} {student.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">From Date</label>
                            <input
                                type="date"
                                value={filters.from_date}
                                onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">To Date</label>
                            <input
                                type="date"
                                value={filters.to_date}
                                onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
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
                                    student_id: "",
                                    from_date: "",
                                    to_date: "",
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
                    {/* Student Info */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-[#610e1e] mb-4">Student Information</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm">Student Code</p>
                                <p className="font-semibold">{reportData.student.student_code}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Admission No</p>
                                <p className="font-semibold">{reportData.student.admission_no}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Roll No</p>
                                <p className="font-semibold">{reportData.student.roll_no}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Name</p>
                                <p className="font-semibold">{reportData.student.student_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <p className="text-gray-500 text-sm">Total Days</p>
                            <p className="text-2xl font-bold text-[#610e1e]">{reportData.summary.total_days}</p>
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

                    {/* Attendance Records Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[#610e1e] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Arrival Time</th>
                                        <th className="px-4 py-3 text-left">Departure Time</th>
                                        <th className="px-4 py-3 text-left">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.attendance.map((record, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{record.attendance_date}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.attendance_status)}`}>
                                                    {record.attendance_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{record.arrival_time || "-"}</td>
                                            <td className="px-4 py-3">{record.departure_time || "-"}</td>
                                            <td className="px-4 py-3">{record.remarks || "-"}</td>
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