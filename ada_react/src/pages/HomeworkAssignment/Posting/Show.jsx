import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaCalendar,
    FaUser,
    FaBook,
    FaClipboardList,
    FaPaperclip,
} from "react-icons/fa";

import homeworkAssignmentApi from "../../../services/homeworkAssignmentApi";

export default function Show() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadHomework();

    }, [id]);


    const loadHomework = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkAssignmentApi.getById(id);

            console.log(
                "Homework Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                {};

            setHomework(data);

        }
        catch (error) {

            console.error(
                "Homework loading error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load homework details."
            );

        }
        finally {

            setLoading(false);

        }

    };


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


    const getStatusBadge = (status) => {

        if (status === "Published") {

            return (
                <span className="
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    bg-green-100
                    text-green-700
                ">
                    Published
                </span>
            );

        }

        if (status === "Closed") {

            return (
                <span className="
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    bg-gray-100
                    text-gray-700
                ">
                    Closed
                </span>
            );

        }

        return (
            <span className="
                inline-flex
                items-center
                gap-1
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
                bg-yellow-100
                text-yellow-700
            ">
                Draft
            </span>
        );

    };


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
                        Loading homework details...
                    </p>

                </div>

            </div>

        );

    }


    if (!homework) {

        return (

            <div className="
                min-h-[500px]
                flex
                items-center
                justify-center
            ">

                <p className="text-gray-500">
                    Homework not found.
                </p>

            </div>

        );

    }


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

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/homework-assignment")
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-lg
                            border
                            border-gray-300
                            text-gray-700
                            hover:bg-gray-50
                            font-semibold
                            transition
                        "
                    >

                        <FaArrowLeft />

                        Back

                    </button>


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
                            Homework Details
                        </h1>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            View homework assignment information
                        </p>

                    </div>

                </div>


                {/* Actions */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    {homework.status === "Draft" && (

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/homework-assignment/${homework.id}/edit`
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

                            <FaEdit />

                            Edit Homework

                        </button>

                    )}

                </div>

            </div>


            {/* ================================================================
                DETAILS CARD
            ================================================================ */}

            <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
            ">


                {/* Card Header */}

                <div className="
                    px-6
                    py-4
                    border-b
                    border-gray-200
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-xl
                            font-bold
                            text-gray-800
                        ">
                            {homework.title || "-"}
                        </h2>

                        <div className="
                            mt-2
                        ">
                            {getStatusBadge(homework.status)}
                        </div>

                    </div>

                </div>


                {/* Card Body */}

                <div className="
                    p-6
                    space-y-6
                ">


                    {/* Type */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                <FaBook className="inline mr-2" />
                                Type
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {homework.homework_type || "-"}
                            </p>

                        </div>


                        {/* Status */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                Status
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {homework.status || "-"}
                            </p>

                        </div>

                    </div>


                    {/* Class & Section */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                <FaUser className="inline mr-2" />
                                Class
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {homework.class_name ||
                                    homework.class?.class_name ||
                                    "-"}
                            </p>

                        </div>


                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                Section
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {homework.section_name ||
                                    homework.section?.section_name ||
                                    "-"}
                            </p>

                        </div>

                    </div>


                    {/* Subject */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-600
                            mb-2
                        ">
                            <FaBook className="inline mr-2" />
                            Subject
                        </label>

                        <p className="
                            text-gray-800
                            font-medium
                        ">
                            {homework.subject_name ||
                                homework.subject?.subject_name ||
                                "-"}
                        </p>

                    </div>


                    {/* Dates */}

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                <FaCalendar className="inline mr-2" />
                                Assigned Date
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {formatDate(homework.assigned_date)}
                            </p>

                        </div>


                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                <FaCalendar className="inline mr-2" />
                                Due Date
                            </label>

                            <p className="
                                text-gray-800
                                font-medium
                            ">
                                {formatDate(homework.due_date)}
                            </p>

                        </div>

                    </div>


                    {/* Description */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-600
                            mb-2
                        ">
                            Description
                        </label>

                        <div className="
                            p-4
                            bg-gray-50
                            rounded-lg
                            border
                            border-gray-200
                        ">

                            <p className="
                                text-gray-700
                                whitespace-pre-wrap
                            ">
                                {homework.description || "-"}
                            </p>

                        </div>

                    </div>


                    {/* Attachments */}

                    {homework.attachments &&
                        homework.attachments.length > 0 && (

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-600
                                mb-2
                            ">
                                <FaPaperclip className="inline mr-2" />
                                Attachments
                            </label>

                            <div className="
                                space-y-2
                            ">

                                {homework.attachments.map(
                                    (attachment, index) => (

                                        <a
                                            key={index}
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-4
                                                py-2
                                                bg-blue-50
                                                text-blue-600
                                                rounded-lg
                                                hover:bg-blue-100
                                                transition
                                            "
                                        >

                                            <FaPaperclip />

                                            {attachment.name ||
                                                `Attachment ${index + 1}`}

                                        </a>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}
