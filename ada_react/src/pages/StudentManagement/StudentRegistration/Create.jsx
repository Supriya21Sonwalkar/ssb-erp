import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentApi from "../../../services/studentApi";

import StudentForm from "../../../components/Students/StudentForm";

export default function Create() {

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
        | Admission Details
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
        | Student Details
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

        nationality: "Indian",

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
        | Parent Details
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

        country: "India",

        pincode: "",

        /*
        |--------------------------------------------------------------------------
        | Hostel / Transport
        |--------------------------------------------------------------------------
        */

        transport_required: 0,

        hostel_required: 0,

        remarks: "",

        /*
        |--------------------------------------------------------------------------
        | Uploads
        |--------------------------------------------------------------------------
        */

        photo: null,

        documents: [],

    });

    useEffect(() => {

        loadDropdowns();

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
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (name.startsWith('documents[')) {
            const match = name.match(/documents\[(\d+)\]\[file\]/);
            if (match) {
                const index = parseInt(match[1]);
                const documentMetadata = {
                    0: { document_name: 'Passport Size Photos', document_type: 'photo', quantity: 10 },
                    1: { document_name: 'Aadhar Card (Original)', document_type: 'id_proof', quantity: 1 },
                    2: { document_name: 'Aadhar Card (Copy)', document_type: 'id_proof', quantity: 5 },
                    3: { document_name: 'Birth Certificate (Original)', document_type: 'birth_certificate', quantity: 1 },
                    4: { document_name: 'Birth Certificate (Copy)', document_type: 'birth_certificate', quantity: 2 },
                    5: { document_name: 'TC/SLC (Original)', document_type: 'transfer_certificate', quantity: 1 },
                    6: { document_name: 'TC/SLC (Copy)', document_type: 'transfer_certificate', quantity: 2 },
                    7: { document_name: 'Caste Certificate (Original)', document_type: 'caste_certificate', quantity: 1 },
                    8: { document_name: 'Caste Certificate (Copy)', document_type: 'caste_certificate', quantity: 2 },
                    9: { document_name: 'Income Certificate (Original)', document_type: 'income_certificate', quantity: 1 },
                    10: { document_name: 'Income Certificate (Copy)', document_type: 'income_certificate', quantity: 2 },
                    11: { document_name: 'Ration Card (Original)', document_type: 'ration_card', quantity: 1 },
                    12: { document_name: 'Ration Card (Copy)', document_type: 'ration_card', quantity: 2 },
                    13: { document_name: 'Voter ID (Original)', document_type: 'voter_id', quantity: 1 },
                    14: { document_name: 'Voter ID (Copy)', document_type: 'voter_id', quantity: 2 },
                    15: { document_name: 'PAN Card (Original)', document_type: 'pan_card', quantity: 1 },
                    16: { document_name: 'PAN Card (Copy)', document_type: 'pan_card', quantity: 2 },
                    17: { document_name: 'Bank Passbook', document_type: 'bank_passbook', quantity: 1 },
                };
                setFormData((prev) => {
                    const newDocuments = [...(prev.documents || [])];
                    newDocuments[index] = {
                        ...newDocuments[index],
                        file: files[0],
                        ...documentMetadata[index]
                    };
                    return {
                        ...prev,
                        documents: newDocuments
                    };
                });
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : type === "file" ? files[0] : value,
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

            const response = await studentApi.create(payload);

            navigate("/student-management/students");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                alert(Object.values(error.response.data.errors).flat().join("\n"));
            } else {
                alert(error.response?.data?.message || "Unable to register student.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">

                    Student Registration

                </h1>

                <p className="text-gray-500 mt-2">

                    Register a new student into the ERP.

                </p>

            </div>

            <StudentForm

                mode="create"

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