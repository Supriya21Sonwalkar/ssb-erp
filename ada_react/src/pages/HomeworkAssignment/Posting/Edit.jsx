import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import homeworkAssignmentApi from "../../../services/homeworkAssignmentApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";
import subjectApi from "../../../services/subjectApi";

import HomeworkForm from "../../../components/HomeworkAssignment/HomeworkForm";

export default function Edit() {

    const navigate = useNavigate();

    const { id } = useParams();


    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [initialLoading, setInitialLoading] =
        useState(true);

    const [academicYears, setAcademicYears] =
        useState([]);

    const [classes, setClasses] =
        useState([]);

    const [sections, setSections] =
        useState([]);

    const [subjects, setSubjects] =
        useState([]);

    const [attachments, setAttachments] =
        useState([]);

    const [formData, setFormData] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        subject_id: "",

        homework_type: "",

        title: "",

        description: "",

        assigned_date: "",

        due_date: "",

        total_marks: "",

        allow_late_submission: "0",

        status: "Draft",

    });


    /*
    |--------------------------------------------------------------------------
    | Load Initial Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (id) {

            fetchInitialData();

        }

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | Fetch Academic Years, Classes, Subjects & Homework
    |--------------------------------------------------------------------------
    */

    const fetchInitialData = async () => {

        try {

            setInitialLoading(true);


            /*
            |--------------------------------------------------------------------------
            | Academic Years
            |--------------------------------------------------------------------------
            */

            const academicYearResponse =
                await academicYearApi.getAll();

            console.log(
                "Academic Year Response:",
                academicYearResponse
            );

            const academicYearData =
                academicYearResponse.data?.data ??
                academicYearResponse.data ??
                [];

            setAcademicYears(
                Array.isArray(academicYearData)
                    ? academicYearData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Classes
            |--------------------------------------------------------------------------
            */

            const classResponse =
                await classApi.getAll();

            console.log(
                "Class Response:",
                classResponse
            );

            const classData =
                classResponse.data?.data ??
                classResponse.data ??
                [];

            setClasses(
                Array.isArray(classData)
                    ? classData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Subjects
            |--------------------------------------------------------------------------
            */

            const subjectResponse =
                await subjectApi.getAll();

            console.log(
                "Subject Response:",
                subjectResponse
            );

            const subjectData =
                subjectResponse.data?.data ??
                subjectResponse.data ??
                [];

            setSubjects(
                Array.isArray(subjectData)
                    ? subjectData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Homework Details
            |--------------------------------------------------------------------------
            */

            const homeworkResponse =
                await homeworkAssignmentApi.getById(id);

            console.log(
                "Homework Edit Response:",
                homeworkResponse
            );

            const homework =
                homeworkResponse.data?.data ??
                homeworkResponse.data;

            if (!homework) {

                alert(
                    "Homework details not found."
                );

                navigate(
                    "/homework-assignment"
                );

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Set Form Data
            |--------------------------------------------------------------------------
            */

            setFormData({

                academic_year_id:
                    homework.academic_year_id
                    ?? "",

                class_id:
                    homework.class_id
                    ?? "",

                section_id:
                    homework.section_id
                    ?? "",

                subject_id:
                    homework.subject_id
                    ?? "",

                homework_type:
                    homework.homework_type
                    ?? "",

                title:
                    homework.title
                    ?? "",

                description:
                    homework.description
                    ?? "",

                assigned_date:
                    homework.assigned_date
                    ? String(
                        homework.assigned_date
                    ).split("T")[0]
                    : "",

                due_date:
                    homework.due_date
                    ? String(
                        homework.due_date
                    ).split("T")[0]
                    : "",

                total_marks:
                    homework.total_marks
                    ?? "",

                allow_late_submission:
                    String(
                        homework.allow_late_submission
                        ?? "0"
                    ),

                status:
                    homework.status
                    ?? "Draft",

            });


            /*
            |--------------------------------------------------------------------------
            | Existing Attachments
            |--------------------------------------------------------------------------
            */

            if (
                Array.isArray(
                    homework.attachments
                )
            ) {

                setAttachments(
                    homework.attachments
                );

            }
            else {

                setAttachments([]);

            }


            /*
            |--------------------------------------------------------------------------
            | Load Sections
            |--------------------------------------------------------------------------
            */

            if (homework.class_id) {

                await fetchSections(
                    homework.class_id
                );

            }

        }
        catch (error) {

            console.error(
                "Error fetching homework edit data:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load homework details."
            );

            navigate(
                "/homework-assignment"
            );

        }
        finally {

            setInitialLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Sections When Class Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        /*
        | Don't reload sections during initial
        | homework loading if class is already handled
        | by fetchInitialData().
        */

        if (
            formData.class_id &&
            !initialLoading
        ) {

            fetchSections(
                formData.class_id
            );

        }

    }, [formData.class_id]);


    /*
    |--------------------------------------------------------------------------
    | Fetch Sections
    |--------------------------------------------------------------------------
    */

    const fetchSections = async (classId) => {

        try {

            const response =
                await sectionApi.getByClass(
                    classId
                );

            console.log(
                "Section Response:",
                response
            );

            const sectionData =
                response.data?.data ??
                response.data ??
                [];

            setSections(
                Array.isArray(sectionData)
                    ? sectionData
                    : []
            );

        }
        catch (error) {

            console.error(
                "Error fetching sections:",
                error
            );

            setSections([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Handle Form Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();


        /*
        |--------------------------------------------------------------------------
        | Basic Validation
        |--------------------------------------------------------------------------
        */

        if (!formData.academic_year_id) {

            alert(
                "Please select Academic Year."
            );

            return;

        }


        if (!formData.class_id) {

            alert(
                "Please select Class."
            );

            return;

        }


        if (!formData.section_id) {

            alert(
                "Please select Section."
            );

            return;

        }


        if (!formData.subject_id) {

            alert(
                "Please select Subject."
            );

            return;

        }


        if (!formData.homework_type) {

            alert(
                "Please select Homework Type."
            );

            return;

        }


        if (!formData.title.trim()) {

            alert(
                "Please enter Homework Title."
            );

            return;

        }


        if (!formData.description.trim()) {

            alert(
                "Please enter Homework Description."
            );

            return;

        }


        if (!formData.due_date) {

            alert(
                "Please select Due Date."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Check Date
        |--------------------------------------------------------------------------
        */

        if (
            formData.due_date <
            formData.assigned_date
        ) {

            alert(
                "Due Date cannot be earlier than Assigned Date."
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Create FormData
        |--------------------------------------------------------------------------
        */

        const data = new FormData();


        data.append(
            "academic_year_id",
            formData.academic_year_id
        );


        data.append(
            "class_id",
            formData.class_id
        );


        data.append(
            "section_id",
            formData.section_id
        );


        data.append(
            "subject_id",
            formData.subject_id
        );


        data.append(
            "homework_type",
            formData.homework_type
        );


        data.append(
            "title",
            formData.title
        );


        data.append(
            "description",
            formData.description
        );


        data.append(
            "assigned_date",
            formData.assigned_date
        );


        data.append(
            "due_date",
            formData.due_date
        );


        data.append(
            "total_marks",
            formData.total_marks || ""
        );


        data.append(
            "allow_late_submission",
            formData.allow_late_submission
        );


        data.append(
            "status",
            formData.status
        );


        /*
        |--------------------------------------------------------------------------
        | Attachments
        |--------------------------------------------------------------------------
        |
        | Only append actual File objects.
        | Existing attachment records should not be
        | uploaded again.
        |
        */

        attachments.forEach((file) => {

            if (file instanceof File) {

                data.append(
                    "attachments[]",
                    file
                );

            }

        });


        /*
        |--------------------------------------------------------------------------
        | Update Homework
        |--------------------------------------------------------------------------
        */

        try {

            setLoading(true);


            console.log(
                "Updating Homework..."
            );

            console.log(
                "Homework ID:",
                id
            );

            console.log(
                "Homework Form Data:",
                formData
            );


            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |--------------------------------------------------------------------------
            | This uses homeworkAssignmentApi.update()
            |--------------------------------------------------------------------------
            */

            const response =
                await homeworkAssignmentApi.update(
                    id,
                    data
                );


            console.log(
                "Homework Update Response:",
                response
            );


            if (
                response?.data?.status === false
            ) {

                alert(
                    response.data.message ||
                    "Failed to update homework."
                );

                return;

            }


            alert(
                response?.data?.message ||
                "Homework updated successfully."
            );


            /*
            |--------------------------------------------------------------------------
            | Redirect to Index
            |--------------------------------------------------------------------------
            */

            navigate(
                "/homework-assignment"
            );

        }
        catch (error) {

            console.error(
                "Homework update error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );


            const message =
                error.response?.data?.message ||
                "Failed to update homework.";

            alert(message);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Initial Loading Screen
    |--------------------------------------------------------------------------
    */

    if (initialLoading) {

        return (

            <div className="
                min-h-[400px]
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        w-10
                        h-10
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
                        font-medium
                    ">
                        Loading homework...
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

        <div className="space-y-6">


            {/* Header */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-[#610e1e]
                    ">
                        Edit Homework
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Update homework or assignment details.
                    </p>

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
                        px-4
                        py-2
                        border
                        border-[#610e1e]
                        text-[#610e1e]
                        rounded-lg
                        hover:bg-[#610e1e]
                        hover:text-white
                        transition
                        font-semibold
                    "
                >
                    ← Back
                </button>

            </div>


            {/* Form Card */}

            <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                p-6
            ">

                <HomeworkForm

                    formData={formData}

                    setFormData={setFormData}

                    academicYears={academicYears}

                    classes={classes}

                    sections={sections}

                    subjects={subjects}

                    attachments={attachments}

                    setAttachments={setAttachments}

                    onSubmit={handleSubmit}

                    loading={loading}

                    isEdit={true}

                />

            </div>

        </div>

    );

}