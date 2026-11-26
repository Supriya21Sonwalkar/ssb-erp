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
    FaCalendarAlt,
} from "react-icons/fa";

import installmentApi from "../../../services/installmentApi";
import api from "../../../services/api";


export default function Index() {

    const [installments, setInstallments] = useState([]);

    const [academicYears, setAcademicYears] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [academicYearId, setAcademicYearId] = useState("");

    const [status, setStatus] = useState("");

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAcademicYears();

    }, []);


    useEffect(() => {

        loadInstallments();

    }, [academicYearId, status]);


    const loadAcademicYears = async () => {

        try {

            const response =
                await api.get(
                    "/academic-management/academic-years"
                );

            console.log(
                "Installments Index Academic Years Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                [];

            setAcademicYears(
                Array.isArray(data) ? data : []
            );

        }
        catch (error) {

            console.error(
                "Installments Index Academic Years Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            setAcademicYears([]);

        }

    };


    const loadInstallments = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            if (academicYearId) {
                params.academic_year_id = academicYearId;
            }

            if (status !== "") {
                params.status = status;
            }

            const response =
                await installmentApi.getAll(params);


            console.log(
                "Installments Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            if (Array.isArray(data)) {

                setInstallments(data);

            }
            else {

                setInstallments([]);

            }

        }
        catch (error) {

            console.error(
                "Installments Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load installments."
            );

            setInstallments([]);

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

    const filteredInstallments =
        installments.filter((item) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {
                return true;
            }


            return (

                String(
                    item.name || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.description || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.academicYear?.name ||
                    item.academicYear?.title ||
                    ""
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

            await installmentApi.toggleStatus(id);

            await loadInstallments();

        }
        catch (error) {

            console.error(
                "Toggle Status Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update installment status."
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
                "Are you sure you want to delete this installment?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await installmentApi.delete(id);

            await loadInstallments();

        }
        catch (error) {

            console.error(
                "Delete Installment Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete installment."
            );

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
                        Loading installments...
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
                            Installments
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Manage fee installment schedules
                        </p>

                    </div>

                </div>


                {/* Create */}

                <Link
                    to="/fees/installments/create"
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

                    Add Installment

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
                            placeholder="Search installment..."
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


                    {/* Academic Year */}

                    <select
                        value={academicYearId}
                        onChange={(e) =>
                            setAcademicYearId(
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
                            All Academic Years
                        </option>

                        {academicYears.map(
                            (year) => (

                                <option
                                    key={year.id}
                                    value={year.id}
                                >
                                    {year.academic_year ??
                                        year.name ??
                                        year.title ??
                                        `AY ${year.id}`}
                                </option>

                            )
                        )}

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
                        {filteredInstallments.length}
                    </span>

                    {" "}installment(s)

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
                                    Installment
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
                                        text-center
                                        text-xs
                                        font-bold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Duration
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

                            {filteredInstallments.length === 0 ? (

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

                                                <FaCalendarAlt
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
                                                No installments found
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                Create your first installment.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredInstallments.map(
                                    (item, index) => (

                                        <tr
                                            key={item.id}
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
                                                    {item.name || "-"}
                                                </div>


                                                {item.description && (

                                                    <div
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mt-1
                                                            max-w-xs
                                                            truncate
                                                        "
                                                    >
                                                        {item.description}
                                                    </div>

                                                )}

                                            </td>


                                            {/* Academic Year */}

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
                                                        text-xs
                                                        font-semibold
                                                        bg-indigo-50
                                                        text-indigo-700
                                                    "
                                                >
                                                    {item.academicYear?.name ||
                                                        item.academicYear?.title ||
                                                        "-"}
                                                </span>

                                            </td>


                                            {/* Duration */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <div
                                                    className="
                                                        text-sm
                                                        text-gray-700
                                                        font-medium
                                                    "
                                                >

                                                    {formatDate(
                                                        item.start_date
                                                    )}

                                                    <span
                                                        className="
                                                            mx-2
                                                            text-gray-400
                                                        "
                                                    >
                                                        to
                                                    </span>

                                                    {formatDate(
                                                        item.end_date
                                                    )}

                                                </div>

                                            </td>


                                            {/* Status */}

                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                {item.status ? (

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
                                                        to={`/fees/installments/${item.id}`}
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
                                                        to={`/fees/installments/${item.id}/edit`}
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
                                                                item.id
                                                            )
                                                        }
                                                        title={
                                                            item.status
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
                                                                item.status
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

                                                        {item.status ? (
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
                                                                item.id
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
