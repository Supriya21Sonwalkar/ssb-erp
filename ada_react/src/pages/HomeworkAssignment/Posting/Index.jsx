import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheckCircle,
    FaLock,
    FaPaperclip,
    FaSearch,
} from "react-icons/fa";

import homeworkAssignmentApi from "../../../services/homeworkAssignmentApi";

export default function Index() {

    const navigate = useNavigate();

    const [homework, setHomework] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load Homework
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadHomework();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Get Homework
    |--------------------------------------------------------------------------
    */

    const loadHomework = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.getAll({
                    search: search || undefined,
                    status: status || undefined,
                });

            console.log(
                "Homework Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                [];

            setHomework(
                Array.isArray(data)
                    ? data.filter((item) => {
                        const status =
                            String(item.status ?? "")
                                .toLowerCase()
                                .trim();
                        return status !== "closed" && status !== "inactive";
                    })
                    : []
            );

        }
        catch (error) {

            console.error(
                "Homework loading error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

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

    const handleSearch = (e) => {

        e.preventDefault();

        loadHomework();

    };


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this homework?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.delete(id);

            loadHomework();

        }
        catch (error) {

            console.error(
                "Delete homework error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete homework."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Publish
    |--------------------------------------------------------------------------
    */

    const handlePublish = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to publish this homework?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.publish(id);

            loadHomework();

        }
        catch (error) {

            console.error(
                "Publish homework error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to publish homework."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    const handleClose = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to close this homework?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.close(id);

            loadHomework();

        }
        catch (error) {

            console.error(
                "Close homework error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to close homework."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Status Badge
    |--------------------------------------------------------------------------
    */

    const getStatusBadge = (itemStatus) => {

        if (itemStatus === "Published") {

            return (
                <span className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-green-100
                    text-green-700
                ">
                    <FaCheckCircle />
                    Published
                </span>
            );

        }

        if (itemStatus === "Closed") {

            return (
                <span className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-gray-100
                    text-gray-700
                ">
                    <FaLock />
                    Closed
                </span>
            );

        }

        return (
            <span className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1
                rounded-full
                text-xs
                font-semibold
                bg-yellow-100
                text-yellow-700
            ">
                Draft
            </span>
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    return (

        <div className="space-y-6">

            {/* ---------------------------------------------------------
                Header
            --------------------------------------------------------- */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-[#610e1e]
                    ">
                        Homework & Assignment
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Manage homework and assignments posted for students.
                    </p>

                </div>


                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/homework-assignment/inactive"
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
                            border-gray-300
                            text-gray-700
                            hover:bg-gray-50
                            font-semibold
                            transition
                            shadow-sm
                        "
                    >

                        <FaLock />

                        View Inactive

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/homework-assignment/create"
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
                            bg-[#610e1e]
                            hover:bg-[#4b0b18]
                            text-white
                            font-semibold
                            transition
                            shadow-sm
                        "
                    >

                        <FaPlus />

                        Create Homework

                    </button>

                </div>

            </div>


            {/* ---------------------------------------------------------
                Filters
            --------------------------------------------------------- */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-4
            ">

                <form
                    onSubmit={handleSearch}
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                    "
                >

                    {/* Search */}

                    <div className="md:col-span-2">

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Search Homework
                        </label>

                        <div className="relative">

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
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by homework title or description..."
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    pl-10
                                    pr-3
                                    py-2.5
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]
                                "
                            />

                        </div>

                    </div>


                    {/* Status */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-3
                                py-2.5
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="Draft">
                                Draft
                            </option>

                            <option value="Published">
                                Published
                            </option>

                            <option value="Closed">
                                Closed
                            </option>

                        </select>

                    </div>


                    {/* Search Button */}

                    <div className="
                        md:col-span-3
                        flex
                        justify-end
                    ">

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-5
                                py-2.5
                                rounded-lg
                                bg-[#610e1e]
                                hover:bg-[#4b0b18]
                                text-white
                                font-semibold
                                disabled:opacity-50
                            "
                        >

                            Search

                        </button>

                    </div>

                </form>

            </div>


            {/* ---------------------------------------------------------
                Table
            --------------------------------------------------------- */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                overflow-hidden
            ">

                <div className="
                    px-5
                    py-4
                    border-b
                    border-gray-200
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h2 className="
                            font-bold
                            text-gray-800
                        ">
                            Posted Homework
                        </h2>

                        <p className="
                            text-xs
                            text-gray-500
                            mt-1
                        ">
                            {homework.length} homework record(s)
                        </p>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="
                            bg-[#610e1e]
                            text-white
                        ">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Homework
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Class
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Section
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Subject
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Assigned
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Due Date
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Files
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="
                                            text-center
                                            py-10
                                            text-gray-500
                                        "
                                    >
                                        Loading homework...
                                    </td>

                                </tr>

                            ) : homework.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="
                                            text-center
                                            py-10
                                            text-gray-500
                                        "
                                    >
                                        No homework found.
                                    </td>

                                </tr>

                            ) : (

                                homework.map(
                                    (item, index) => (

                                        <tr
                                            key={item.id}
                                            className="
                                                border-b
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* Number */}

                                            <td className="
                                                px-4
                                                py-3
                                                font-medium
                                            ">
                                                {index + 1}
                                            </td>


                                            {/* Homework */}

                                            <td className="
                                                px-4
                                                py-3
                                                min-w-[220px]
                                            ">

                                                <div className="
                                                    font-semibold
                                                    text-[#610e1e]
                                                ">
                                                    {item.title}
                                                </div>

                                                <div className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    {item.homework_type}
                                                </div>

                                            </td>


                                            {/* Class */}

                                            <td className="px-4 py-3">
                                                {item.class_name ||
                                                    item.class?.class_name ||
                                                    "-"}
                                            </td>


                                            {/* Section */}

                                            <td className="px-4 py-3">
                                                {item.section_name ||
                                                    item.section?.section_name ||
                                                    "-"}
                                            </td>


                                            {/* Subject */}

                                            <td className="px-4 py-3">
                                                {item.subject_name ||
                                                    item.subject?.subject_name ||
                                                    item.subject?.name ||
                                                    "-"}
                                            </td>


                                            {/* Assigned */}

                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {formatDate(
                                                    item.assigned_date
                                                )}
                                            </td>


                                            {/* Due */}

                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {formatDate(
                                                    item.due_date
                                                )}
                                            </td>


                                            {/* Status */}

                                            <td className="px-4 py-3">
                                                {getStatusBadge(
                                                    item.status
                                                )}
                                            </td>


                                            {/* Attachments */}

                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                            ">

                                                {item.attachments?.length > 0 ? (

                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        text-[#610e1e]
                                                        font-semibold
                                                    ">

                                                        <FaPaperclip />

                                                        {item.attachments.length}

                                                    </span>

                                                ) : (

                                                    <span className="
                                                        text-gray-400
                                                    ">
                                                        -
                                                    </span>

                                                )}

                                            </td>


                                            {/* Actions */}

                                            <td className="
                                                px-4
                                                py-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                ">

                                                    {/* View */}

                                                    <button
                                                        type="button"
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/homework-assignment/${item.id}`
                                                            )
                                                        }
                                                        className="
                                                            w-8
                                                            h-8
                                                            rounded-lg
                                                            bg-blue-50
                                                            text-blue-600
                                                            hover:bg-blue-100
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <FaEye />

                                                    </button>


                                                    {/* Edit */}

                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/homework-assignment/${item.id}/edit`
                                                            )
                                                        }
                                                        className="
                                                            w-8
                                                            h-8
                                                            rounded-lg
                                                            bg-yellow-50
                                                            text-yellow-600
                                                            hover:bg-yellow-100
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <FaEdit />

                                                    </button>


                                                    {/* Publish */}

                                                    {item.status === "Draft" && (

                                                        <button
                                                            type="button"
                                                            title="Publish"
                                                            onClick={() =>
                                                                handlePublish(
                                                                    item.id
                                                                )
                                                            }
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                bg-green-50
                                                                text-green-600
                                                                hover:bg-green-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >

                                                            <FaCheckCircle />

                                                        </button>

                                                    )}


                                                    {/* Close */}

                                                    {item.status === "Published" && (

                                                        <button
                                                            type="button"
                                                            title="Close"
                                                            onClick={() =>
                                                                handleClose(
                                                                    item.id
                                                                )
                                                            }
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                bg-gray-100
                                                                text-gray-600
                                                                hover:bg-gray-200
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >

                                                            <FaLock />

                                                        </button>

                                                    )}


                                                    {/* Delete */}

                                                    <button
                                                        type="button"
                                                        title="Make Inactive"
                                                        onClick={() =>
                                                            handleClose(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            w-8
                                                            h-8
                                                            rounded-lg
                                                            bg-red-50
                                                            text-red-600
                                                            hover:bg-red-100
                                                            flex
                                                            items-center
                                                            justify-center
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