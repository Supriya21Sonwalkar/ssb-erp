import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TeacherAllocationForm from "../../../components/TeacherAllocation/TeacherAllocationForm";

import teacherAllocationApi from "../../../services/teacherAllocationApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";

export default function Edit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [academicYears, setAcademicYears] = useState([]);

    const [classes, setClasses] = useState([]);

    const [teachers, setTeachers] = useState([]);

    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({

        academic_year_id: "",

        class_id: "",

        employee_id: "",

        subjects: [],

    });

    useEffect(() => {

        loadDropdowns();

    }, []);

    const loadDropdowns = async () => {

        try {

            const [

                academicYearRes,

                classRes,

                teacherRes

            ] = await Promise.all([

                academicYearApi.getAll(),

                classApi.getAll(),

                teacherAllocationApi.getTeachers(),

            ]);

            setAcademicYears(
                academicYearRes.data?.data ?? academicYearRes.data ?? []
            );

            setClasses(
                classRes.data?.data ?? classRes.data ?? []
            );

            setTeachers(
                teacherRes.data?.data ?? teacherRes.data ?? []
            );

            await loadAllocation();

        } catch (error) {

            console.error(error);

        }

    };

    const loadAllocation = async () => {

        try {

            const response = await teacherAllocationApi.get(id);

            const allocation = response.data.data;

            const subjectResponse =
                await teacherAllocationApi.getSubjectsByClass(
                    allocation.class_id
                );

            setSubjects(subjectResponse.data.data ?? []);

            setFormData({

                academic_year_id:
                    allocation.academic_year_id,

                class_id:
                    allocation.class_id,

                employee_id:
                    allocation.employee_id,

                subjects:
                    allocation.subjects ?? [],

            });

        } catch (error) {

            console.error(error);

            alert("Unable to load Teacher Allocation.");

            navigate("/academic-management/teacher-allocations");

        } finally {

            setPageLoading(false);

        }

    };

    const handleChange = async (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

        if (name === "class_id") {

            try {

                const response =
                    await teacherAllocationApi.getSubjectsByClass(value);

                setSubjects(
                    response.data.data ?? []
                );

                setFormData((prev) => ({

                    ...prev,

                    class_id: value,

                    subjects: [],

                }));

            } catch (error) {

                console.error(error);

            }

        }

    };

    const handleSubjectChange = (subjectId) => {

        setFormData((prev) => {

            const exists =
                prev.subjects.includes(subjectId);

            return {

                ...prev,

                subjects: exists

                    ? prev.subjects.filter(
                        (id) => id !== subjectId
                    )

                    : [...prev.subjects, subjectId]

            };

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await teacherAllocationApi.update(
                id,
                formData
            );

            alert(
                "Teacher Allocation updated successfully."
            );

            navigate(
                "/academic-management/teacher-allocations"
            );

        } catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to update Teacher Allocation."

            );

        } finally {

            setLoading(false);

        }

    };

    if (pageLoading) {

        return (

            <div className="text-center py-10">

                Loading...

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">

                    Edit Teacher Allocation

                </h1>

                <p className="text-gray-600 mt-2">

                    Update Teacher Allocation.

                </p>

            </div>

            <TeacherAllocationForm

                mode="edit"

                formData={formData}

                handleChange={handleChange}

                handleSubjectChange={handleSubjectChange}

                handleSubmit={handleSubmit}

                loading={loading}

                academicYears={academicYears}

                classes={classes}

                teachers={teachers}

                subjects={subjects}

            />

        </div>

    );

}