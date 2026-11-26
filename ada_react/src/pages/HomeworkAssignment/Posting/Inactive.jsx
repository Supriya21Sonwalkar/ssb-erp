import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaEye,
    FaSearch,
    FaClipboardList,
    FaCheckCircle,
} from "react-icons/fa";

import homeworkAssignmentApi from "../../../services/homeworkAssignmentApi";


export default function Inactive() {

    const navigate = useNavigate();

    const [homeworks, setHomeworks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    useEffect(() => {

        loadInactiveHomeworks();

    }, []);


    const loadInactiveHomeworks = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.getAll();

            console.log(
                "Homework Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                [];

            console.log(
                "Homework Data:",
                data
            );

            if (Array.isArray(data)) {

                const inactiveRecords =
                    data.filter((item) => {

                        const status =
                            String(
                                item.status ?? ""
                            )
                                .toLowerCase()
                                .trim();

                        return (
                            status === "inactive" ||
                            status === "closed"
                        );

                    });

                setHomeworks(
                    inactiveRecords
                );

            } else {

                setHomeworks([]);

            }

        }
        catch (error) {

            console.error(
                "Inactive Homework Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            setHomeworks([]);

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

        const confirmed =
            window.confirm(
                "Are you sure you want to activate this homework?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.activate(id);

            loadInactiveHomeworks();

        }
        catch (error) {

            console.error(
                "Activate homework error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to activate homework."
            );

        }
        finally {

            setLoading(false);

        }

    };


    const filteredHomeworks =
        homeworks.filter((item) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();

            if (!searchText) {
                return true;
            }

            return (

                String(
                    item.title || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.homework_type || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.subject_name ||
                    item.subject?.subject_name ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.class_name ||
                    item.class?.class_name ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    item.section_name ||
                    item.section?.section_name ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

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

            <div className="
                min-h-[500px]
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        w-12
                        h-12
                        border-4
                        border-[#610e1e]
                        border-t-transparent
                        rounded-full
                        animate-spin
                        mx-auto
                        mb-4
                    " />

                    <p className="
                        text-gray-600
                        font-semibold
                    ">
                        Loading inactive homework...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="
            min-h-full
            space-y-6
        ">


            {/* ================================================================
                HEADER
            ================================================================ */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        w-11
                        h-11
                        rounded-xl
                        bg-[#610e1e]
                        flex
                        items-center
                        justify-center
                        shadow
                    ">

                        <FaClipboardList
                            className="
                                text-[#FFD963]
                                text-lg
                            "
                        />

                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            text-[#610e1e]
                        ">
                            Inactive Homework
                        </h1>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            View inactive homework and assignments.
                        </p>

                    </div>

                </div>


                {/* Back */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/homework-assignment"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-lg
                        border
                        border-[#610e1e]
                        text-[#610e1e]
                        hover:bg-[#610e1e]
                        hover:text-white
                        font-semibold
                        transition
                    "
                >

                    <FaArrowLeft />

                    Back

                </button>

            </div>


            {/* ================================================================
                SEARCH
            ================================================================ */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-4
            ">

                <div className="
                    relative
                    max-w-md
                ">

                    <FaSearch className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    " />


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search inactive homework..."
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-2.5
                            border
                            border-gray-300
                            rounded-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]
                            focus:border-[#610e1e]
                        "
                    />

                </div>

            </div>


            {/* ================================================================
                TABLE
            ================================================================ */}

            <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                overflow-hidden
            ">


                {/* Table Header */}

                <div className="
                    px-5
                    py-4
                    border-b
                    border-gray-200
                ">

                    <h2 className="
                        text-lg
                        font-bold
                        text-gray-800
                    ">
                        Inactive Records
                    </h2>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        {filteredHomeworks.length} record(s)
                    </p>

                </div>


                {/* Empty */}

                {filteredHomeworks.length === 0 ? (

                    <div className="
                        py-16
                        text-center
                    ">

                        <FaClipboardList className="
                            text-4xl
                            text-gray-300
                            mx-auto
                            mb-4
                        " />

                        <p className="
                            text-gray-500
                            font-medium
                        ">
                            No inactive homework found.
                        </p>

                    </div>

                ) : (

                    /* ==========================================================
                       TABLE
                    ========================================================== */

                    <div className="
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                            text-sm
                        ">

                            <thead>

                                <tr className="
                                    bg-gray-50
                                    border-b
                                    border-gray-200
                                ">

                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        #
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Homework
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Type
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Class
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Section
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Subject
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Assigned Date
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-left
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Due Date
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-center
                                        font-semibold
                                        text-gray-700
                                    ">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredHomeworks.map(
                                    (item, index) => (

                                        <tr
                                            key={item.id}
                                            className="
                                                border-b
                                                border-gray-100
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* # */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                            ">
                                                {index + 1}
                                            </td>


                                            {/* Homework */}

                                            <td className="
                                                px-4
                                                py-4
                                            ">

                                                <div className="
                                                    font-semibold
                                                    text-[#610e1e]
                                                ">
                                                    {item.title || "-"}
                                                </div>

                                            </td>


                                            {/* Type */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                            ">
                                                {item.homework_type || "-"}
                                            </td>


                                            {/* Class */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                            ">

                                                {item.class_name ||
                                                    item.class?.class_name ||
                                                    "-"}

                                            </td>


                                            {/* Section */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                            ">

                                                {item.section_name ||
                                                    item.section?.section_name ||
                                                    "-"}

                                            </td>


                                            {/* Subject */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                            ">

                                                {item.subject_name ||
                                                    item.subject?.subject_name ||
                                                    "-"}

                                            </td>


                                            {/* Assigned Date */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                                whitespace-nowrap
                                            ">

                                                {formatDate(
                                                    item.assigned_date
                                                )}

                                            </td>


                                            {/* Due Date */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-gray-600
                                                whitespace-nowrap
                                            ">

                                                {formatDate(
                                                    item.due_date
                                                )}

                                            </td>


                                            {/* Action */}

                                            <td className="
                                                px-4
                                                py-4
                                            ">

                                                <div className="
                                                    flex
                                                    justify-center
                                                    gap-2
                                                ">

                                                    <button
                                                        type="button"
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/homework-assignment/${item.id}`
                                                            )
                                                        }
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            border
                                                            border-blue-200
                                                            text-blue-600
                                                            hover:bg-blue-50
                                                            flex
                                                            items-center
                                                            justify-center
                                                            transition
                                                        "
                                                    >

                                                        <FaEye />

                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Activate"
                                                        onClick={() =>
                                                            handleActivate(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            bg-green-50
                                                            text-green-600
                                                            hover:bg-green-100
                                                            flex
                                                            items-center
                                                            justify-center
                                                            transition
                                                        "
                                                    >

                                                        <FaCheckCircle />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}