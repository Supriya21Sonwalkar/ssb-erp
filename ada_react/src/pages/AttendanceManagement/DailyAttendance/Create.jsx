import { useEffect, useState, useRef, useCallback } from "react";
import { FaCheckDouble } from "react-icons/fa";

import {
    getAttendanceIndex,
    loadStudents,
    storeAttendance,
} from "../../../services/dailyAttendanceApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";

import FilterCard from "../../../components/attendanceManagement/DailyAttendance/FilterCard";
import AttendanceTable from "../../../components/attendanceManagement/DailyAttendance/AttendanceTable";
import AttendanceActions from "../../../components/attendanceManagement/DailyAttendance/AttendanceActions";

export default function Create() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);

    const [filters, setFilters] = useState({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        attendance_date: new Date().toISOString().split("T")[0],
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Auto-load students when filters change (debounced)
    |--------------------------------------------------------------------------
    */

    const autoLoadTimer = useRef(null);

    const handleLoadStudents = useCallback(async (showError = true) => {
        if (!filters.academic_year_id) {
            setStudents([]);
            return;
        }

        try {
            setLoading(true);
            setSuccessMessage("");
            if (showError) setErrorMessage("");

            const response = await loadStudents(filters);
            setStudents(response.data.students || []);

        } catch (error) {
            console.error(error);
            setStudents([]);
            if (showError) {
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Unable to load students.";
                setErrorMessage(message);
            }
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Debounced auto-load on filter change (only if academic year is selected)
    useEffect(() => {
        if (autoLoadTimer.current) {
            clearTimeout(autoLoadTimer.current);
        }

        if (!filters.academic_year_id) {
            setStudents([]);
            return;
        }

        autoLoadTimer.current = setTimeout(() => {
            handleLoadStudents(true);
        }, 300);

        return () => {
            if (autoLoadTimer.current) {
                clearTimeout(autoLoadTimer.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filters.academic_year_id,
        filters.class_id,
        filters.section_id,
        filters.attendance_date,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load Initial Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch sections when class is selected
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
            setAcademicYears(academicYearResponse.data?.data ?? academicYearResponse.data ?? []);

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

    /*
    |--------------------------------------------------------------------------
    | Mark All Present
    |--------------------------------------------------------------------------
    */

    const handleMarkAllPresent = () => {
        if (students.length === 0) return;
        const updated = students.map((s) => ({
            ...s,
            attendance_status: "P",
        }));
        setStudents(updated);
    };

    /*
    |--------------------------------------------------------------------------
    | Save Attendance
    |--------------------------------------------------------------------------
    */

    const handleSave = async () => {
        if (students.length === 0) {
            setErrorMessage("No students to save.");
            return;
        }
        try {
            setSaving(true);
            setErrorMessage("");
            setSuccessMessage("");

            await storeAttendance({
                ...filters,
                students,
            });

            setSuccessMessage("Attendance saved successfully.");
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to save attendance.";
            setErrorMessage(message);
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Form
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {
        setStudents([]);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const presentCount = students.filter(
        (s) => s.attendance_status === "P" || s.attendance_status === "Present"
    ).length;

    return (

        <div className="space-y-6">

            {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shrink-0">✕</div>
                    <p className="font-semibold text-sm">{errorMessage}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm shrink-0">✓</div>
                    <p className="font-semibold text-sm">{successMessage}</p>
                </div>
            )}

            <FilterCard
                filters={filters}
                setFilters={setFilters}
                academicYears={academicYears}
                classes={classes}
                sections={sections}
                onLoadStudents={() => handleLoadStudents(true)}
                loading={loading}
            />

            {

                students.length > 0 && (

                    <>

                        {/* Mark All Present Toolbar */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-bold text-gray-900">{students.length}</span> student{students.length !== 1 ? "s" : ""}
                                    {filters.class_id ? (
                                        <span className="ml-2 text-gray-500">
                                            · Class {filters.section_id ? `+ Section` : "(all sections)"}
                                        </span>
                                    ) : (
                                        <span className="ml-2 text-gray-500">
                                            · All classes
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold text-green-600">{presentCount}</span>
                                    <span className="mx-1">/</span>
                                    <span>{students.length}</span>
                                    <span className="ml-1">marked present</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleMarkAllPresent}
                                    disabled={saving || loading}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-2.5
                                        rounded-lg
                                        bg-green-600
                                        hover:bg-green-700
                                        disabled:bg-green-300
                                        disabled:cursor-not-allowed
                                        text-white
                                        font-semibold
                                        text-sm
                                        shadow-md
                                        shadow-green-200
                                        transition
                                    "
                                >
                                    <FaCheckDouble />
                                    Mark All Present
                                </button>
                            </div>
                        </div>

                        <AttendanceTable
                            students={students}
                            setStudents={setStudents}
                        />

                        <AttendanceActions

                            onSave={handleSave}

                            onReset={handleReset}

                            saving={saving}

                        />

                    </>

                )

            }

        </div>

    );

}