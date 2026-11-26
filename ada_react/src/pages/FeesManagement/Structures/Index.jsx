import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaFileInvoiceDollar,
    FaListAlt,
} from "react-icons/fa";

import feeStructureApi from "../../../services/feeStructureApi";


export default function Index() {

    const [structures, setStructures] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [componentFilter, setComponentFilter] = useState("");

    const [courseFilter, setCourseFilter] = useState("");



    /*
    |--------------------------------------------------------------------------
    | Load Fee Structures
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadStructures();

    }, [
        componentFilter,
        courseFilter,
    ]);


    const loadStructures = async () => {

        try {

            setLoading(true);


            const params = {};


            if (componentFilter) {

                params.fee_component_id =
                    componentFilter;

            }


            if (courseFilter) {

                params.course_id =
                    courseFilter;

            }


            params.status = 1;


            const response =
                await feeStructureApi.getAll(
                    params
                );


            console.log(
                "Fee Structures Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                setStructures(data);

            } else {

                setStructures([]);

            }

        }
        catch (error) {

            console.error(
                "Fee Structures Error:",
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
    | Get Component Name
    |--------------------------------------------------------------------------
    */

    const getComponentName = (structure) => {

        return (
            structure.fee_component?.name ||
            structure.feeComponent?.name ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Get Course Name
    |--------------------------------------------------------------------------
    */

    const getCourseName = (structure) => {

        return (
            structure.course?.title ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Get Academic Year
    |--------------------------------------------------------------------------
    */

    const getAcademicYear = (structure) => {

        return (
            structure.academic_year?.name ||
            structure.academicYear?.name ||
            structure.academic_year_id ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        const number =
            Number(amount || 0);


        return number.toLocaleString(
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
    | Toggle Status
    |--------------------------------------------------------------------------
    */

    const handleToggleStatus = async (id) => {

        try {

            await feeStructureApi.toggleStatus(
                id
            );


            await loadStructures();

        }
        catch (error) {

            console.error(
                "Toggle Status Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to update fee structure status."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this fee structure?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await feeStructureApi.delete(id);


            await loadStructures();

        }
        catch (error) {

            console.error(
                "Delete Fee Structure Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to delete fee structure."
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
                        Loading fee structures...
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
                            Fees Structure
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Manage course and other fee structures
                        </p>

                    </div>

                </div>


                {/* Add & Inactive Buttons */}

                <div className="flex gap-3">

                    <Link
                        to="/fees/structure/create"
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
                            shadow-sm
                        "
                    >

                        <FaPlus />

                        Add Fee Structure

                    </Link>

                    <Link
                        to="/fees/structure/inactive"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            bg-white
                            text-[#610e1e]
                            border
                            border-[#610e1e]
                            rounded-lg
                            font-semibold
                            hover:bg-[#610e1e]
                            hover:text-white
                            transition
                            shadow-sm
                        "
                    >

                        <FaListAlt />

                        View Inactive

                    </Link>

                </div>

            </div>


            {/* =====================================================
                FILTERS
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
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                    "
                >

                    {/* Search */}

                    <div
                        className="
                            relative
                            lg:col-span-1
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
                            placeholder="Search fee structure..."
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


                    {/* Component */}

                    <select
                        value={componentFilter}
                        onChange={(e) =>
                            setComponentFilter(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            px-4
                            py-3
                            border
                            border-gray-300
                            rounded-lg
                            bg-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]/20
                            focus:border-[#610e1e]
                        "
                    >

                        <option value="">
                            All Components
                        </option>

                        <option value="course">
                            Course
                        </option>

                        <option value="hostel">
                            Hostel
                        </option>

                        <option value="other">
                            Other
                        </option>

                    </select>


                    {/* Course */}

                    <select
                        value={courseFilter}
                        onChange={(e) =>
                            setCourseFilter(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            px-4
                            py-3
                            border
                            border-gray-300
                            rounded-lg
                            bg-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]/20
                            focus:border-[#610e1e]
                        "
                    >

                        <option value="">
                            All Courses
                        </option>

                        {/* Courses will be loaded here later */}

                    </select>

                </div>


                <div
                    className="
                        mt-4
                        text-sm
                        text-gray-500
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

                    {" "}fee structure(s)

                </div>

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
                                                No fee structures found
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                Create a fee structure to get started.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredStructures.map(
                                    (structure, index) => (

                                        <tr
                                            key={structure.id}
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

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-gray-800
                                                    "
                                                >
                                                    {structure.name || "-"}
                                                </div>

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

                                                {structure.status ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            bg-green-50
                                                            text-green-700
                                                            text-xs
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
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >
                                                        Inactive
                                                    </span>
                                                )}
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

                                                    {/* Edit */}
                                                    <Link
                                                        to={`/fees/structure/${structure.id}/edit`}
                                                        title="Edit"
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

                                                    {/* Toggle */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                structure.id
                                                            )
                                                        }
                                                        title={
                                                            structure.status
                                                                ? "Deactivate"
                                                                : "Activate"
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
                                                                structure.status
                                                                    ? `
                                                                        bg-orange-50
                                                                        text-orange-600
                                                                        hover:bg-orange-600
                                                                        hover:text-white
                                                                    `
                                                                    : `
                                                                        bg-green-50
                                                                        text-green-600
                                                                        hover:bg-green-600
                                                                        hover:text-white
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {structure.status ? (
                                                            <FaToggleOn />
                                                        ) : (
                                                            <FaToggleOff />
                                                        )}
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                structure.id
                                                            )
                                                        }
                                                        title="Delete"
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