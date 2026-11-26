import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaFileInvoiceDollar,
    FaCheckCircle,
    FaTimesCircle,
    FaBook,
    FaLayerGroup,
    FaCalendarAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

import feeStructureApi from "../../../services/feeStructureApi";


export default function View() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [structure, setStructure] = useState(null);

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Load Fee Structure
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadStructure();

    }, [id]);


    const loadStructure = async () => {

        try {

            setLoading(true);


            const response =
                await feeStructureApi.getById(id);


            console.log(
                "Fee Structure View Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data;


            if (!data) {

                throw new Error(
                    "Fee structure not found."
                );

            }


            setStructure(data);

        }
        catch (error) {

            console.error(
                "Fee Structure View Error:",
                error
            );


            console.error(
                "Backend:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                error.message ||
                "Unable to load fee structure."
            );


            navigate(
                "/fees/structure"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getComponentName = () => {

        return (
            structure?.fee_component?.name ||
            structure?.feeComponent?.name ||
            "-"
        );

    };


    const getComponentType = () => {

        return (
            structure?.fee_component?.component_type ||
            structure?.feeComponent?.component_type ||
            "-"
        );

    };


    const getCourseName = () => {

        return (
            structure?.course?.title ||
            "-"
        );

    };


    const getAcademicYear = () => {

        return (
            structure?.academic_year?.name ||
            structure?.academicYear?.name ||
            structure?.academic_year?.title ||
            structure?.academicYear?.title ||
            structure?.academic_year_id ||
            "-"
        );

    };


    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        );

    };


    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div
                className="
                    min-h-[400px]
                    flex
                    items-center
                    justify-center
                "
            >

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

                    <p
                        className="
                            mt-4
                            text-gray-600
                            font-medium
                        "
                    >
                        Loading fee structure...
                    </p>

                </div>

            </div>

        );

    }


    if (!structure) {

        return (

            <div className="p-6 text-center">

                <p className="text-gray-500">
                    Fee structure not found.
                </p>

            </div>

        );

    }


    return (

        <div
            className="
                max-w-5xl
                mx-auto
                space-y-6
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/fees/structure"
                            )
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
                            shadow-md
                        "
                    >

                        <FaFileInvoiceDollar
                            className="
                                text-[#FFD963]
                                text-xl
                            "
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-[#610e1e]
                            "
                        >
                            Fee Structure Details
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            View fee structure information
                        </p>

                    </div>

                </div>


                {/* Edit */}

                <Link
                    to={`/fees/structure/${structure.id}/edit`}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        rounded-lg
                        bg-[#610e1e]
                        text-white
                        font-semibold
                        hover:bg-[#4d0b18]
                        transition
                        shadow-sm
                    "
                >

                    <FaEdit />

                    Edit Structure

                </Link>

            </div>


            {/* =====================================================
                STRUCTURE TITLE CARD
            ===================================================== */}

            <div
                className="
                    bg-gradient-to-r
                    from-[#610e1e]
                    to-[#8a1a2e]
                    rounded-xl
                    shadow-lg
                    p-6
                    text-white
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5
                    "
                >

                    <div>

                        <p
                            className="
                                text-[#FFD963]
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                            "
                        >
                            Fee Structure
                        </p>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mt-2
                            "
                        >
                            {structure.name || "-"}
                        </h2>

                    </div>


                    <div
                        className="
                            bg-white/10
                            border
                            border-white/20
                            rounded-xl
                            px-6
                            py-4
                            text-right
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-white/70
                                uppercase
                            "
                        >
                            Total Fee
                        </p>

                        <p
                            className="
                                text-2xl
                                font-bold
                                text-[#FFD963]
                                mt-1
                            "
                        >
                            {formatAmount(
                                structure.total_amount
                            )}
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}

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
                        px-6
                        py-5
                        border-b
                        border-gray-200
                        bg-gray-50
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        Structure Information
                    </h2>

                </div>


                <div
                    className="
                        p-6
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    "
                >

                    {/* Component */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                            p-4
                            rounded-xl
                            bg-gray-50
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-lg
                                bg-blue-100
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <FaLayerGroup />

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    uppercase
                                    font-semibold
                                "
                            >
                                Fee Component
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-gray-800
                                    mt-1
                                "
                            >
                                {getComponentName()}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Type: {getComponentType()}
                            </p>

                        </div>

                    </div>


                    {/* Course */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                            p-4
                            rounded-xl
                            bg-gray-50
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-lg
                                bg-purple-100
                                text-purple-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <FaBook />

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    uppercase
                                    font-semibold
                                "
                            >
                                Course
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-gray-800
                                    mt-1
                                "
                            >
                                {getCourseName()}
                            </p>

                            {!structure.course_id && (

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    "
                                >
                                    Not applicable
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Academic Year */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                            p-4
                            rounded-xl
                            bg-gray-50
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-lg
                                bg-green-100
                                text-green-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <FaCalendarAlt />

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    uppercase
                                    font-semibold
                                "
                            >
                                Academic Year
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-gray-800
                                    mt-1
                                "
                            >
                                {getAcademicYear()}
                            </p>

                        </div>

                    </div>


                    {/* Amount */}

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                            p-4
                            rounded-xl
                            bg-gray-50
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-lg
                                bg-yellow-100
                                text-yellow-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <FaMoneyBillWave />

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    uppercase
                                    font-semibold
                                "
                            >
                                Total Amount
                            </p>

                            <p
                                className="
                                    text-lg
                                    font-bold
                                    text-[#610e1e]
                                    mt-1
                                "
                            >
                                {formatAmount(
                                    structure.total_amount
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                EFFECTIVE PERIOD
            ===================================================== */}

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
                        px-6
                        py-5
                        border-b
                        border-gray-200
                        bg-gray-50
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        Validity & Status
                    </h2>

                </div>


                <div
                    className="
                        p-6
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-6
                    "
                >

                    {/* From */}

                    <div>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                uppercase
                                font-semibold
                            "
                        >
                            Effective From
                        </p>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-gray-800
                                mt-2
                            "
                        >
                            {formatDate(
                                structure.effective_from
                            )}
                        </p>

                    </div>


                    {/* To */}

                    <div>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                uppercase
                                font-semibold
                            "
                        >
                            Effective To
                        </p>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-gray-800
                                mt-2
                            "
                        >
                            {formatDate(
                                structure.effective_to
                            )}
                        </p>

                    </div>


                    {/* Status */}

                    <div>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                uppercase
                                font-semibold
                            "
                        >
                            Status
                        </p>


                        <div className="mt-2">

                            {structure.status ? (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-green-50
                                        text-green-700
                                        text-sm
                                        font-semibold
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
                                        px-3
                                        py-1.5
                                        rounded-full
                                        bg-red-50
                                        text-red-600
                                        text-sm
                                        font-semibold
                                    "
                                >

                                    <FaTimesCircle />

                                    Inactive

                                </span>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                REMARKS
            ===================================================== */}

            {structure.remarks && (

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
                            px-6
                            py-5
                            border-b
                            border-gray-200
                            bg-gray-50
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-gray-800
                            "
                        >
                            Remarks
                        </h2>

                    </div>


                    <div className="p-6">

                        <p
                            className="
                                text-sm
                                text-gray-700
                                whitespace-pre-wrap
                            "
                        >
                            {structure.remarks}
                        </p>

                    </div>

                </div>

            )}


            {/* =====================================================
                BACK BUTTON
            ===================================================== */}

            <div
                className="
                    flex
                    justify-end
                    gap-3
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/fees/structure"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-lg
                        border
                        border-gray-300
                        text-gray-700
                        font-semibold
                        hover:bg-gray-50
                        transition
                    "
                >

                    <FaArrowLeft />

                    Back to Fee Structures

                </button>

            </div>

        </div>

    );

}