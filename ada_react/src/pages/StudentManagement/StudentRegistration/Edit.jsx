import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import studentApi from "../../../services/studentApi";

import StudentForm from "../../../components/Students/StudentForm";

export default function Edit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [dropdowns, setDropdowns] = useState({

        courses: [],
        academicYears: [],
        classes: [],
        sections: [],

    });

    const [filteredSections, setFilteredSections] = useState([]);

    const [formData, setFormData] = useState({

        /*
        |--------------------------------------------------------------------------
        | Admission
        |--------------------------------------------------------------------------
        */

        course_id: "",
        academic_year_id: "",
        class_id: "",
        section_id: "",
        admission_date: "",
        admission_type: "",

        /*
        |--------------------------------------------------------------------------
        | Student
        |--------------------------------------------------------------------------
        */

        first_name: "",
        middle_name: "",
        last_name: "",

        gender: "",
        dob: "",

        email: "",
        mobile: "",
        password: "",

        blood_group: "",
        category: "",
        caste: "",
        sub_caste: "",
        religion: "",
        nationality: "",
        mother_tongue: "",
        birth_place: "",
        house: "",

        aadhaar_number: "",
        apaar_id: "",
        pen_number: "",
        birth_certificate_no: "",

        previous_school: "",

        /*
        |--------------------------------------------------------------------------
        | Parent
        |--------------------------------------------------------------------------
        */

        father_name: "",
        father_mobile: "",
        father_email: "",
        father_occupation: "",
        father_income: "",

        mother_name: "",
        mother_mobile: "",
        mother_email: "",
        mother_occupation: "",
        mother_income: "",

        guardian_name: "",
        guardian_relation: "",
        guardian_mobile: "",

        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",

        /*
        |--------------------------------------------------------------------------
        | Other
        |--------------------------------------------------------------------------
        */

        transport_required: 0,
        hostel_required: 0,

        remarks: "",

        /*
        |--------------------------------------------------------------------------
        | Photo
        |--------------------------------------------------------------------------
        */

        photo: null,

    });

    useEffect(() => {

        loadDropdowns();

        loadStudent();

    }, []);

    useEffect(() => {

        if (formData.class_id) {

            loadSectionsByClass(formData.class_id);

        } else {

            setFilteredSections([]);

        }

    }, [formData.class_id]);

    const loadSectionsByClass = async (classId) => {

        try {

            const response = await studentApi.getSectionsByClass(classId);

            setFilteredSections(response.data.data ?? []);

        }

        catch (error) {

            console.error(error);

            setFilteredSections([]);

        }

    };

    const loadDropdowns = async () => {

        try {

            const response = await studentApi.getDropdowns();

            setDropdowns({

                courses: response.data.courses ?? [],
                academicYears: response.data.academicYears ?? [],

                classes: response.data.classes ?? [],

                sections: response.data.sections ?? [],

            });

        }

        catch (error) {

            console.error(error);

        }

    };

    const loadStudent = async () => {

        try {

            const response = await studentApi.getById(id);

            const student = response.data.data;

            const parent = student.parents?.[0] || {};

            setFormData({

                course_id: student.course_id || "",
                academic_year_id: student.academic_year_id || "",

                class_id: student.class_id || "",

                section_id: student.section_id || "",

                admission_date: student.admission_date || "",

                admission_type: student.admission_type || "",

                first_name: student.first_name || "",

                middle_name: student.middle_name || "",

                last_name: student.last_name || "",

                gender: student.gender || "",

                dob: student.dob || "",

                email: student.email || "",

                mobile: student.mobile || "",

                password: "",

                blood_group: student.blood_group || "",

                category: student.category || "",

                caste: student.caste || "",

                sub_caste: student.sub_caste || "",

                religion: student.religion || "",

                nationality: student.nationality || "",

                mother_tongue: student.mother_tongue || "",

                birth_place: student.birth_place || "",

                house: student.house || "",

                aadhaar_number: student.aadhaar_number || "",

                apaar_id: student.apaar_id || "",

                pen_number: student.pen_number || "",

                birth_certificate_no: student.birth_certificate_no || "",

                previous_school: student.previous_school || "",

                father_name: parent.father_name || "",

                father_mobile: parent.father_mobile || "",

                father_email: parent.father_email || "",

                father_occupation: parent.father_occupation || "",

                father_income: parent.father_income || "",

                mother_name: parent.mother_name || "",

                mother_mobile: parent.mother_mobile || "",

                mother_email: parent.mother_email || "",

                mother_occupation: parent.mother_occupation || "",

                mother_income: parent.mother_income || "",

                guardian_name: parent.guardian_name || "",

                guardian_relation: parent.guardian_relation || "",

                guardian_mobile: parent.guardian_mobile || "",

                address: parent.address || "",

                city: parent.city || "",

                state: parent.state || "",

                country: parent.country || "",

                pincode: parent.pincode || "",

                transport_required: student.transport_required,

                hostel_required: student.hostel_required,

                remarks: student.remarks || "",

                photo: null,

            });

        }

        catch (error) {

            console.error(error);

            alert("Unable to load student.");

        }

    };

    const handleChange = (e) => {

        const { name, value, files, type, checked } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked ? 1 : 0

                    : type === "file"

                    ? files[0]

                    : value,

        }));

        if (name === 'class_id') {

            setFormData((prev) => ({

                ...prev,

                class_id: value,

                section_id: '',

            }));

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'documents' && Array.isArray(value)) {
                    value.forEach((doc, index) => {
                        if (doc && doc.file) {
                            payload.append(`documents[${index}][file]`, doc.file);
                            payload.append(`documents[${index}][document_name]`, doc.document_name || '');
                            payload.append(`documents[${index}][document_type]`, doc.document_type || 'other');
                            payload.append(`documents[${index}][quantity]`, doc.quantity || 1);
                        }
                    });
                } else if (value !== null && value !== undefined && value !== '') {
                    payload.append(key, value);
                }
            });

            const response = await studentApi.update(id, payload);

            alert(

                response.data.message ||

                "Student Updated Successfully."

            );

            navigate("/student-management/students");

        }

        catch (error) {

            console.error(error);

            if (error.response?.status === 422 && error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                alert(`Validation Errors:\n${errorMessages}`);
            } else {
                alert(
                    error.response?.data?.message ||
                    error.response?.data?.errors ||
                    "Unable to update student."
                );
            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">

                    Edit Student

                </h1>

                <p className="text-gray-600">

                    Update Student Information

                </p>

            </div>

            <StudentForm

                mode="edit"

                formData={formData}

                handleChange={handleChange}

                handleSubmit={handleSubmit}

                loading={loading}

                dropdowns={dropdowns}

                filteredSections={filteredSections}

            />

        </div>

    );

}