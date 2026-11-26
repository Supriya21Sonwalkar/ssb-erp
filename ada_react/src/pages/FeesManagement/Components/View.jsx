import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaMoneyBillWave,
} from "react-icons/fa";

import feeComponentApi from "../../../services/feeComponentApi";


export default function View() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [component, setComponent] = useState(null);

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Load Component
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadComponent();

    }, [id]);


    const loadComponent = async () => {

        try {

            setLoading(true);

            const response =
                await feeComponentApi.getById(id);

            console.log(
                "Fee Component:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data;

            if (!data) {

                alert(
                    "Fee component not found."
                );

                navigate(
                    "/fees/components"
                );

                return;

            }

            setComponent(data);

        }
        catch (error) {

            console.error(
                "Fee Component View Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load fee component."
            );

            navigate(
                "/fees/components"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Component Type Label
    |--------------------------------------------------------------------------
    */

    const getComponentTypeLabel = (type) => {

        switch (
            String(type || "").toLowerCase()
        ) {

            case "course":
                return "Course";

            case "hostel":
                return "Hostel";

            case "other":
                return "Other";

            default:
                return type || "-";

        }

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
                        Loading fee component...
                    </p>

                </div>

            </div>

        );

    }


    if (!component) {
        return null;
    }


    return (

        <div
            className="
                max-w-4xl
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
                    items-center
                    justify-between
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
                                "/fees/components"
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

                        <FaMoneyBillWave
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
                            Fee Component Details
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            View fee component information
                        </p>

                    </div>

                </div>


                {/* Edit */}

                <Link
                    to={`/fees/components/${component.id}/edit`}
                    className="
                        inline-flex
                        items-center
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

                    Edit

                </Link>

            </div>


            {/* =====================================================
                MAIN CARD
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

                {/* Card Header */}

                <div
                    className="
                        px-6
                        py-5
                        bg-gray-50
                        border-b
                        border-gray-200
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-gray-800
                                "
                            >
                                {component.name || "-"}
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Component Code:{" "}
                                <span className="font-semibold">
                                    {component.code || "-"}
                                </span>
                            </p>

                        </div>


                        {/* Status */}

                        {component.is_active ? (

                            <span
                                className="
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-green-50
                                    text-green-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                Active
                            </span>

                        ) : (

                            <span
                                className="
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-gray-100
                                    text-gray-600
                                    text-sm
                                    font-semibold
                                "
                            >
                                Inactive
                            </span>

                        )}

                    </div>

                </div>


                {/* Details */}

                <div className="p-6">

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        {/* Name */}

                        <div
                            className="
                                border
                                border-gray-200
                                rounded-lg
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                    font-semibold
                                    mb-2
                                "
                            >
                                Component Name
                            </p>

                            <p
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {component.name || "-"}
                            </p>

                        </div>


                        {/* Code */}

                        <div
                            className="
                                border
                                border-gray-200
                                rounded-lg
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                    font-semibold
                                    mb-2
                                "
                            >
                                Component Code
                            </p>

                            <p
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {component.code || "-"}
                            </p>

                        </div>


                        {/* Type */}

                        <div
                            className="
                                border
                                border-gray-200
                                rounded-lg
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                    font-semibold
                                    mb-2
                                "
                            >
                                Component Type
                            </p>

                            <span
                                className="
                                    inline-flex
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-blue-50
                                    text-blue-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                {getComponentTypeLabel(
                                    component.component_type
                                )}
                            </span>

                        </div>


                        {/* Status */}

                        <div
                            className="
                                border
                                border-gray-200
                                rounded-lg
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-gray-500
                                    font-semibold
                                    mb-2
                                "
                            >
                                Status
                            </p>

                            {component.is_active ? (

                                <span
                                    className="
                                        inline-flex
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-green-50
                                        text-green-700
                                        text-sm
                                        font-semibold
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
                                        bg-gray-100
                                        text-gray-600
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Inactive
                                </span>

                            )}

                        </div>

                    </div>


                    {/* Remarks */}

                    <div
                        className="
                            mt-6
                            border
                            border-gray-200
                            rounded-lg
                            p-4
                        "
                    >

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-wide
                                text-gray-500
                                font-semibold
                                mb-2
                            "
                        >
                            Remarks
                        </p>

                        <p
                            className="
                                text-sm
                                text-gray-700
                                whitespace-pre-wrap
                            "
                        >
                            {component.remarks || "No remarks added."}
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                BACK BUTTON
            ===================================================== */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/fees/components"
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
                        hover:bg-white
                        transition
                    "
                >

                    <FaArrowLeft />

                    Back to Components

                </button>

            </div>

        </div>

    );

}