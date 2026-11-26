import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaEye,
    FaEdit,
    FaToggleOff,
    FaCalendarAlt,
    FaSearch,
} from "react-icons/fa";

import installmentApi from "../../../services/installmentApi";


export default function Inactive() {

    const navigate = useNavigate();

    const [installments, setInstallments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Inactive Installments
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadInactive();

    }, []);


    const loadInactive = async () => {

        try {

            setLoading(true);

            const response =
                await installmentApi.getAll({
                    status: 0,
                });


            console.log(
                "Inactive Installments:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            setInstallments(
                Array.isArray(data) ? data : []
            );

        }
        catch (error) {

            console.error(
                "Inactive Installments Error:",
                error
            );

            setInstallments([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Activate
    |--------------------------------------------------------------------------
    */

    const handleActivate = async (id) => {

        try {

            await installmentApi.toggleStatus(id);

            await loadInactive();

        }
        catch (error) {

            console.error(
                "Activate Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to activate installment."
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
    | Search
    |--------------------------------------------------------------------------
    */

    const filtered =
        installments.filter((item) => {

            const s = search
                .toLowerCase()
                .trim();

            if (!s) return true;

            return (
                String(
                    item.name || ""
                ).toLowerCase().includes(s)
                ||
                String(
                    item.description || ""
                ).toLowerCase().includes(s)
            );

        });


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
                        Loading inactive installments...
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
                        Inactive Installments
                    </h1>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Reactivate installments to use them again
                    </p>

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
                        placeholder="Search inactive installments..."
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


                <div
                    className="
                        mt-4
                        text-sm
                        text-gray-500
                    "
                >
                    Found{" "}
                    <span className="font-semibold text-gray-800">
                        {filtered.length}
                    </span>
                    {" "}inactive installment(s)
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

                            {filtered.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
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
                                                No inactive installments
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                All installments are active.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filtered.map(
                                    (item, index) => (

                                        <tr
                                            key={item.id}
                                            className="
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

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


                                            <td
                                                className="
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >

                                                {formatDate(
                                                    item.start_date
                                                )}

                                                <span className="mx-2 text-gray-400">
                                                    to
                                                </span>

                                                {formatDate(
                                                    item.end_date
                                                )}

                                            </td>


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


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleActivate(
                                                                item.id
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
                                                        <FaToggleOff />
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
