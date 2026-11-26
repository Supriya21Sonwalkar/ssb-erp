import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaEye,
    FaEdit,
    FaTrash,
    FaToggleOn,
    FaMoneyBillWave,
    FaSearch,
} from "react-icons/fa";

import feeComponentApi from "../../../services/feeComponentApi";


export default function Inactive() {

    const navigate = useNavigate();

    const [components, setComponents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Inactive Components
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadInactiveComponents();

    }, []);


    const loadInactiveComponents = async () => {

        try {

            setLoading(true);

            const response =
                await feeComponentApi.getAll({
                    is_active: 0,
                });


            console.log(
                "Inactive Fee Components Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                setComponents(data);

            } else {

                setComponents([]);

            }

        }
        catch (error) {

            console.error(
                "Inactive Fee Components Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
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
    | Activate Component
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (id) => {

        try {

            await feeComponentApi.toggleStatus(id);

            await loadInactiveComponents();

        }
        catch (error) {

            console.error(
                "Activate Component Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to activate fee component."
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
                "Are you sure you want to permanently delete this fee component?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await feeComponentApi.delete(id);

            await loadInactiveComponents();

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
    | Component Type
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
                        Loading inactive components...
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
                            bg-gray-600
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
                            Inactive Fee Components
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Manage inactive fee components
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
                    border
                    border-gray-200
                    shadow-sm
                    p-4
                "
            >

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
                        placeholder="Search inactive components..."
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
                        {filteredComponents.length}
                    </span>

                    {" "}inactive component(s)
                </p>

            </div>


            {/* =====================================================
                TABLE
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
                                                No inactive components found
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


                                            {/* Component */}

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


                                                    {/* Activate */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleActivate(
                                                                component.id
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