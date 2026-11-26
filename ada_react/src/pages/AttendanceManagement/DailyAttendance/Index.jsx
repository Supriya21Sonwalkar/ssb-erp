import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaList,
    FaCalendarCheck,
    FaSearch,
    FaEye,
    FaEdit,
    FaLock,
    FaUnlock,
    FaCalendarDay,
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaCalendarAlt,
} from "react-icons/fa";
import { getAttendanceIndex } from "../../../services/dailyAttendanceApi";

export default function Index() {
    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [filters, setFilters] = useState({
        attendance_date: new Date().toISOString().split("T")[0],
        academic_year_id: "",
        class_id: "",
        section_id: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch Initial Data (First Load)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchAttendanceData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Fetch Sections when class_id changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (filters.class_id) {
            const matchedSections = sections.filter(
                (s) => String(s.class_id) === String(filters.class_id)
            );
            // If sections already loaded for this class, no-op
            if (matchedSections.length === 0 && academicYears.length > 0) {
                fetchAttendanceData();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.class_id]);

    /*
    |--------------------------------------------------------------------------
    | Fetch Data
    |--------------------------------------------------------------------------
    */

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const params = {};
            if (filters.attendance_date) params.attendance_date = filters.attendance_date;
            if (filters.academic_year_id) params.academic_year_id = filters.academic_year_id;
            if (filters.class_id) params.class_id = filters.class_id;
            if (filters.section_id) params.section_id = filters.section_id;

            const response = await getAttendanceIndex(params);

            const payload = response.data?.data ?? response.data ?? {};

            setAcademicYears(payload.academic_years || []);
            setClasses(payload.classes || []);
            setSections(payload.sections || []);
            setSessions(payload.attendance_sessions || []);
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load attendance sessions.";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Handlers
    |--------------------------------------------------------------------------
    */

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchAttendanceData();
    };

    const handleResetFilters = () => {
        setFilters({
            attendance_date: new Date().toISOString().split("T")[0],
            academic_year_id: "",
            class_id: "",
            section_id: "",
        });
        setTimeout(() => fetchAttendanceData(), 0);
    };

    /*
    |--------------------------------------------------------------------------
    | Summary Totals
    |--------------------------------------------------------------------------
    */

    const summary = sessions.reduce(
        (acc, s) => {
            acc.total_sessions += 1;
            acc.total_students += Number(s.total_students || 0);
            acc.present += Number(s.present || 0);
            acc.absent += Number(s.absent || 0);
            acc.late += Number(s.late || 0);
            acc.half_day += Number(s.half_day || 0);
            acc.on_leave += Number(s.on_leave || 0);
            return acc;
        },
        {
            total_sessions: 0,
            total_students: 0,
            present: 0,
            absent: 0,
            late: 0,
            half_day: 0,
            on_leave: 0,
        }
    );

    const overallPercent =
        summary.total_students > 0
            ? ((summary.present / summary.total_students) * 100).toFixed(2)
            : "0.00";

    /*
    |--------------------------------------------------------------------------
    | Helper: Sections dropdown filtered by selected class
    |--------------------------------------------------------------------------
    */

    const filteredSections = filters.class_id
        ? sections.filter(
              (s) => String(s.class_id) === String(filters.class_id)
          )
        : sections;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Daily Attendance
                        </h1>
                        <p className="text-gray-500 mt-1">
                            View date-wise attendance across classes & sections
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/attendance-management/daily-attendance/create"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#610e1e] to-[#8B1A2E] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                        >
                            <FaPlus /> Mark Attendance
                        </Link>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shrink-0">
                        ✕
                    </div>
                    <p className="font-semibold text-sm">{errorMessage}</p>
                </div>
            )}

            {/* Filter Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <form
                    onSubmit={handleSearch}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end"
                >
                    <div>
                        <label className="block text-[#610e1e]/80 uppercase tracking-[0.12em] text-[10px] font-bold mb-2">
                            <span className="inline-flex items-center gap-1">
                                <FaCalendarDay className="text-[#FFD963]" /> Attendance Date
                            </span>
                        </label>
                        <input
                            type="date"
                            value={filters.attendance_date}
                            onChange={(e) =>
                                handleFilterChange("attendance_date", e.target.value)
                            }
                            className="w-full bg-[#faf8f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FFD963] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[#610e1e]/80 uppercase tracking-[0.12em] text-[10px] font-bold mb-2">
                            Academic Year
                        </label>
                        <select
                            value={filters.academic_year_id}
                            onChange={(e) =>
                                handleFilterChange("academic_year_id", e.target.value)
                            }
                            className="w-full bg-[#faf8f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FFD963] transition-all"
                        >
                            <option value="">All Years</option>
                            {academicYears.map((ay) => (
                                <option key={ay.id} value={ay.id}>
                                    {ay.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[#610e1e]/80 uppercase tracking-[0.12em] text-[10px] font-bold mb-2">
                            Class
                        </label>
                        <select
                            value={filters.class_id}
                            onChange={(e) => {
                                handleFilterChange("class_id", e.target.value);
                                handleFilterChange("section_id", "");
                            }}
                            className="w-full bg-[#faf8f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FFD963] transition-all"
                        >
                            <option value="">All Classes</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.class_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[#610e1e]/80 uppercase tracking-[0.12em] text-[10px] font-bold mb-2">
                            Section
                        </label>
                        <select
                            value={filters.section_id}
                            onChange={(e) =>
                                handleFilterChange("section_id", e.target.value)
                            }
                            disabled={!filters.class_id && sections.length === 0}
                            className="w-full bg-[#faf8f4] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FFD963] transition-all disabled:opacity-60"
                        >
                            <option value="">All Sections</option>
                            {filteredSections.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.section_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#610e1e] to-[#8B1A2E] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                        >
                            <FaSearch /> {loading ? "Loading..." : "Search"}
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                            title="Reset filters to today"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Quick Actions (Two cards)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    to="/attendance-management/daily-attendance/create"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:border-[#610e1e] group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <FaPlus className="text-xl text-[#FFD963]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#2b2b2b]">
                                Mark Attendance
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Create new attendance session
                            </p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/attendance-management/daily-attendance/inactive"
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:border-[#610e1e] group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <FaList className="text-xl text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#2b2b2b]">
                                Inactive Sessions
                            </h3>
                            <p className="text-gray-500 text-sm">
                                View deactivated attendance
                            </p>
                        </div>
                    </div>
                </Link>
            </div> */}

            {/* Overall Summary Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-600 font-bold mb-2">
                        <FaCalendarAlt /> Sessions
                    </div>
                    <div className="text-2xl font-extrabold text-[#2b2b2b]">
                        {summary.total_sessions}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-indigo-600 font-bold mb-2">
                        <FaUsers /> Total
                    </div>
                    <div className="text-2xl font-extrabold text-[#2b2b2b]">
                        {summary.total_students}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-green-600 font-bold mb-2">
                        <FaCheckCircle /> Present
                    </div>
                    <div className="text-2xl font-extrabold text-green-600">
                        {summary.present}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-red-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-600 font-bold mb-2">
                        <FaTimesCircle /> Absent
                    </div>
                    <div className="text-2xl font-extrabold text-red-600">
                        {summary.absent}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-yellow-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-yellow-600 font-bold mb-2">
                        <FaClock /> Late
                    </div>
                    <div className="text-2xl font-extrabold text-yellow-600">
                        {summary.late}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-purple-600 font-bold mb-2">
                        ½ Day
                    </div>
                    <div className="text-2xl font-extrabold text-purple-600">
                        {summary.half_day}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] rounded-2xl shadow-md p-5 text-white">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#FFD963] font-bold mb-2">
                        <FaCalendarCheck /> Attendance %
                    </div>
                    <div className="text-2xl font-extrabold">
                        {overallPercent}%
                    </div>
                </div>
            </div> */}

            {/* Attendance Sessions Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-[#610e1e] flex items-center gap-2">
                        <FaList className="text-[#FFD963]" />
                        Attendance Sessions for{" "}
                        <span className="underline decoration-[#FFD963] decoration-2">
                            {filters.attendance_date || "—"}
                        </span>
                    </h3>
                    <div className="text-sm text-gray-500">
                        Showing {sessions.length} session
                        {sessions.length === 1 ? "" : "s"}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#610e1e]/90 to-[#8a1a2e]/90 text-white">
                                <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider text-[11px]">
                                    Class / Section
                                </th>
                                <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider text-[11px]">
                                    Academic Year
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">
                                    Total
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px] text-green-200">
                                    P
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px] text-red-200">
                                    A
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px] text-yellow-200">
                                    L
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px] text-purple-200">
                                    H
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px] text-blue-200">
                                    Leave
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">
                                    %
                                </th>
                                <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider text-[11px]">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-right font-semibold uppercase tracking-wider text-[11px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        <div className="inline-flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-5 w-5 text-[#610e1e]"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Loading attendance sessions...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && sessions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="px-5 py-14 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-[#faf8f4] rounded-2xl flex items-center justify-center">
                                                <FaCalendarCheck
                                                    className="text-3xl text-[#610e1e]/30"
                                                />
                                            </div>
                                            <p className="font-bold text-[#610e1e]">
                                                No attendance found for this date
                                            </p>
                                            <p className="text-sm text-gray-500 max-w-md">
                                                Attendance has not been marked for the
                                                selected filters. Click{" "}
                                                <Link
                                                    to="/attendance-management/daily-attendance/create"
                                                    className="font-semibold text-[#FFD963] hover:underline"
                                                >
                                                    Mark Attendance
                                                </Link>{" "}
                                                to record attendance for today.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                sessions.map((s, i) => (
                                    <tr
                                        key={s.id}
                                        className={`border-b border-gray-100 hover:bg-[#faf8f4]/70 transition-colors ${
                                            i % 2 ? "bg-white" : "bg-gray-50/60"
                                        }`}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#610e1e] to-[#8a1a2e] rounded-lg flex items-center justify-center text-[#FFD963] font-bold shadow">
                                                    {s.class_name
                                                        ? s.class_name
                                                              .toString()
                                                              .slice(0, 2)
                                                        : "—"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#2b2b2b]">
                                                        Class {s.class_name || "—"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Section:{" "}
                                                        <span className="font-semibold text-[#610e1e]">
                                                            {s.section_name || "—"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {s.academic_year || "—"}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-[#2b2b2b]">
                                            {s.total_students}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-green-600">
                                            {s.present}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-red-600">
                                            {s.absent}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-yellow-600">
                                            {s.late}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-purple-600">
                                            {s.half_day}
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-blue-600">
                                            {s.on_leave}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    Number(s.attendance_percent) >=
                                                    90
                                                        ? "bg-green-100 text-green-700"
                                                        : Number(
                                                              s.attendance_percent
                                                          ) >= 75
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {s.attendance_percent}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {s.is_locked ? (
                                                <span
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700"
                                                    title="Locked"
                                                >
                                                    <FaLock /> Locked
                                                </span>
                                            ) : (
                                                <span
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"
                                                    title="Open"
                                                >
                                                    <FaUnlock /> Open
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/attendance-management/daily-attendance/show/${s.id}`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                                                    title="View details"
                                                >
                                                    <FaEye /> View
                                                </button>
                                                {!s.is_locked && (
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/attendance-management/daily-attendance/edit/${s.id}`
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFD963]/20 text-[#610e1e] text-xs font-semibold hover:bg-[#FFD963]/40 transition"
                                                        title="Edit attendance"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Card */}
            {/* <div className="bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <FaCalendarCheck className="text-2xl text-[#FFD963]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Quick Start</h3>
                        <p className="text-white/80 text-sm mt-1">
                            Use the date picker and filters above to view date-wise
                            attendance across classes & sections.
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
