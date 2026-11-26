import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getAttendanceIndex,
    showAttendance,
} from "../../../services/dailyAttendanceApi";

import FilterCard from "../../../components/attendanceManagement/DailyAttendance/FilterCard";
import AttendanceSummary from "../../../components/attendanceManagement/DailyAttendance/AttendanceSummary";
import AttendanceTable from "../../../components/attendanceManagement/DailyAttendance/AttendanceTable";

export default function Show() {

    const { id } = useParams();

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [students, setStudents] = useState([]);

    const [filters, setFilters] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        attendance_date: "",

    });

    const [session, setSession] = useState(null);

        /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAttendance();

    }, []);

    const loadAttendance = async () => {

        try {

            setLoading(true);

            const indexResponse = await getAttendanceIndex();

            setAcademicYears(
                indexResponse.data.data.academic_years || []
            );

            setClasses(
                indexResponse.data.data.classes || []
            );

            const response = await showAttendance(id);

            const attendanceSession = response.data.session;

            setSession(attendanceSession);

            setFilters({

                academic_year_id: attendanceSession.academic_year_id,

                class_id: attendanceSession.class_id,

                section_id: attendanceSession.section_id,

                attendance_date: attendanceSession.attendance_date,

            });

            setStudents(response.data.students || []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

        return (

        <div className="space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

                <h1 className="text-2xl font-bold text-[#610e1e]">

                    View Daily Attendance

                </h1>

                <p className="text-gray-500 mt-1">

                    Attendance details (Read Only)

                </p>

            </div>

            {/* Filters */}

            <FilterCard

                filters={filters}

                setFilters={() => {}}

                academicYears={academicYears}

                classes={classes}

                sections={sections}

                onLoadStudents={() => {}}

                readOnly={true}

            />

            {/* Summary */}

            <AttendanceSummary

                students={students}

            />

            {/* Attendance Table */}

            <AttendanceTable

                students={students}

                setStudents={() => {}}

                readOnly={true}

            />

        </div>

    );

}