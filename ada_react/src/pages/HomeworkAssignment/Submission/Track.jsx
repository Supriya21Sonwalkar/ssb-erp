import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaBook,
    FaCheckCircle,
    FaClock,
    FaPaperclip,
    FaUsers,
    FaTimesCircle,
} from "react-icons/fa";

import homeworkSubmissionApi from "../../../services/homeworkSubmissionApi";


export default function Track() {

    const { homeworkId } = useParams();
    const navigate = useNavigate();

    const [homework, setHomework] = useState(null);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | Load Homework Tracking
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (homeworkId) {
            loadTracking();
        }

    }, [homeworkId]);


    const loadTracking = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkSubmissionApi.getById(
                    homeworkId
                );

            console.log(
                "Homework Tracking Response:",
                response
            );

            const responseData =
                response?.data?.data;

            setHomework(
                responseData?.homework || null
            );

            setStudents(
                Array.isArray(
                    responseData?.students
                )
                    ? responseData.students
                    : []
            );

        }
        catch (error) {

            console.error(
                "Unable to load homework tracking:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setHomework(null);
            setStudents([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Date Formatter
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
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalStudents =
        students.length;

    const submittedStudents =
        students.filter(
            student => student.submitted
        ).length;

    const pendingStudents =
        totalStudents - submittedStudents;

    const checkedStudents =
        students.filter(
            student => student.checked
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-12
                    text-center
                "
            >

                <div
                    className="
                        animate-spin
                        w-10
                        h-10
                        border-4
                        border-gray-200
                        border-t-[#610e1e]
                        rounded-full
                        mx-auto
                        mb-4
                    "
                ></div>

                <p className="text-gray-500">
                    Loading homework tracking...
                </p>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Homework Not Found
    |--------------------------------------------------------------------------
    */

    if (!homework) {

        return (

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-12
                    text-center
                "
            >

                <FaTimesCircle
                    className="
                        mx-auto
                        text-4xl
                        text-red-400
                        mb-4
                    "
                />

                <h2
                    className="
                        text-xl
                        font-bold
                        text-gray-800
                    "
                >
                    Homework not found
                </h2>

                <p
                    className="
                        text-gray-500
                        mt-2
                    "
                >
                    Unable to load the selected homework.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/homework-assignment/submissions"
                        )
                    }
                    className="
                        mt-5
                        px-5
                        py-2.5
                        bg-[#610e1e]
                        text-white
                        rounded-lg
                        font-semibold
                    "
                >
                    Back to Submissions
                </button>

            </div>

        );

    }


    return (

        <div className="space-y-6">

            {/* =========================================================
                HEADER
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

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/homework-assignment/submissions"
                            )
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                            hover:text-[#610e1e]
                            mb-3
                        "
                    >

                        <FaArrowLeft />

                        Back to Submissions

                    </button>


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
                            "
                        >

                            <FaBook
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
                                Track Homework
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Track student submission status.
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/homework-assignment/submissions/${homeworkId}/update`
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
                    "
                >

                    Update

                </button>

            </div>


            {/* =========================================================
                HOMEWORK DETAILS
            ========================================================= */}

            <div
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-6
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-gray-800
                            "
                        >
                            {homework.title || "-"}
                        </h2>

                        {homework.description && (

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-2
                                    max-w-3xl
                                "
                            >
                                {homework.description}
                            </p>

                        )}

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-5
                        gap-4
                        mt-6
                    "
                >

                    <Detail
                        label="Class"
                        value={
                            homework.class_name ||
                            homework.class?.class_name ||
                            homework.class_id ||
                            "-"
                        }
                    />

                    <Detail
                        label="Section"
                        value={
                            homework.section_name ||
                            homework.section?.section_name ||
                            homework.section_id ||
                            "-"
                        }
                    />

                    <Detail
                        label="Subject"
                        value={
                            homework.subject_name ||
                            homework.subject?.subject_name ||
                            homework.subject?.name ||
                            homework.subject_id ||
                            "-"
                        }
                    />

                    <Detail
                        label="Assigned Date"
                        value={
                            formatDate(
                                homework.assigned_date ||
                                homework.created_at
                            )
                        }
                    />

                    <Detail
                        label="Due Date"
                        value={
                            formatDate(
                                homework.due_date
                            )
                        }
                    />

                </div>

            </div>


            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                "
            >

                {/* Total */}

                <StatCard
                    icon={<FaUsers />}
                    title="Total Students"
                    value={totalStudents}
                    className="bg-blue-50 text-blue-700"
                />


                {/* Submitted */}

                <StatCard
                    icon={<FaCheckCircle />}
                    title="Submitted"
                    value={submittedStudents}
                    className="bg-green-50 text-green-700"
                />


                {/* Pending */}

                <StatCard
                    icon={<FaClock />}
                    title="Not Submitted"
                    value={pendingStudents}
                    className="bg-red-50 text-red-700"
                />


                {/* Checked */}

                <StatCard
                    icon={<FaCheckCircle />}
                    title="Teacher Checked"
                    value={checkedStudents}
                    className="bg-purple-50 text-purple-700"
                />

            </div>


            {/* =========================================================
                STUDENT TRACKING TABLE
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

                <div
                    className="
                        px-5
                        py-4
                        border-b
                        border-gray-200
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        Student Submission Tracking
                    </h2>

                    <p
                        className="
                            text-xs
                            text-gray-500
                            mt-1
                        "
                    >
                        View who has submitted and who has not.
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead
                            className="
                                bg-[#610e1e]
                                text-white
                            "
                        >

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Student
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Roll No.
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Submission
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Submitted On
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Teacher Checked
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Attachment
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {students.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            py-12
                                            text-center
                                            text-gray-500
                                        "
                                    >

                                        No students found.

                                    </td>

                                </tr>

                            ) : (

                                students.map(
                                    (student, index) => (

                                        <tr
                                            key={
                                                student.student_id
                                            }
                                            className="
                                                border-b
                                                border-gray-100
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* # */}

                                            <td className="px-4 py-3">

                                                {index + 1}

                                            </td>


                                            {/* Student */}

                                            <td className="px-4 py-3">

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-gray-800
                                                    "
                                                >
                                                    {
                                                        student.student_name ||
                                                        "-"
                                                    }
                                                </div>

                                            </td>


                                            {/* Roll */}

                                            <td className="px-4 py-3">

                                                {
                                                    student.roll_no ||
                                                    "-"
                                                }

                                            </td>


                                            {/* Submission */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-center
                                                "
                                            >

                                                {student.submitted ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            bg-green-100
                                                            text-green-700
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >

                                                        <FaCheckCircle />

                                                        Submitted

                                                    </span>

                                                ) : (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            bg-red-100
                                                            text-red-700
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >

                                                        <FaClock />

                                                        Not Submitted

                                                    </span>

                                                )}

                                            </td>


                                            {/* Date */}

                                            <td className="px-4 py-3">

                                                {formatDate(
                                                    student.submission_date
                                                )}

                                            </td>


                                            {/* Checked */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-center
                                                "
                                            >

                                                {student.checked ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            text-green-700
                                                            font-semibold
                                                        "
                                                    >

                                                        <FaCheckCircle />

                                                        Checked

                                                    </span>

                                                ) : (

                                                    <span
                                                        className="
                                                            text-gray-400
                                                        "
                                                    >
                                                        Not Checked
                                                    </span>

                                                )}

                                            </td>


                                            {/* Attachment */}

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                    text-center
                                                "
                                            >

                                                {student.attachment_path ? (

                                                    <a
                                                        href={
                                                            student.attachment_path
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            text-[#610e1e]
                                                            hover:underline
                                                        "
                                                    >

                                                        <FaPaperclip />

                                                        View

                                                    </a>

                                                ) : (

                                                    <span className="text-gray-400">
                                                        -
                                                    </span>

                                                )}

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


/*
|--------------------------------------------------------------------------
| Detail Component
|--------------------------------------------------------------------------
*/

function Detail({
    label,
    value,
}) {

    return (

        <div
            className="
                bg-gray-50
                rounded-lg
                p-3
            "
        >

            <div
                className="
                    text-xs
                    text-gray-500
                    mb-1
                "
            >
                {label}
            </div>

            <div
                className="
                    text-sm
                    font-semibold
                    text-gray-800
                "
            >
                {value}
            </div>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Statistics Card
|--------------------------------------------------------------------------
*/

function StatCard({
    icon,
    title,
    value,
    className,
}) {

    return (

        <div
            className={`
                rounded-xl
                p-5
                ${className}
            `}
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            opacity-80
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            text-2xl
                            font-bold
                            mt-1
                        "
                    >
                        {value}
                    </p>

                </div>

                <div
                    className="
                        text-2xl
                        opacity-70
                    "
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}