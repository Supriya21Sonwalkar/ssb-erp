import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSearch,
    FaRoute,
    FaEdit,
    FaClipboardList,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";

import homeworkSubmissionApi from "../../../services/homeworkSubmissionApi";


export default function Index() {

    const navigate = useNavigate();

    const [homeworks, setHomeworks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Homework / Assignments
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadHomeworks();

    }, []);


    const loadHomeworks = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkSubmissionApi.getAll();

            console.log(
                "Homework Submission Index Response:",
                response
            );

            const responseData = response?.data;

            const data =
                responseData?.data ??
                [];

            setHomeworks(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Unable to load homework:",
                error
            );

            console.error(
                "Backend Error:",
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
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredHomeworks = homeworks.filter(
        (homework) => {

            const searchText =
                search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                String(
                    homework.title || ""
                )
                    .toLowerCase()
                    .includes(searchText)
                ||

                String(
                    homework.description || ""
                )
                    .toLowerCase()
                    .includes(searchText)
            );

        }
    );


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
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
    | Track Homework
    |--------------------------------------------------------------------------
    */

    const handleTrack = (homeworkId) => {

        navigate(
            `/homework-assignment/submissions/${homeworkId}/track`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Update Homework / Submission Status
    |--------------------------------------------------------------------------
    */

    const handleUpdate = (homeworkId) => {

        navigate(
            `/homework-assignment/submissions/${homeworkId}/update`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const getStatus = (homework) => {

        const total =
            Number(homework.total_students || 0);

        const submitted =
            Number(homework.submitted_count || 0);

        const pending =
            Number(homework.pending_count || 0);


        if (total === 0) {

            return {
                text: "No Students",
                className:
                    "bg-gray-100 text-gray-600",
                icon: <FaClock />,
            };

        }


        if (submitted === 0) {

            return {
                text: "Not Submitted",
                className:
                    "bg-red-100 text-red-700",
                icon: <FaClock />,
            };

        }


        if (pending === 0) {

            return {
                text: "Completed",
                className:
                    "bg-green-100 text-green-700",
                icon: <FaCheckCircle />,
            };

        }


        return {
            text: "In Progress",
            className:
                "bg-yellow-100 text-yellow-700",
            icon: <FaClock />,
        };

    };


    return (

        <div className="space-y-6">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

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

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#610e1e]
                                flex
                                items-center
                                justify-center
                                shadow-lg
                            "
                        >

                            <FaClipboardList
                                className="
                                    text-[#FFD963]
                                    text-lg
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
                                Homework Submissions
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Track student homework and assignment submissions.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================================
                SEARCH
            ========================================================= */}

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

                <div
                    className="
                        relative
                        max-w-xl
                    "
                >

                    <FaSearch
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="
                            Search homework or assignment...
                        "
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            pl-10
                            pr-4
                            py-2.5
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#610e1e]
                        "
                    />

                </div>

            </div>


            {/* =========================================================
                HOMEWORK TABLE
            ========================================================= */}

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

                {/* Table heading */}

                <div
                    className="
                        px-5
                        py-4
                        border-b
                        border-gray-200
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
                            All Homework & Assignments
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                mt-1
                            "
                        >
                            {filteredHomeworks.length} record(s)
                        </p>

                    </div>

                </div>


                {/* Table */}

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead
                            className="
                                bg-[#610e1e]
                                text-white
                            "
                        >

                            <tr>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                    "
                                >
                                    #
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                        min-w-[220px]
                                    "
                                >
                                    Homework / Assignment
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                    "
                                >
                                    Class
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                    "
                                >
                                    Section
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                    "
                                >
                                    Subject
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-left
                                    "
                                >
                                    Due Date
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >
                                    Assigned
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >
                                    Submitted
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >
                                    Pending
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >
                                    Status
                                </th>

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {/* Loading */}

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="11"
                                        className="
                                            py-12
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        Loading homework and assignments...
                                    </td>

                                </tr>

                            )}


                            {/* Empty */}

                            {!loading &&
                                filteredHomeworks.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="
                                                py-12
                                                text-center
                                                text-gray-500
                                            "
                                        >

                                            <FaClipboardList
                                                className="
                                                    mx-auto
                                                    text-3xl
                                                    text-gray-300
                                                    mb-3
                                                "
                                            />

                                            No homework or assignments found.

                                        </td>

                                    </tr>

                                )}


                            {/* Data */}

                            {!loading &&
                                filteredHomeworks.map(
                                    (homework, index) => {

                                        const status =
                                            getStatus(
                                                homework
                                            );

                                        return (

                                            <tr
                                                key={
                                                    homework.id
                                                }
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                {/* # */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >
                                                    {index + 1}
                                                </td>


                                                {/* Homework */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            font-semibold
                                                            text-[#610e1e]
                                                        "
                                                    >
                                                        {
                                                            homework.title ||
                                                            "-"
                                                        }
                                                    </div>

                                                    {homework.description && (

                                                        <div
                                                            className="
                                                                text-xs
                                                                text-gray-500
                                                                mt-1
                                                                max-w-[280px]
                                                                truncate
                                                            "
                                                        >
                                                            {
                                                                homework.description
                                                            }
                                                        </div>

                                                    )}

                                                </td>


                                                {/* Class */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >

                                                    {
                                                        homework.class_name ||
                                                        homework.class?.class_name ||
                                                        homework.class_id ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Section */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >

                                                    {
                                                        homework.section_name ||
                                                        homework.section?.section_name ||
                                                        homework.section_id ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Subject */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >

                                                    {
                                                        homework.subject_name ||
                                                        homework.subject?.subject_name ||
                                                        homework.subject?.name ||
                                                        homework.subject_id ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Due Date */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                        whitespace-nowrap
                                                    "
                                                >

                                                    {
                                                        formatDate(
                                                            homework.due_date
                                                        )
                                                    }

                                                </td>


                                                {/* Assigned */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                        text-center
                                                        font-semibold
                                                    "
                                                >

                                                    {
                                                        homework.total_students ??
                                                        0
                                                    }

                                                </td>


                                                {/* Submitted */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            min-w-[35px]
                                                            justify-center
                                                            px-2
                                                            py-1
                                                            rounded-full
                                                            bg-green-100
                                                            text-green-700
                                                            font-semibold
                                                        "
                                                    >
                                                        {
                                                            homework.submitted_count ??
                                                            0
                                                        }
                                                    </span>

                                                </td>


                                                {/* Pending */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            min-w-[35px]
                                                            justify-center
                                                            px-2
                                                            py-1
                                                            rounded-full
                                                            bg-red-100
                                                            text-red-700
                                                            font-semibold
                                                        "
                                                    >
                                                        {
                                                            homework.pending_count ??
                                                            0
                                                        }
                                                    </span>

                                                </td>


                                                {/* Status */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-4
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            whitespace-nowrap
                                                            ${status.className}
                                                        `}
                                                    >

                                                        {status.icon}

                                                        {status.text}

                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td
                                                    className="
                                                        px-4
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

                                                        {/* Track */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleTrack(
                                                                    homework.id
                                                                )
                                                            }
                                                            title="Track Submissions"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-700
                                                                hover:bg-blue-100
                                                                font-semibold
                                                                text-xs
                                                                transition
                                                            "
                                                        >

                                                            <FaRoute />

                                                            Track

                                                        </button>


                                                        {/* Update */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    homework.id
                                                                )
                                                            }
                                                            title="Update Submission Status"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                bg-[#610e1e]/10
                                                                text-[#610e1e]
                                                                hover:bg-[#610e1e]/20
                                                                font-semibold
                                                                text-xs
                                                                transition
                                                            "
                                                        >

                                                            <FaEdit />

                                                            Update

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}