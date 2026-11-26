import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaEye,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaBook,
} from "react-icons/fa";

import courseApi from "../../../services/courseApi";


export default function Index() {

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

        loadCourses();

    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await courseApi.getAll();

            console.log("Courses Response:", response);

            const data =
                response?.data?.data ??
                response?.data ??
                [];

            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Courses Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load courses."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Search Courses
    |--------------------------------------------------------------------------
    */

    const filteredCourses = courses.filter((course) => {

        const searchText =
            search
                .toLowerCase()
                .trim();

        if (!searchText) {
            return true;
        }

        return (

            String(course.title || "")
                .toLowerCase()
                .includes(searchText)

            ||

            String(course.subtitle || "")
                .toLowerCase()
                .includes(searchText)

            ||

            String(course.slug || "")
                .toLowerCase()
                .includes(searchText)

        );

    });


    /*
    |--------------------------------------------------------------------------
    | Delete Course
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await courseApi.delete(id);

            loadCourses();

        }
        catch (error) {

            console.error(
                "Delete Course Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete course."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Course Status
    |--------------------------------------------------------------------------
    */

    const handleToggleStatus = async (id) => {

        try {

            await courseApi.toggleStatus(id);

            loadCourses();

        }
        catch (error) {

            console.error(
                "Toggle Status Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update course status."
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
                    ></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading courses...
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

                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-[#610e1e]
                            flex
                            items-center
                            justify-center
                            shadow-sm
                        "
                    >
                        <FaBook className="text-[#FFD963] text-xl" />
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Courses
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage courses used for fee structures
                        </p>

                    </div>

                </div>


                {/* Add Course */}

                <Link
                    to="/fees/courses/create"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        bg-[#610e1e]
                        text-white
                        px-5
                        py-3
                        rounded-lg
                        font-semibold
                        hover:bg-[#4d0b18]
                        transition
                        shadow-sm
                    "
                >
                    <FaPlus />

                    Add Course
                </Link>

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
                                setSearch(e.target.value)
                            }
                            placeholder="Search courses..."
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

                        Showing{" "}
                        <span className="font-semibold text-gray-800">
                            {filteredCourses.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-800">
                            {courses.length}
                        </span>{" "}
                        courses

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

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    #
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Course
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Subtitle
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-center
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Order
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-center
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Status
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-center
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {filteredCourses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            px-6
                                            py-14
                                            text-center
                                        "
                                    >

                                        <div className="flex flex-col items-center">

                                            <div
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    bg-gray-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                    mb-3
                                                "
                                            >
                                                <FaBook className="text-gray-400 text-xl" />
                                            </div>

                                            <p className="font-semibold text-gray-700">
                                                No courses found
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Try changing your search or add a new course.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCourses.map(
                                    (course, index) => (

                                        <tr
                                            key={course.id}
                                            className="
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* Serial Number */}

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

                                                {course.is_active ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            bg-green-100
                                                            text-green-700
                                                        "
                                                    >
                                                        Active
                                                    </span>

                                                ) : (

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

                                                )}

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


                                                    {/* Toggle Status */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                course.id
                                                            )
                                                        }
                                                        title={
                                                            course.is_active
                                                                ? "Deactivate Course"
                                                                : "Activate Course"
                                                        }
                                                        className={`
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            transition
                                                            ${
                                                                course.is_active
                                                                    ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-600 hover:text-white"
                                                            }
                                                        `}
                                                    >

                                                        {course.is_active ? (
                                                            <FaToggleOn />
                                                        ) : (
                                                            <FaToggleOff />
                                                        )}

                                                    </button>


                                                    {/* Delete */}

                                                    {/* <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                course.id
                                                            )
                                                        }
                                                        title="Delete Course"
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            bg-red-50
                                                            text-red-600
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-red-600
                                                            hover:text-white
                                                            transition
                                                        "
                                                    >
                                                        <FaTrash />
                                                    </button> */}

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