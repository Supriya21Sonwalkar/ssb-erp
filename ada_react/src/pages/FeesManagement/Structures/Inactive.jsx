import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaEye,
    FaToggleOn,
    FaSearch,
    FaFileInvoiceDollar,
} from "react-icons/fa";

import feeStructureApi from "../../../services/feeStructureApi";


export default function Inactive() {

    const navigate = useNavigate();

    const [structures, setStructures] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Inactive Structures
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadInactiveStructures();

    }, []);


    const loadInactiveStructures = async () => {

        try {

            setLoading(true);


            const response =
                await feeStructureApi.getAll({
                    status: 0,
                });


            console.log(
                "Inactive Fee Structures Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                /*
                |--------------------------------------------------------------------------
                | Extra frontend filter
                |--------------------------------------------------------------------------
                | This makes sure only inactive records are displayed even if
                | the backend does not apply the status parameter.
                */

                const inactiveRecords =
                    data.filter(
                        (item) =>
                            !Boolean(item.status)
                    );


                setStructures(
                    inactiveRecords
                );

            }
            else {

                setStructures([]);

            }

        }
        catch (error) {

            console.error(
                "Inactive Fee Structure Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            setStructures([]);

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

    const filteredStructures =
        structures.filter((structure) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {

                return true;

            }


            const structureName =
                String(
                    structure.name || ""
                )
                    .toLowerCase();


            const componentName =
                String(
                    structure.fee_component?.name ||
                    structure.feeComponent?.name ||
                    ""
                )
                    .toLowerCase();


            const courseName =
                String(
                    structure.course?.title ||
                    ""
                )
                    .toLowerCase();


            const academicYear =
                String(
                    structure.academic_year?.name ||
                    structure.academicYear?.name ||
                    structure.academic_year_id ||
                    ""
                )
                    .toLowerCase();


            return (

                structureName.includes(
                    searchText
                )

                ||

                componentName.includes(
                    searchText
                )

                ||

                courseName.includes(
                    searchText
                )

                ||

                academicYear.includes(
                    searchText
                )

            );

        });


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getComponentName = (structure) => {

        return (
            structure.fee_component?.name ||
            structure.feeComponent?.name ||
            "-"
        );

    };


    const getCourseName = (structure) => {

        return (
            structure.course?.title ||
            "-"
        );

    };


    const getAcademicYear = (structure) => {

        return (
            structure.academic_year?.name ||
            structure.academicYear?.name ||
            structure.academic_year?.title ||
            structure.academicYear?.title ||
            structure.academic_year_id ||
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


    /*
    |--------------------------------------------------------------------------
    | Activate Structure
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to activate this fee structure?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await feeStructureApi.toggleStatus(
                id
            );


            await loadInactiveStructures();

        }
        catch (error) {

            console.error(
                "Activate Fee Structure Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to activate fee structure."
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
                        Loading inactive fee structures...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="space-y-6">


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
                            Inactive Fee Structures
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            View and activate inactive fee structures
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================================
                SEARCH
            ===================================================== */}

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

                <div
                    className="
                        relative
                        max-w-xl
                    "
                >

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
                        placeholder="Search inactive fee structures..."
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


                <p
                    className="
                        text-sm
                        text-gray-500
                        mt-3
                    "
                >

                    Found{" "}

                    <span
                        className="
                            font-semibold
                            text-gray-800
                        "
                    >
                        {filteredStructures.length}
                    </span>

                    {" "}inactive fee structure(s)

                </p>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

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

                        <thead
                            className="
                                bg-gray-50
                                border-b
                                border-gray-200
                            "
                        >

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
                                    Structure
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
                                    Component
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
                                    Academic Year
                                </th>

                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-right
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Amount
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


                        <tbody
                            className="
                                divide-y
                                divide-gray-100
                            "
                        >

                            {filteredStructures.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            px-6
                                            py-14
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                            "
                                        >

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

                                                <FaFileInvoiceDollar
                                                    className="
                                                        text-gray-400
                                                        text-xl
                                                    "
                                                />

                                            </div>


                                            <p
                                                className="
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                No inactive fee structures found
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                All fee structures are currently active.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredStructures.map(
                                    (structure, index) => (

                                        <tr
                                            key={
                                                structure.id
                                            }
                                            className="
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* # */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {index + 1}
                                            </td>


                                            {/* Structure */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                "
                                            >

                                                <p
                                                    className="
                                                        font-semibold
                                                        text-gray-800
                                                    "
                                                >
                                                    {structure.name ||
                                                        "-"}
                                                </p>

                                            </td>


                                            {/* Component */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        bg-blue-50
                                                        text-blue-700
                                                        text-xs
                                                        font-semibold
                                                    "
                                                >
                                                    {getComponentName(
                                                        structure
                                                    )}
                                                </span>

                                            </td>


                                            {/* Course */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-700
                                                "
                                            >
                                                {getCourseName(
                                                    structure
                                                )}
                                            </td>


                                            {/* Academic Year */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-700
                                                "
                                            >
                                                {getAcademicYear(
                                                    structure
                                                )}
                                            </td>


                                            {/* Amount */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-right
                                                "
                                            >

                                                <span
                                                    className="
                                                        font-bold
                                                        text-[#610e1e]
                                                    "
                                                >
                                                    {formatAmount(
                                                        structure.total_amount
                                                    )}
                                                </span>

                                            </td>


                                            {/* Status */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        bg-gray-100
                                                        text-gray-600
                                                        text-xs
                                                        font-semibold
                                                    "
                                                >
                                                    Inactive
                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                    "
                                                >

                                                    {/* View */}

                                                    <Link
                                                        to={`/fees/structure/${structure.id}`}
                                                        title="View"
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


                                                    {/* Activate */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleActivate(
                                                                structure.id
                                                            )
                                                        }
                                                        title="Activate"
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

                                                        <FaToggleOn />

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


            {/* =====================================================
                BACK BUTTON
            ===================================================== */}

            <div
                className="
                    flex
                    justify-end
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