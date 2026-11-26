import { useEffect, useState } from "react";

import { getDepartments } from "../../services/departmentApi";
import { getDesignations } from "../../services/designationApi";
import branchApi from "../../services/branchApi";
import { useLocation, useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/employees/EmployeeForm";
import employeeApi from "../../services/employeeApi";

export default function Create() {

    const navigate = useNavigate();
    const location = useLocation();

    const aadhaarNumber = location.state?.aadhaarNumber || "";

    const [loading, setLoading] = useState(false);

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
   
    const [formData, setFormData] = useState({

        employee_code: "",

        // Basic & Personal
        aadhaar_number: aadhaarNumber,
        pan_number: "",

        email: "",
        mobile: "",
        whatsapp_number: "",

        // Emergency Contact 1
        emergency_contact_1_name: "",
        emergency_contact_1_relation: "",
        emergency_contact_1_place: "",
        emergency_contact_1_phone: "",

        // Emergency Contact 2
        emergency_contact_2_name: "",
        emergency_contact_2_relation: "",
        emergency_contact_2_place: "",
        emergency_contact_2_phone: "",

        first_name: "",
        middle_name: "",
        last_name: "",

        gender: "",
        dob: "",
        marital_status: "",

        religion: "",
        caste: "",
        sub_caste: "",

        present_address: "",
        permanent_address: "",


        // Employment
        branch_id: "",
        department_id: "",
        designation_id: "",

        employee_type: "",

        joining_date: "",
        last_working_date: "",

        shift: "",
        start_time: "",
        end_time: "",

        reporting_id: "",
        buddy_id: "",


        // Salary
        salary: "",


        // Bank, ID & Other Details
        bank_name: "",
        branch_name: "",
        bank_account_name: "",
        account_number: "",
        ifsc_code: "",

        reference: "",


        // Qualification & Education

        qualification: "",
        teaching_subject: "",

        // Std 10
        board_10th: "",
        year_pass_10th: "",
        percentage_10th: "",

        // Std 12
        board_12th: "",
        year_pass_12th: "",
        percentage_12th: "",

        // Graduate
        board_graduate: "",
        year_pass_graduate: "",
        percentage_graduate: "",

        // Post Graduate
        board_post_graduate: "",
        year_pass_post_graduate: "",
        percentage_post_graduate: "",

        // Experience
        experience: "",
        last_salary: "",


        // Login
        username: "",
        role_id: "",
        password: "",

        active: 1,


        // Documents
        profile_photo: null,
        aadhaar_card_photo: null,
        pan_card_photo: null,
        signature: null,

        bank_details_document: null,
        driving_license_document: null,
        marksheet_10th: null,
        marksheet_12th: null,
        graduation_certificate: null,
        post_graduation_certificate: null,
        policy_document: null,
        other_documents: null,

    });

    useEffect(() => {

        if (!aadhaarNumber) {
            navigate("/configuration/employees/search", { replace: true });
        }

    }, [aadhaarNumber, navigate]);

    useEffect(() => {

        loadDropdowns();

    }, []);

    const loadDropdowns = async () => {

        try {

            const [
                rolesRes,
                branchesRes,
                departmentsRes,
                designationsRes,
                employeesRes,
            ] = await Promise.all([
                employeeApi.getRoles(),
                branchApi.getAll(),
                getDepartments(),
                getDesignations(),
                employeeApi.getEmployeeList(),
            ]);

            setRoles(rolesRes.data.data ?? rolesRes.data);

            setBranches(branchesRes.data?.data ?? branchesRes.data ?? []);
            setDepartments(departmentsRes ?? []);
            setDesignations(designationsRes ?? []);
            setEmployees(employeesRes.data.data ?? employeesRes.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        const { name, value, files, type } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "file"
                    ? files[0]
                    : value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const payload = new FormData();

            Object.keys(formData).forEach((key) => {

                const value = formData[key];

                if (
                    value !== null &&
                    value !== undefined
                ) {
                    payload.append(key, value);
                }

            });

            const response = await employeeApi.create(payload);

            navigate("/configuration/employees");

        } catch (error) {

            console.error(error);

            if (error.response?.data?.errors) {

                alert(
                    Object.values(error.response.data.errors)
                        .flat()
                        .join("\n")
                );

            } else {

                const serverError = error.response?.data?.error;
                const serverMessage = error.response?.data?.message;
                const fallback = "Unable to create employee.";

                let msg = serverMessage || fallback;
                if (serverError && serverError !== serverMessage) {
                    msg = `${msg}\n\nDetails: ${serverError}`;
                }

                alert(msg);

            }

        } finally {

            setLoading(false);

        }

    };

    if (!aadhaarNumber) {
        return null;
    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">
                    Create Employee
                </h1>

                <p className="text-gray-600 mt-2">
                    Fill the employee details below.
                </p>

            </div>

            <EmployeeForm
                mode="create"
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                roles={roles}
                branches={branches}
                departments={departments}
                designations={designations}
                employees={employees}
            />

        </div>

    );

}