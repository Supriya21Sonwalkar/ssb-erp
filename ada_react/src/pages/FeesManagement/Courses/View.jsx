import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaBook,
    FaCheckCircle,
    FaTimesCircle,
    FaListUl,
    FaInfoCircle,
} from "react-icons/fa";

import courseApi from "../../../services/courseApi";


export default function View() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Course
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (id) {
            loadCourse();
        }

    }, [id]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await courseApi.getById(id);

            console.log(
                "Course Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data;

            if (!data) {

                setError(
                    "Course not found."
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Normalize Features
            |--------------------------------------------------------------------------
            */

            let features =
                data.features ?? [];


            if (typeof features === "string") {

                try {

                    features =
                        JSON.parse(features);

                }
                catch {

                    features = [];

                }

            }


            if (!Array.isArray(features)) {
                features = [];
            }


            setCourse({
                ...data,
                features,
            });

        }
        catch (error) {

            console.error(
                "View Course Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load course."
            );

        }
        finally {

            setLoading(false);

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
                        Loading course...
                    </p>

                </div>

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error || !course) {

        return (
            <div className="max-w-5xl mx-auto">

                <div
                    className="
                        bg-white
                        rounded-xl
                        border
                        border-gray-200
                        shadow-sm
                        p-10
                        text-center
                    "
                >

                    <div
                        className="
                            w-16
                            h-16
                            mx-auto
                            rounded-full
                            bg-red-50
                            flex
                            items-center
                            justify-center
                            mb-4
                        "
                    >
                        <FaInfoCircle className="text-red-500 text-2xl" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">
                        Course Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {error || "The requested course could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/fees/courses")
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            bg-[#610e1e]
                            text-white
                            rounded-lg
                            font-semibold
                            hover:bg-[#4d0b18]
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Back to Courses
                    </button>

                </div>

            </div>
        );

    }


    return (
        <div className="max-w-5xl mx-auto space-y-6">


            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/fees/courses")
                        }
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
                    >
                        <FaArrowLeft />
                    </button>


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
                            Course Details
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            View complete course information
                        </p>

                    </div>

                </div>


                {/* Edit */}

                <Link
                    to={`/fees/courses/${course.id}/edit`}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        bg-[#610e1e]
                        text-white
                        rounded-lg
                        font-semibold
                        hover:bg-[#4d0b18]
                        transition
                    "
                >
                    <FaEdit />
                    Edit Course
                </Link>

            </div>


            {/* =========================================================
                COURSE HEADER CARD
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    overflow-hidden
                "
            >

                <div
                    className="
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                        px-6
                        py-8
                    "
                >

                    <div className="flex flex-col md:flex-row md:items-center gap-5">

                        {/* Icon */}

                        <div
                            className="
                                w-20
                                h-20
                                rounded-2xl
                                bg-white/10
                                border
                                border-white/20
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaBook
                                className="
                                    text-[#FFD963]
                                    text-3xl
                                "
                            />

                        </div>


                        <div className="flex-1">

                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                {course.title || "-"}
                            </h2>

                            {course.subtitle && (

                                <p className="text-white/80 mt-2">
                                    {course.subtitle}
                                </p>

                            )}

                        </div>


                        {/* Status */}

                        <div>

                            {course.is_active ? (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-green-100
                                        text-green-700
                                        text-sm
                                        font-bold
                                    "
                                >
                                    <FaCheckCircle />
                                    Active
                                </span>

                            ) : (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-gray-100
                                        text-gray-600
                                        text-sm
                                        font-bold
                                    "
                                >
                                    <FaTimesCircle />
                                    Inactive
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    BASIC DETAILS
                ===================================================== */}

                <div className="p-6">

                    <h3 className="text-lg font-bold text-gray-800 mb-5">
                        Course Information
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* Slug */}

                        <div>

                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Slug
                            </p>

                            <p className="text-gray-800 font-medium">
                                {course.slug || "-"}
                            </p>

                        </div>


                        {/* Order */}

                        <div>

                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Display Order
                            </p>

                            <p className="text-gray-800 font-medium">
                                {course.order_number ?? 0}
                            </p>

                        </div>


                        {/* Icon */}

                        <div>

                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Icon Class
                            </p>

                            <p className="text-gray-800 font-medium">
                                {course.icon_class || "-"}
                            </p>

                        </div>


                        {/* Status */}

                        <div>

                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Status
                            </p>

                            <p className="text-gray-800 font-medium">
                                {course.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================================
                DESCRIPTION
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-6
                "
            >

                <div className="flex items-center gap-3 mb-4">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-lg
                            bg-[#610e1e]/10
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <FaInfoCircle className="text-[#610e1e]" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Description
                    </h3>

                </div>


                <p className="text-gray-600 leading-relaxed whitespace-pre-line">

                    {course.description ||
                        "No description available."}

                </p>

            </div>


            {/* =========================================================
                FEATURES
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-6
                "
            >

                <div className="flex items-center gap-3 mb-5">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-lg
                            bg-[#610e1e]/10
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <FaListUl className="text-[#610e1e]" />
                    </div>

                    <div>

                        <h3 className="text-lg font-bold text-gray-800">
                            Course Features
                        </h3>

                        <p className="text-sm text-gray-500">
                            Features included in this course
                        </p>

                    </div>

                </div>


                {course.features &&
                course.features.length > 0 ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        {course.features.map(
                            (feature, index) => (

                                <div
                                    key={index}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        bg-gray-50
                                        border
                                        border-gray-200
                                        rounded-lg
                                        px-4
                                        py-3
                                    "
                                >

                                    <FaCheckCircle
                                        className="
                                            text-green-500
                                            flex-shrink-0
                                        "
                                    />

                                    <span className="text-gray-700">
                                        {feature}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div
                        className="
                            py-8
                            text-center
                            text-gray-500
                            bg-gray-50
                            rounded-lg
                        "
                    >
                        No features added for this course.
                    </div>

                )}

            </div>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <div className="flex justify-start">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/fees/courses")
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        bg-white
                        border
                        border-gray-300
                        text-gray-700
                        rounded-lg
                        font-semibold
                        hover:bg-gray-50
                        transition
                    "
                >
                    <FaArrowLeft />
                    Back to Courses
                </button>

            </div>

        </div>
    );
}