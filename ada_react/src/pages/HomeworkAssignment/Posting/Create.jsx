import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import homeworkAssignmentApi from "../../../services/homeworkAssignmentApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";
import subjectApi from "../../../services/subjectApi";

import HomeworkForm from "../../../components/HomeworkAssignment/HomeworkForm";

export default function Create() {

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [attachments, setAttachments] = useState([]);

    const [formData, setFormData] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        subject_id: "",

        homework_type: "",

        title: "",

        description: "",

        assigned_date: new Date()
            .toISOString()
            .split("T")[0],

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

        fetchInitialData();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Fetch Academic Years, Classes and Subjects
    |--------------------------------------------------------------------------
    */

    const fetchInitialData = async () => {

        try {

            setLoading(true);

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

        }
        catch (error) {

            console.error(
                "Error fetching homework form data:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Sections When Class Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (formData.class_id) {

            fetchSections(formData.class_id);

        }
        else {

            setSections([]);

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
                await sectionApi.getByClass(classId);

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
    | Submit Homework
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

            alert("Please select Academic Year.");

            return;
        }

        if (!formData.class_id) {

            alert("Please select Class.");

            return;
        }

        if (!formData.section_id) {

            alert("Please select Section.");

            return;
        }

        if (!formData.subject_id) {

            alert("Please select Subject.");

            return;
        }

        if (!formData.homework_type) {

            alert("Please select Homework Type.");

            return;
        }

        if (!formData.title.trim()) {

            alert("Please enter Homework Title.");

            return;
        }

        if (!formData.description.trim()) {

            alert("Please enter Homework Description.");

            return;
        }

        if (!formData.due_date) {

            alert("Please select Due Date.");

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
        */

        attachments.forEach((file) => {

            data.append(
                "attachments[]",
                file
            );

        });


        /*
        |--------------------------------------------------------------------------
        | Send Request
        |--------------------------------------------------------------------------
        */

        try {

            setLoading(true);

            console.log(
                "Creating Homework..."
            );

            console.log(
                "Homework Form Data:",
                formData
            );

            const response =
                await homeworkAssignmentApi.create(data);

            console.log(
                "Homework Create Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | Success
            |--------------------------------------------------------------------------
            */

            if (
                response?.data?.status === false
            ) {

                alert(
                    response.data.message ||
                    "Failed to create homework."
                );

                return;
            }

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
                "Homework creation error:",
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
                "Failed to create homework.";

            alert(message);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">

                        Create Homework

                    </h1>

                    <p className="text-sm text-gray-500 mt-1">

                        Post homework or assignments for students.

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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

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

                    isEdit={false}

                />

            </div>

        </div>

    );

}