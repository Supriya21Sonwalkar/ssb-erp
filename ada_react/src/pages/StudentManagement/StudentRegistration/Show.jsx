import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import studentApi from "../../../services/studentApi";

export default function Show() {

    const { id } = useParams();

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadStudent();

    }, []);

    const loadStudent = async () => {

        try {

            const response = await studentApi.getById(id);

            setStudent(response.data.data);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load student.");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-10">

                Loading...

            </div>

        );

    }

    if (!student) {

        return (

            <div className="text-center py-10">

                Student not found.

            </div>

        );

    }

    const parent = student.parents?.[0] || {};

    return (

        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">

                        Student Profile

                    </h1>

                    <p className="text-gray-500">

                        View Student Information

                    </p>

                </div>

                <Link
                    to="/student-management/students"
                    className="bg-[#610e1e] text-white px-4 py-2 rounded hover:bg-[#4d0b18]"
                >
                    Back
                </Link>

            </div>

            {/* Profile */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="flex gap-6 items-center">

                    {student.photo ? (

                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/storage/${student.photo}`}
                            alt={student.full_name}
                            className="w-28 h-28 rounded-full border object-cover"
                        />

                    ) : (

                        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl">

                            👤

                        </div>

                    )}

                    <div>

                        <h2 className="text-2xl font-bold">

                            {student.full_name}

                        </h2>

                        <p>

                            Student Code :

                            <strong>

                                {" "}

                                {student.student_code}

                            </strong>

                        </p>

                        <p>

                            Admission No :

                            <strong>

                                {" "}

                                {student.admission_no}

                            </strong>

                        </p>

                    </div>

                </div>

            </div>

            {/* Student Information */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h3 className="text-xl font-bold text-[#610e1e] mb-4">

                    Student Details

                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <p><strong>Gender :</strong> {student.gender}</p>

                    <p><strong>DOB :</strong> {student.dob}</p>

                    <p><strong>Blood Group :</strong> {student.blood_group}</p>

                    <p><strong>Category :</strong> {student.category}</p>

                    <p><strong>Religion :</strong> {student.religion}</p>

                    <p><strong>Nationality :</strong> {student.nationality}</p>

                    <p><strong>Aadhaar :</strong> {student.aadhaar_number}</p>

                    <p><strong>APAAR :</strong> {student.apaar_id}</p>

                    <p><strong>PEN :</strong> {student.pen_number}</p>

                </div>

            </div>

            {/* Academic */}

            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <h3 className="text-xl font-bold text-[#610e1e] mb-4">

                    Academic Details

                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <p>

                        <strong>Academic Year :</strong>

                        {" "}

                        {student.academic_year?.academic_year}

                    </p>

                    <p>

                        <strong>Class :</strong>

                        {" "}

                        {student.class?.class_name}

                    </p>

                    <p>

                        <strong>Section :</strong>

                        {" "}

                        {student.section?.section_name}

                    </p>

                    <p>

                        <strong>Admission Date :</strong>

                        {" "}

                        {student.admission_date}

                    </p>

                </div>

            </div>

            {/* Parent */}

            <div className="bg-white rounded-xl shadow p-6">

                <h3 className="text-xl font-bold text-[#610e1e] mb-4">

                    Parent Details

                </h3>

                <div className="grid grid-cols-2 gap-4">

                    <p>

                        <strong>Father :</strong>

                        {" "}

                        {parent.father_name}

                    </p>

                    <p>

                        <strong>Father Mobile :</strong>

                        {" "}

                        {parent.father_mobile}

                    </p>

                    <p>

                        <strong>Mother :</strong>

                        {" "}

                        {parent.mother_name}

                    </p>

                    <p>

                        <strong>Mother Mobile :</strong>

                        {" "}

                        {parent.mother_mobile}

                    </p>

                    <p>

                        <strong>Guardian :</strong>

                        {" "}

                        {parent.guardian_name}

                    </p>

                    <p>

                        <strong>Guardian Mobile :</strong>

                        {" "}

                        {parent.guardian_mobile}

                    </p>

                </div>

            </div>

        </div>

    );

}