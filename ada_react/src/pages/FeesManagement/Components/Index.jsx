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
    FaMoneyBillWave,
} from "react-icons/fa";

import feeComponentApi from "../../../services/feeComponentApi";


export default function Index() {

    const [components, setComponents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [componentType, setComponentType] = useState("");

    const [status, setStatus] = useState("");

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Components
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadComponents();

    }, [componentType, status]);


    const loadComponents = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            if (componentType) {
                params.component_type = componentType;
            }

            if (status !== "") {
                params.is_active = status;
            }


            const response =
                await feeComponentApi.getAll(params);


            console.log(
                "Fee Components Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                setComponents(data);

            }
            else {

                setComponents([]);

            }

        }
        catch (error) {

            console.error(
                "Fee Components Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load fee components."
            );

            setComponents([]);

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

    const filteredComponents =
        components.filter((component) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {
                return true;
            }


            return (

                String(
                    component.name || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    component.code || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    component.component_type || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    component.remarks || ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /*
    |--------------------------------------------------------------------------
    | Toggle Status
    |--------------------------------------------------------------------------
    */

    const handleToggleStatus = async (id) => {

        try {

            await feeComponentApi.toggleStatus(id);

            await loadComponents();

        }
        catch (error) {

            console.error(
                "Toggle Status Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update component status."
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
                "Are you sure you want to delete this fee component?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await feeComponentApi.delete(id);

            await loadComponents();

        }
        catch (error) {

            console.error(
                "Delete Component Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete fee component."
            );

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
    | Component Type Badge
    |--------------------------------------------------------------------------
    */

    const getComponentTypeClass = (type) => {

        switch (
            String(type || "").toLowerCase()
        ) {

            case "course":
                return "bg-blue-50 text-blue-700";

            case "hostel":
                return "bg-purple-50 text-purple-700";

            case "other":
                return "bg-orange-50 text-orange-700";

            default:
                return "bg-gray-100 text-gray-700";

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
                        Loading fee components...
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
                            Fee Components
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Manage course, hostel and other fee components
                        </p>

                    </div>

                </div>


                {/* Create */}

                <Link
                    to="/fees/components/create"
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

                    Add Component

                </Link>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

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
                        md:grid-cols-3
                        gap-4
                    "
                >

                    {/* Search */}

                    <div className="relative">

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
                            placeholder="Search component..."
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


                    {/* Component Type */}

                    <select
                        value={componentType}
                        onChange={(e) =>
                            setComponentType(
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
                            text-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]/20
                            focus:border-[#610e1e]
                        "
                    >

                        <option value="">
                            All Component Types
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


                    {/* Status */}

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
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
                            text-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]/20
                            focus:border-[#610e1e]
                        "
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="1">
                            Active
                        </option>

                        <option value="0">
                            Inactive
                        </option>

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
                        {filteredComponents.length}
                    </span>

                    {" "}component(s)

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
                                    Code
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
                                    Type
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

                            {filteredComponents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
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

                                                <FaMoneyBillWave
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
                                                No fee components found
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                Create your first fee component.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredComponents.map(
                                    (component, index) => (

                                        <tr
                                            key={component.id}
                                            className="
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* Number */}

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


                                            {/* Name */}

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
                                                    {component.name || "-"}
                                                </div>


                                                {component.remarks && (

                                                    <div
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mt-1
                                                            max-w-xs
                                                            truncate
                                                        "
                                                    >
                                                        {component.remarks}
                                                    </div>

                                                )}

                                            </td>


                                            {/* Code */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        px-2.5
                                                        py-1
                                                        rounded-md
                                                        bg-gray-100
                                                        text-gray-700
                                                        text-xs
                                                        font-bold
                                                    "
                                                >
                                                    {component.code || "-"}
                                                </span>

                                            </td>


                                            {/* Type */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className={`
                                                        inline-flex
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        ${getComponentTypeClass(
                                                            component.component_type
                                                        )}
                                                    `}
                                                >
                                                    {getComponentTypeLabel(
                                                        component.component_type
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

                                                {component.is_active ? (

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
                                                        to={`/fees/components/${component.id}`}
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
                                                        to={`/fees/components/${component.id}/edit`}
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
                                                                component.id
                                                            )
                                                        }
                                                        title={
                                                            component.is_active
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
                                                                component.is_active
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

                                                        {component.is_active ? (
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
                                                                component.id
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