import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaBook,
    FaCheckCircle,
    FaPaperclip,
    FaSave,
    FaUserGraduate,
} from "react-icons/fa";

import homeworkSubmissionApi from "../../../services/homeworkSubmissionApi";


export default function Update() {

    const { homeworkId } = useParams();
    const navigate = useNavigate();

    const [homework, setHomework] = useState(null);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [selectedStudents, setSelectedStudents] = useState({});


    /*
    |--------------------------------------------------------------------------
    | Load Homework
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (homeworkId) {
            loadHomework();
        }

    }, [homeworkId]);


    const loadHomework = async () => {

        try {

            setLoading(true);

            const response =
                await homeworkSubmissionApi.getById(
                    homeworkId
                );

            console.log(
                "Homework Update Response:",
                response
            );

            const data =
                response?.data?.data;

            setHomework(
                data?.homework || null
            );

            const studentList =
                Array.isArray(data?.students)
                    ? data.students
                    : [];

            setStudents(studentList);


            /*
            |--------------------------------------------------------------------------
            | Initialize Checked Students
            |--------------------------------------------------------------------------
            */

            const checkedMap = {};

            studentList.forEach((student) => {

                checkedMap[student.student_id] =
                    Boolean(student.checked);

            });

            setSelectedStudents(checkedMap);

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

            setHomework(null);
            setStudents([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Checkbox Change
    |--------------------------------------------------------------------------
    */

const handleCheckboxChange = (
    student,
    checked
) => {

    setSelectedStudents((previous) => ({
        ...previous,
        [student.student_id]: checked,
    }));

};


    /*
    |--------------------------------------------------------------------------
    | Save Checked Status
    |--------------------------------------------------------------------------
    */

const handleSave = async () => {

    try {

        setSaving(true);

        const requests = [];

        for (const student of students) {

            const currentChecked =
                Boolean(
                    selectedStudents[
                        student.student_id
                    ]
                );

            const originalChecked =
                Boolean(student.checked);

            /*
            |--------------------------------------------------------------------------
            | Only update students whose checkbox changed
            |--------------------------------------------------------------------------
            */

            if (
                currentChecked !== originalChecked
            ) {

                requests.push(
                    homeworkSubmissionApi.updateStudentStatus(
                        homeworkId,
                        student.student_id,
                        currentChecked
                    )
                );

            }

        }


        if (requests.length === 0) {

            alert(
                "No submission status changes to save."
            );

            return;

        }


        await Promise.all(requests);


        /*
        |--------------------------------------------------------------------------
        | Reload latest data
        |--------------------------------------------------------------------------
        */

        await loadHomework();

    }
    catch (error) {

        console.error(
            "Unable to update submission status:",
            error
        );

        console.error(
            "Backend Error:",
            error.response?.data
        );

        alert(
            error.response?.data?.message ||
            "Unable to update submission status."
        );

    }
    finally {

        setSaving(false);

    }

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

        const parsedDate =
            new Date(date);

        if (
            isNaN(
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
                />

                <p className="text-gray-500">
                    Loading homework details...
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

                <h2
                    className="
                        text-xl
                        font-bold
                        text-gray-800
                    "
                >
                    Homework not found
                </h2>

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
                        rounded-lg
                        bg-[#610e1e]
                        text-white
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
                                Update Homework Submissions
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Verify and update student submission status.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Save */}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-6
                        py-2.5
                        rounded-lg
                        bg-[#610e1e]
                        hover:bg-[#4b0b18]
                        text-white
                        font-semibold
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >

                    <FaSave />

                    {saving
                        ? "Saving..."
                        : "Save Changes"
                    }

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
                        items-center
                        gap-3
                        mb-5
                    "
                >

                    <FaBook
                        className="
                            text-[#610e1e]
                        "
                    />

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        Homework Details
                    </h2>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                    "
                >

                    <Detail
                        label="Title"
                        value={
                            homework.title || "-"
                        }
                    />

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


                {/* Description */}

                {homework.description && (

                    <div
                        className="
                            mt-5
                            p-4
                            bg-gray-50
                            rounded-lg
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-gray-500
                                mb-1
                            "
                        >
                            Description
                        </p>

                        <p
                            className="
                                text-sm
                                text-gray-700
                                whitespace-pre-wrap
                            "
                        >
                            {homework.description}
                        </p>

                    </div>

                )}


                {/* Homework Attachment */}

                {(
                    homework.attachment_path ||
                    homework.attachment
                ) && (

                    <div className="mt-5">

                        <a
                            href={
                                homework.attachment_path ||
                                homework.attachment
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-[#610e1e]
                                hover:underline
                            "
                        >

                            <FaPaperclip />

                            View Homework Attachment

                        </a>

                    </div>

                )}

            </div>


            {/* =========================================================
                STUDENT LIST
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
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-3
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
                            Assigned Students
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                mt-1
                            "
                        >
                            Check the students whose submitted homework
                            has been verified.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            text-sm
                        "
                    >

                        <span>
                            Total:
                            <strong className="ml-1">
                                {students.length}
                            </strong>
                        </span>

                        <span className="text-green-700">
                            Submitted:
                            <strong className="ml-1">
                                {
                                    students.filter(
                                        student =>
                                            student.submitted
                                    ).length
                                }
                            </strong>
                        </span>

                    </div>

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

                                <th className="px-4 py-3 text-center">
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
                                    Attachment
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Checked
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

                                        <FaUserGraduate
                                            className="
                                                mx-auto
                                                text-3xl
                                                text-gray-300
                                                mb-3
                                            "
                                        />

                                        No students assigned to this homework.

                                    </td>

                                </tr>

                            ) : (

                                students.map(
                                    (student, index) => {

                                        const isSubmitted =
                                            Boolean(
                                                student.submitted
                                            );

                                        const isChecked =
                                            Boolean(
                                                selectedStudents[
                                                    student.student_id
                                                ]
                                            );


                                        return (

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

                                                {/* Number */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-3
                                                        text-center
                                                    "
                                                >
                                                    {index + 1}
                                                </td>


                                                {/* Student */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-3
                                                    "
                                                >

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

                                                <td
                                                    className="
                                                        px-4
                                                        py-3
                                                    "
                                                >

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

                                                    {isSubmitted ? (

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
                                                                px-3
                                                                py-1
                                                                rounded-full
                                                                bg-gray-100
                                                                text-gray-500
                                                                text-xs
                                                                font-semibold
                                                            "
                                                        >

                                                            Not Submitted

                                                        </span>

                                                    )}

                                                </td>


                                                {/* Date */}

                                                <td
                                                    className="
                                                        px-4
                                                        py-3
                                                    "
                                                >

                                                    {
                                                        formatDate(
                                                            student.submission_date
                                                        )
                                                    }

                                                </td>


                                                {/* Attachment */}
                                                <td className=" px-4 py-3 text-center " > 
                                                    {student.attachment_path ? (

                                                        <a href={ student.attachment_path } target="_blank" rel="noreferrer" className=" inline-flex items-center gap-1 text-[#610e1e] hover:underline font-medium " > 
                                                            <FaPaperclip />
                                                            View
                                                        </a>

                                                    ) : (

                                                        <span className="text-gray-400">
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* Checkbox */}

                                                <td className=" px-4 py-3 text-center " > 
                                                    <label className=" inline-flex items-center gap-2 cursor-pointer " > 
                                                        <input type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange( student, e.target.checked ) } className=" w-5 h-5 accent-[#610e1e] cursor-pointer " /> 
                                                        <span className=" text-xs font-medium text-gray-600 " > 
                                                            {isChecked
                                                                ? "Submitted"
                                                                : "Mark Submitted"
                                                            }

                                                        </span>

                                                    </label>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =========================================================
                BOTTOM SAVE
            ========================================================= */}

            <div
                className="
                    flex
                    justify-end
                    gap-3
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    p-4
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/homework-assignment/submissions/${homeworkId}/track`
                        )
                    }
                    className="
                        px-5
                        py-2.5
                        rounded-lg
                        border
                        border-gray-300
                        text-gray-700
                        font-semibold
                        hover:bg-gray-50
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-6
                        py-2.5
                        rounded-lg
                        bg-[#610e1e]
                        hover:bg-[#4b0b18]
                        text-white
                        font-semibold
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >

                    <FaSave />

                    {saving
                        ? "Saving..."
                        : "Save Changes"
                    }

                </button>

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
                p-4
            "
        >

            <p
                className="
                    text-xs
                    text-gray-500
                    mb-1
                "
            >
                {label}
            </p>

            <p
                className="
                    text-sm
                    font-semibold
                    text-gray-800
                "
            >
                {value}
            </p>

        </div>

    );

}