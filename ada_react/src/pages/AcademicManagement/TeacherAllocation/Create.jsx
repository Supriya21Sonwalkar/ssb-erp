import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TeacherAllocationForm from "../../../components/TeacherAllocation/TeacherAllocationForm";

import teacherAllocationApi from "../../../services/teacherAllocationApi";

import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";

export default function Create() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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

    /**
     * Load Dropdown Data
     */
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

            console.log('Academic Years Response:', academicYearRes);
            console.log('Academic Years Data:', academicYearRes.data?.data ?? academicYearRes.data);

            setClasses(
                classRes.data?.data ?? classRes.data ?? []
            );

            setTeachers(
                teacherRes.data?.data ?? teacherRes.data ?? []
            );

        } catch (error) {

            console.error(error);

        }

    };

    /**
     * Handle Input Change
     */
    const handleChange = async (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

        /**
         * Load Subjects when Class changes
         */

        if (name === "class_id") {

            try {

                const response =
                    await teacherAllocationApi.getSubjectsByClass(value);

                const data = response.data?.data ?? response.data ?? [];

                console.log('Subjects Response:', response);
                console.log('Subjects Data:', data);

                setSubjects(data);

                setFormData(prev => ({

                    ...prev,

                    class_id: value,

                    subjects: [],

                }));

            } catch (error) {

                console.error(error);

            }

        }

    };

    /**
     * Checkbox Selection
     */
    const handleSubjectChange = (subjectId) => {

        setFormData((prev) => {

            const exists =
                prev.subjects.includes(subjectId);

            return {

                ...prev,

                subjects: exists

                    ? prev.subjects.filter(id => id !== subjectId)

                    : [...prev.subjects, subjectId]

            };

        });

    };

    /**
     * Save
     */
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await teacherAllocationApi.create(formData);

            navigate("/academic-management/teacher-allocations");

        } catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to save Teacher Allocation."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">

                    Teacher Allocation

                </h1>

                <p className="text-gray-600 mt-2">

                    Assign Teachers to Class Subjects.

                </p>

            </div>

            <TeacherAllocationForm

                mode="create"

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