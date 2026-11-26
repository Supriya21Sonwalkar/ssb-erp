import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getLectureAttendanceIndex,
    loadLectureStudents,
    storeLectureAttendance,
} from "../../../services/lectureAttendanceApi";

import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";
import subjectApi from "../../../services/subjectApi";

import LectureFilterCard from "../../../components/attendanceManagement/LectureAttendance/LectureFilterCard";
import LectureAttendanceTable from "../../../components/attendanceManagement/LectureAttendance/LectureAttendanceTable";
import LectureAttendanceActions from "../../../components/attendanceManagement/LectureAttendance/LectureAttendanceActions";

export default function Create() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [students, setStudents] = useState([]);

    const [filters, setFilters] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        subject_id: "",

        lecture_date: new Date()
            .toISOString()
            .split("T")[0],

        lecture_no: "",

    });


    /*
    |--------------------------------------------------------------------------
    | Initial Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchInitialData();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Fetch Sections When Class Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (filters.class_id) {

            fetchSectionsByClass(filters.class_id);

        } else {

            setSections([]);

        }

    }, [filters.class_id]);


    /*
    |--------------------------------------------------------------------------
    | Fetch Initial Data
    |--------------------------------------------------------------------------
    */

const fetchInitialData = async () => {

    try {

        setLoading(true);

        /*
        |--------------------------------------------------------------------------
        | Academic Years
        |--------------------------------------------------------------------------
        */

        const academicYearResponse = await academicYearApi.getAll();

        console.log(
            "FULL ACADEMIC YEAR RESPONSE:",
            JSON.stringify(academicYearResponse, null, 2)
        );

        console.log(
            "ACADEMIC YEAR DATA:",
            academicYearResponse?.data
        );

        const academicYearsData =
            academicYearResponse?.data?.data ??
            academicYearResponse?.data ??
            [];

        console.log(
            "FINAL ACADEMIC YEARS ARRAY:",
            academicYearsData
        );

        setAcademicYears(academicYearsData);

        /*
        |--------------------------------------------------------------------------
        | Classes
        |--------------------------------------------------------------------------
        */

        const classResponse =
            await classApi.getAll();

        console.log(
            "Classes Response:",
            classResponse
        );

        setClasses(
            classResponse.data?.data ??
            classResponse.data ??
            []
        );


        /*
        |--------------------------------------------------------------------------
        | Subjects
        |--------------------------------------------------------------------------
        */

        const subjectResponse =
            await subjectApi.getAll();

        console.log(
            "Subjects Response:",
            subjectResponse
        );

        setSubjects(
            subjectResponse?.data ??
            subjectResponse ??
            []
        );

    }
    catch (error) {

        console.error(
            "Error fetching lecture attendance initial data:",
            error
        );

    }
    finally {

        setLoading(false);

    }

};


    /*
    |--------------------------------------------------------------------------
    | Fetch Sections
    |--------------------------------------------------------------------------
    */

    const fetchSectionsByClass = async (classId) => {

        try {

            const response =
                await sectionApi.getByClass(classId);

            setSections(
                response.data?.data ??
                response.data ??
                []
            );

        } catch (error) {

            console.error(
                "Error fetching sections:",
                error
            );

            setSections([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Students
    |--------------------------------------------------------------------------
    */

    const handleLoadStudents = async () => {

        /*
        |----------------------------------------------------------------------
        | Basic Validation
        |----------------------------------------------------------------------
        */

        if (!filters.academic_year_id) {

            alert("Please select Academic Year.");

            return;

        }

        if (!filters.class_id) {

            alert("Please select Class.");

            return;

        }

        if (!filters.section_id) {

            alert("Please select Section.");

            return;

        }

        if (!filters.subject_id) {

            alert("Please select Subject.");

            return;

        }

        if (!filters.lecture_date) {

            alert("Please select Lecture Date.");

            return;

        }

        if (!filters.lecture_no) {

            alert("Please enter Lecture Number.");

            return;

        }


        try {

            setLoading(true);

            console.log(
                "Loading lecture students with filters:",
                filters
            );


            const payload = {

                academic_year_id:
                    Number(filters.academic_year_id),

                class_id:
                    Number(filters.class_id),

                section_id:
                    Number(filters.section_id),

                subject_id:
                    Number(filters.subject_id),

                lecture_date:
                    filters.lecture_date,

                lecture_no:
                    Number(filters.lecture_no),

            };


            console.log(
                "Lecture Students Payload:",
                payload
            );


            const response =
                await loadLectureStudents(payload);


            console.log(
                "Lecture Students Response:",
                response.data
            );


            setStudents(
                response.data?.students ?? []
            );


        } catch (error) {

            console.error(
                "Error loading lecture students:",
                error
            );


            console.log(
                "Status:",
                error.response?.status
            );


            console.log(
                "Backend Error:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ??
                "Unable to load students."
            );


            setStudents([]);

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Save Attendance
    |--------------------------------------------------------------------------
    */

    const handleSave = async () => {

        if (students.length === 0) {

            alert(
                "Please load students before saving attendance."
            );

            return;

        }


        /*
        |----------------------------------------------------------------------
        | Check Attendance Status
        |----------------------------------------------------------------------
        */

        const invalidStudent =
            students.find(
                (student) =>
                    !student.attendance_status
            );


        if (invalidStudent) {

            alert(
                "Please mark attendance for all students."
            );

            return;

        }


        try {

            setLoading(true);

            console.log(
                "Saving Lecture Attendance..."
            );


            const payload = {

                academic_year_id:
                    Number(filters.academic_year_id),

                class_id:
                    Number(filters.class_id),

                section_id:
                    Number(filters.section_id),

                subject_id:
                    Number(filters.subject_id),

                lecture_date:
                    filters.lecture_date,

                lecture_no:
                    Number(filters.lecture_no),

                students:
                    students.map((student) => ({

                        student_id:
                            student.student_id,

                        attendance_status:
                            student.attendance_status,

                        remarks:
                            student.remarks ?? null,

                    })),

            };


            console.log(
                "Lecture Attendance Payload:",
                payload
            );


            const response =
                await storeLectureAttendance(payload);


            console.log(
                "Save Response:",
                response.data
            );


            if (response.data?.status) {

                // Success - no alert

            }


        } catch (error) {

            console.error(
                "Error saving lecture attendance:",
                error
            );


            console.log(
                "Status:",
                error.response?.status
            );


            console.log(
                "Backend Error:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ??
                "Failed to save lecture attendance."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {

        setStudents([]);

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

return (

    <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

            <div>
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Mark Lecture Attendance
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Select the lecture details and mark student attendance.
                </p>
            </div>


            {/* Back Button */}

            <Link
                to="/attendance-management/lecture-attendance/index"
                className="
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-lg
                    border
                    border-[#610e1e]
                    text-[#610e1e]
                    font-semibold
                    hover:bg-[#610e1e]
                    hover:text-white
                    transition
                "
            >
                ← Back
            </Link>

        </div>


        {/* Filter Card */}

        <LectureFilterCard

                filters={filters}

                setFilters={setFilters}

                academicYears={academicYears}

                classes={classes}

                sections={sections}

                subjects={subjects}

                onLoadStudents={handleLoadStudents}

            />


            {/* Students */}

            {students.length > 0 && (

                <>

                    <LectureAttendanceTable

                        students={students}

                        setStudents={setStudents}

                    />


                    <LectureAttendanceActions

                        onSave={handleSave}

                        onReset={handleReset}

                        loading={loading}

                    />

                </>

            )}

        </div>

    );

}