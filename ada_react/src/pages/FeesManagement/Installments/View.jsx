import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaCalendarAlt,
} from "react-icons/fa";

import installmentApi from "../../../services/installmentApi";


export default function View() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [installment, setInstallment] = useState(null);

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Load Installment
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadInstallment();

    }, [id]);


    const loadInstallment = async () => {

        try {

            setLoading(true);

            const response =
                await installmentApi.getById(id);

            console.log(
                "Installment:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data;

            if (!data) {

                alert(
                    "Installment not found."
                );

                navigate(
                    "/fees/installments"
                );

                return;

            }

            setInstallment(data);

        }
        catch (error) {

            console.error(
                "Installment View Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load installment."
            );

            navigate(
                "/fees/installments"
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (dateStr) => {

        if (!dateStr) return "-";

        try {

            const d = new Date(dateStr);

            if (isNaN(d.getTime())) return String(dateStr);

            return d.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        }
        catch {

            return String(dateStr);

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
                        Loading installment...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto space-y-6">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
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
                                "/fees/installments"
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

                        <FaCalendarAlt
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
                            Installment Details
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            View installment information
                        </p>

                    </div>

                </div>


                <Link
                    to={`/fees/installments/${installment.id}/edit`}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        bg-[#610e1e]
                        text-white
                        rounded-lg
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
                DETAILS CARD
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
                        bg-gray-50
                        border-b
                        border-gray-200
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        {installment.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-2">

                        {installment.status ? (

                            <span
                                className="
                                    inline-flex
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    bg-green-50
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

                    </div>

                </div>


                <div className="p-6">

                    <dl
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-x-8
                            gap-y-6
                        "
                    >

                        <div>

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                Academic Year
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {installment.academicYear?.name ||
                                    installment.academicYear?.title ||
                                    "-"}
                            </dd>

                        </div>


                        <div>

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                Installment Name
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {installment.name || "-"}
                            </dd>

                        </div>


                        <div>

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                Start Date
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {formatDate(
                                    installment.start_date
                                )}
                            </dd>

                        </div>


                        <div>

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                End Date
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {formatDate(
                                    installment.end_date
                                )}
                            </dd>

                        </div>


                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                Description
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    text-gray-700
                                "
                            >
                                {installment.description || (
                                    <span className="text-gray-400">
                                        No description provided.
                                    </span>
                                )}
                            </dd>

                        </div>


                        <div>

                            <dt
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-500
                                    uppercase
                                    tracking-wide
                                "
                            >
                                Fee Structures (Count)
                            </dt>

                            <dd
                                className="
                                    mt-2
                                    text-base
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {installment.feeStructures?.length ??
                                    0}
                            </dd>

                        </div>

                    </dl>

                </div>

            </div>

        </div>

    );
}
