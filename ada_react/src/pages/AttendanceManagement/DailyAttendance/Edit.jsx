import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getAttendanceIndex,
    showAttendance,
    updateAttendance,
    lockAttendance,
    unlockAttendance,
    deactivateAttendance,
    loadStudents,
} from "../../../services/dailyAttendanceApi";

import FilterCard from "../../../components/attendanceManagement/DailyAttendance/FilterCard";
import AttendanceSummary from "../../../components/attendanceManagement/DailyAttendance/AttendanceSummary";
import AttendanceTable from "../../../components/attendanceManagement/DailyAttendance/AttendanceTable";
import AttendanceActions from "../../../components/attendanceManagement/DailyAttendance/AttendanceActions";

export default function Edit() {

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

    const [isLocked, setIsLocked] = useState(false);

    const [filters, setFilters] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        attendance_date: "",

    });

        /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadPage();

    }, []);

    const loadPage = async () => {

        try {

            setLoading(true);

            /*
            |--------------------------------------------------------------------------
            | Dropdowns
            |--------------------------------------------------------------------------
            */

            const indexResponse = await getAttendanceIndex();

            setAcademicYears(
                indexResponse.data.data.academic_years || []
            );

            setClasses(
                indexResponse.data.data.classes || []
            );

            /*
            |--------------------------------------------------------------------------
            | Replace this after Section API
            |--------------------------------------------------------------------------
            */

            setSections([]);

            /*
            |--------------------------------------------------------------------------
            | Attendance
            |--------------------------------------------------------------------------
            */

            const attendanceResponse = await showAttendance(id);

            const session = attendanceResponse.data.session;

            setFilters({

                academic_year_id: session.academic_year_id,

                class_id: session.class_id,

                section_id: session.section_id,

                attendance_date: session.attendance_date,

            });

            setStudents(
                attendanceResponse.data.students || []
            );

            setIsLocked(
                session.is_locked
            );

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    /*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
*/

const handleUpdate = async () => {

    try {

        setLoading(true);

        await updateAttendance(id, {

            ...filters,

            students,

        });

    }

    catch (error) {

        console.error(error);

        alert("Failed to update attendance.");

    }

    finally {

        setLoading(false);

    }

};

/*
|--------------------------------------------------------------------------
| Lock Attendance
|--------------------------------------------------------------------------
*/

const handleLock = async () => {

    try {

        setLoading(true);

        await lockAttendance(id);

        setIsLocked(true);

    }

    catch (error) {

        console.error(error);

        alert("Unable to lock attendance.");

    }

    finally {

        setLoading(false);

    }

};

/*
|--------------------------------------------------------------------------
| Unlock Attendance
|--------------------------------------------------------------------------
*/

const handleUnlock = async () => {

    try {

        setLoading(true);

        await unlockAttendance(id);

        setIsLocked(false);

    }

    catch (error) {

        console.error(error);

        alert("Unable to unlock attendance.");

    }

    finally {

        setLoading(false);

    }

};

/*
|--------------------------------------------------------------------------
| Deactivate Attendance
|--------------------------------------------------------------------------
*/

const handleDeactivate = async () => {

    if (!window.confirm("Are you sure you want to deactivate this attendance?")) {

        return;

    }

    try {

        setLoading(true);

        await deactivateAttendance(id);

    }

    catch (error) {

        console.error(error);

        alert("Unable to deactivate attendance.");

    }

    finally {

        setLoading(false);

    }

};

/*
|--------------------------------------------------------------------------
| Load Students
|--------------------------------------------------------------------------
*/

const handleLoadStudents = async () => {

    try {

        setLoading(true);

        const response = await loadStudents(filters);

        setStudents(response.data.students || []);

    }

    catch (error) {

        console.error(error);

        alert("Unable to load students.");

    }

    finally {

        setLoading(false);

    }

};

/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

const handleReset = () => {

    loadPage();

};

/*
|--------------------------------------------------------------------------
| Render
|--------------------------------------------------------------------------
*/

return (

    <div className="space-y-6">

        {/* Page Header */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <h1 className="text-2xl font-bold text-[#610e1e]">

                Edit Daily Attendance

            </h1>

            <p className="text-gray-500 mt-1">

                Update, Lock or Deactivate Attendance Session

            </p>

        </div>

        {/* Filters */}

        <FilterCard

            filters={filters}

            setFilters={setFilters}

            academicYears={academicYears}

            classes={classes}

            sections={sections}

            onLoadStudents={handleLoadStudents}

        />

        {/* Summary */}

        <AttendanceSummary

            students={students}

        />

        {/* Attendance Table */}

        <AttendanceTable

            students={students}

            setStudents={setStudents}

        />

        {/* Actions */}

        <AttendanceActions

            isEdit={true}

            isLocked={isLocked}

            onUpdate={handleUpdate}

            onLock={handleLock}

            onUnlock={handleUnlock}

            onDeactivate={handleDeactivate}

            onReset={handleReset}

        />

    </div>

);
}