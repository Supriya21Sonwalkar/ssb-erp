import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaSearch, FaSyncAlt, FaPlus } from "react-icons/fa";

import lectureAttendanceApi from "../../../services/lectureAttendanceApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";
import subjectApi from "../../../services/subjectApi";

export default function Index() {

    const [loading, setLoading] = useState(false);

    const [records, setRecords] = useState([]);

    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [filters, setFilters] = useState({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        subject_id: "",
        lecture_date: "",
    });


    /*
    |--------------------------------------------------------------------------
    | Load Master Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadMasterData();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Load Sections When Class Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (filters.class_id) {

            loadSections(filters.class_id);

        } else {

            setSections([]);

        }

    }, [filters.class_id]);


    /*
    |--------------------------------------------------------------------------
    | Load Initial Data
    |--------------------------------------------------------------------------
    */

    const loadMasterData = async () => {

        try {

            setLoading(true);

            const [
                academicYearResponse,
                classResponse,
                subjectResponse,
            ] = await Promise.all([

                academicYearApi.getAll(),

                classApi.getAll(),

                subjectApi.getAll(),

            ]);


            /*
            |----------------------------------------------------------------------
            | Academic Years
            |----------------------------------------------------------------------
            */

            console.log(
                "Academic Year Response:",
                academicYearResponse
            );

            const academicYearData =
                academicYearResponse.data?.data ??
                academicYearResponse.data ??
                [];

            setAcademicYears(academicYearData);


            /*
            |----------------------------------------------------------------------
            | Classes
            |----------------------------------------------------------------------
            */

            console.log(
                "Class Response:",
                classResponse
            );

            const classData =
                classResponse.data?.data ??
                classResponse.data ??
                [];

            setClasses(classData);


            /*
            |----------------------------------------------------------------------
            | Subjects
            |----------------------------------------------------------------------
            */

            console.log(
                "Subject Response:",
                subjectResponse
            );

            const subjectData =
                subjectResponse.data?.data ??
                subjectResponse.data ??
                [];

            setSubjects(subjectData);


            /*
            |----------------------------------------------------------------------
            | Load Attendance Records
            |----------------------------------------------------------------------
            */

            await loadRecords();

        }
        catch (error) {

            console.error(
                "Error loading master data:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Sections
    |--------------------------------------------------------------------------
    */

    const loadSections = async (classId) => {

        try {

            const response =
                await sectionApi.getByClass(classId);

            console.log(
                "Sections Response:",
                response
            );

            const sectionData =
                response.data?.data ??
                response.data ??
                [];

            setSections(sectionData);

        }
        catch (error) {

            console.error(
                "Error loading sections:",
                error
            );

            setSections([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Lecture Attendance Records
    |--------------------------------------------------------------------------
    */

    const loadRecords = async () => {

        try {

            setLoading(true);

            console.log(
                "Loading lecture attendance records:",
                filters
            );


            const response =
                await lectureAttendanceApi.getAll(filters);


            console.log(
                "Lecture Attendance Response:",
                response
            );


            const data =
                response.data?.data ??
                response.data ??
                [];


            setRecords(data);

        }
        catch (error) {

            console.error(
                "Error loading lecture attendance:",
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

            setRecords([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Filter
    |--------------------------------------------------------------------------
    */

    const handleSearch = () => {

        loadRecords();

    };


    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {

        setFilters({
            academic_year_id: "",
            class_id: "",
            section_id: "",
            subject_id: "",
            lecture_date: "",
        });

    };


    return (

        <div className="space-y-6">


            {/* -----------------------------------------------------------------
                Header
            ----------------------------------------------------------------- */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">

                        Lecture Attendance Records

                    </h1>

                    <p className="text-sm text-gray-500 mt-1">

                        View marked lecture-wise student attendance.

                    </p>

                </div>


                <div className="flex items-center gap-3">

    {/* Mark Attendance */}
    <Link
        to="/attendance-management/lecture-attendance"
        className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-2.5
            rounded-lg
            bg-[#610e1e]
            hover:bg-[#4b0b18]
            text-white
            font-semibold
            transition
            shadow-sm
        "
    >
        <FaPlus />

        Mark Attendance
    </Link>


    {/* Refresh */}
    <button
        type="button"
        onClick={loadRecords}
        disabled={loading}
        className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            border
            border-[#610e1e]
            text-[#610e1e]
            hover:bg-[#610e1e]
            hover:text-white
            font-semibold
            transition
            disabled:opacity-50
        "
    >
        <FaSyncAlt
            className={loading ? "animate-spin" : ""}
        />

        Refresh
    </button>

</div>

            </div>


            {/* -----------------------------------------------------------------
                Filters
            ----------------------------------------------------------------- */}

            <div className="bg-white rounded-xl shadow-sm border p-5">

                <h2 className="text-lg font-semibold text-[#610e1e] mb-4">

                    Search / Filter

                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">


                    {/* Academic Year */}

                    <div>

                        <label className="block text-sm font-semibold mb-2">

                            Academic Year

                        </label>

                        <select
                            value={filters.academic_year_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    academic_year_id:
                                        e.target.value,
                                })
                            }
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        >

                            <option value="">

                                All Academic Years

                            </option>

                            {academicYears.map((year) => (

                                <option
                                    key={year.id}
                                    value={year.id}
                                >

                                    {year.academic_year}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Class */}

                    <div>

                        <label className="block text-sm font-semibold mb-2">

                            Class

                        </label>

                        <select
                            value={filters.class_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    class_id:
                                        e.target.value,
                                    section_id: "",
                                })
                            }
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        >

                            <option value="">

                                All Classes

                            </option>

                            {classes.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.class_name}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Section */}

                    <div>

                        <label className="block text-sm font-semibold mb-2">

                            Section

                        </label>

                        <select
                            value={filters.section_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    section_id:
                                        e.target.value,
                                })
                            }
                            disabled={!filters.class_id}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e] disabled:bg-gray-100"
                        >

                            <option value="">

                                All Sections

                            </option>

                            {sections.map((section) => (

                                <option
                                    key={section.id}
                                    value={section.id}
                                >

                                    {section.section_name}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Subject */}

                    <div>

                        <label className="block text-sm font-semibold mb-2">

                            Subject

                        </label>

                        <select
                            value={filters.subject_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    subject_id:
                                        e.target.value,
                                })
                            }
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        >

                            <option value="">

                                All Subjects

                            </option>

                            {subjects.map((subject) => (

                                <option
                                    key={subject.id}
                                    value={subject.id}
                                >

                                    {subject.subject_name ||
                                        subject.name}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Date */}

                    <div>

                        <label className="block text-sm font-semibold mb-2">

                            Lecture Date

                        </label>

                        <input
                            type="date"
                            value={filters.lecture_date}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    lecture_date:
                                        e.target.value,
                                })
                            }
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        />

                    </div>

                </div>


                {/* Filter Buttons */}

                <div className="flex justify-end gap-3 mt-5">

                    <button
                        type="button"
                        onClick={handleReset}
                        className="
                            px-5
                            py-2.5
                            rounded-lg
                            border
                            border-gray-300
                            text-gray-700
                            hover:bg-gray-50
                            font-semibold
                        "
                    >

                        Reset

                    </button>


                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={loading}
                        className="
                            px-5
                            py-2.5
                            rounded-lg
                            bg-[#610e1e]
                            hover:bg-[#4b0b18]
                            text-white
                            font-semibold
                            flex
                            items-center
                            gap-2
                            disabled:opacity-50
                        "
                    >

                        <FaSearch />

                        Search

                    </button>

                </div>

            </div>


            {/* -----------------------------------------------------------------
                Table
            ----------------------------------------------------------------- */}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="px-5 py-4 border-b">

                    <h2 className="text-lg font-semibold text-[#610e1e]">

                        Marked Lecture Attendance

                    </h2>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-[#610e1e] text-white">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Date
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Lecture
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Academic Year
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Class
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Section
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Subject
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Total
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Present
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Absent
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >

                                        Loading attendance records...

                                    </td>

                                </tr>

                            ) : records.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >

                                        No lecture attendance records found.

                                    </td>

                                </tr>

                            ) : (

                                records.map((record, index) => (

                                    <tr
                                        key={record.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-3">

                                            {index + 1}

                                        </td>


                                        <td className="px-4 py-3">

                                            {record.lecture_date
                                                ? new Date(
                                                    record.lecture_date
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"
                                            }

                                        </td>


                                        <td className="px-4 py-3 font-semibold">

                                            Lecture {record.lecture_no}

                                        </td>


                                        <td className="px-4 py-3">

                                            {record.academic_year ||
                                                "-"}

                                        </td>


                                        <td className="px-4 py-3">

                                            {record.class_name ||
                                                "-"}

                                        </td>


                                        <td className="px-4 py-3">

                                            {record.section_name ||
                                                "-"}

                                        </td>


                                        <td className="px-4 py-3">

                                            {record.subject_name ||
                                                "-"}

                                        </td>


                                        <td className="px-4 py-3 text-center font-semibold">

                                            {record.total_students ?? 0}

                                        </td>


                                        <td className="px-4 py-3 text-center">

                                            <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">

                                                {record.present_count ?? 0}

                                            </span>

                                        </td>


                                        <td className="px-4 py-3 text-center">

                                            <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">

                                                {record.absent_count ?? 0}

                                            </span>

                                        </td>


                                        <td className="px-4 py-3 text-center">

                                            <button
                                                type="button"
                                                title="View Attendance"
                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    w-9
                                                    h-9
                                                    rounded-lg
                                                    bg-[#610e1e]
                                                    text-white
                                                    hover:bg-[#4b0b18]
                                                    transition
                                                "
                                                onClick={() => {
                                                    console.log(
                                                        "View lecture:",
                                                        record
                                                    );
                                                }}
                                            >

                                                <FaEye />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}