import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaArrowLeft,
    FaSearch,
    FaEye,
    FaEdit,
    FaToggleOff,
    FaBook,
} from "react-icons/fa";

import courseApi from "../../../services/courseApi";


export default function Inactive() {

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Courses
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadInactiveCourses();

    }, []);


    const loadInactiveCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await courseApi.getAll();

            console.log(
                "Inactive Courses Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                const inactiveCourses =
                    data.filter(
                        (course) =>
                            !Boolean(course.is_active)
                    );

                setCourses(
                    inactiveCourses
                );

            }
            else {

                setCourses([]);

            }

        }
        catch (error) {

            console.error(
                "Inactive Courses Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load inactive courses."
            );

            setCourses([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredCourses =
        courses.filter((course) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();

            if (!searchText) {
                return true;
            }

            return (

                String(
                    course.title || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    course.subtitle || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    course.slug || ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /*
    |--------------------------------------------------------------------------
    | Activate Course
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (id) => {

        try {

            await courseApi.toggleStatus(id);

            loadInactiveCourses();

        }
        catch (error) {

            console.error(
                "Activate Course Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to activate course."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="min-h-[400px] flex items-center justify-center">

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            border-4
                            border-[#610e1e]
                            border-t-transparent
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading inactive courses...
                    </p>

                </div>

            </div>
        );

    }


    return (
        <div className="space-y-6">


            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                    <Link
                        to="/fees/courses"
                        className="
                            w-10
                            h-10
                            rounded-lg
                            bg-white
                            border
                            border-gray-200
                            flex
                            items-center
                            justify-center
                            text-[#610e1e]
                            hover:bg-[#610e1e]
                            hover:text-white
                            transition
                        "
                        title="Back to Courses"
                    >
                        <FaArrowLeft />
                    </Link>


                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-gray-600
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <FaBook className="text-white text-xl" />
                    </div>


                    <div>

                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Inactive Courses
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage courses that are currently inactive
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================================
                ERROR
            ========================================================= */}

            {error && (

                <div
                    className="
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        px-4
                        py-3
                        rounded-lg
                    "
                >
                    {error}
                </div>

            )}


            {/* =========================================================
                SEARCH
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-sm
                    border
                    border-gray-200
                    p-4
                "
            >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="relative w-full md:max-w-md">

                        <FaSearch
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search inactive courses..."
                            className="
                                w-full
                                pl-11
                                pr-4
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            "
                        />

                    </div>


                    <div className="text-sm text-gray-500">

                        Found{" "}

                        <span className="font-semibold text-gray-800">
                            {filteredCourses.length}
                        </span>

                        {" "}inactive course(s)

                    </div>

                </div>

            </div>


            {/* =========================================================
                TABLE
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-sm
                    border
                    border-gray-200
                    overflow-hidden
                "
            >

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Course
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Subtitle
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                                    Order
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {filteredCourses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-6 py-14 text-center"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    bg-green-50
                                                    flex
                                                    items-center
                                                    justify-center
                                                    mb-3
                                                "
                                            >
                                                <FaBook className="text-green-500 text-xl" />
                                            </div>

                                            <p className="font-semibold text-gray-700">
                                                No inactive courses
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                All courses are currently active.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCourses.map(
                                    (course, index) => (

                                        <tr
                                            key={course.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            {/* Number */}

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {index + 1}
                                            </td>


                                            {/* Course */}

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-gray-800">
                                                    {course.title || "-"}
                                                </div>

                                                {course.slug && (

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {course.slug}
                                                    </div>

                                                )}

                                            </td>


                                            {/* Subtitle */}

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {course.subtitle || "-"}
                                            </td>


                                            {/* Order */}

                                            <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                {course.order_number ?? 0}
                                            </td>


                                            {/* Status */}

                                            <td className="px-6 py-4 text-center">

                                                <span
                                                    className="
                                                        inline-flex
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        bg-gray-100
                                                        text-gray-600
                                                    "
                                                >
                                                    Inactive
                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center justify-center gap-2">


                                                    {/* View */}

                                                    <Link
                                                        to={`/fees/courses/${course.id}`}
                                                        title="View Course"
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            bg-blue-50
                                                            text-blue-600
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-blue-600
                                                            hover:text-white
                                                            transition
                                                        "
                                                    >
                                                        <FaEye />
                                                    </Link>


                                                    {/* Edit */}

                                                    <Link
                                                        to={`/fees/courses/${course.id}/edit`}
                                                        title="Edit Course"
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            bg-yellow-50
                                                            text-yellow-600
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-yellow-500
                                                            hover:text-white
                                                            transition
                                                        "
                                                    >
                                                        <FaEdit />
                                                    </Link>


                                                    {/* Activate */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleActivate(
                                                                course.id
                                                            )
                                                        }
                                                        title="Activate Course"
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            bg-green-50
                                                            text-green-600
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-green-600
                                                            hover:text-white
                                                            transition
                                                        "
                                                    >
                                                        <FaToggleOff />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}