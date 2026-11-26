import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import EmployeeForm from "../../components/employees/EmployeeForm";

import employeeApi from "../../services/employeeApi";
import branchApi from "../../services/branchApi";
import { getDepartments } from "../../services/departmentApi";
import { getDesignations } from "../../services/designationApi";

export default function Edit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);

   const [formData, setFormData] = useState({

    employee_code: "",

    aadhaar_number: "",
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

    // Personal Information
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

    // Employment Information
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

    salary: "",

    // Bank Details
    bank_name: "",
    branch_name: "",
    account_number: "",
    bank_account_name: "",
    ifsc_code: "",

    // Education
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
    reference: "",

    // Login
    username: "",
    role_id: "",
    password: "",

    active: 1,

    // Documents
    profile_photo: null,
    pan_card_photo: null,
    aadhaar_card_photo: null,
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

        loadData();

    }, []);

    const loadData = async () => {

        try {

            setPageLoading(true);

            const [

                employeeRes,

                rolesRes,

                branchesRes,

                departmentsRes,

                designationsRes,

                employeesRes,

            ] = await Promise.all([

                employeeApi.getById(id),

                employeeApi.getRoles(),

                branchApi.getAll(),

                getDepartments(),

                getDesignations(),

                employeeApi.getEmployeeList(),

            ]);

            const employee = employeeRes.data.employee;
            console.log("EMPLOYEE DEPARTMENT ID:", employee.department_id);
            console.log("EMPLOYEE DESIGNATION ID:", employee.designation_id);

            console.log("DEPARTMENT API RESPONSE:", departmentsRes.data);
            console.log("DESIGNATION API RESPONSE:", designationsRes.data);

            setRoles(
                Array.isArray(rolesRes.data?.data)
                    ? rolesRes.data.data
                    : Array.isArray(rolesRes.data)
                    ? rolesRes.data
                    : []
            );

            setBranches(
                Array.isArray(branchesRes.data?.data)
                    ? branchesRes.data.data
                    : Array.isArray(branchesRes.data)
                    ? branchesRes.data
                    : []
            );

setDepartments(
    Array.isArray(departmentsRes)
        ? departmentsRes
        : Array.isArray(departmentsRes?.data)
        ? departmentsRes.data
        : Array.isArray(departmentsRes?.departments)
        ? departmentsRes.departments
        : []
);

setDesignations(
    Array.isArray(designationsRes)
        ? designationsRes
        : Array.isArray(designationsRes?.data)
        ? designationsRes.data
        : Array.isArray(designationsRes?.designations)
        ? designationsRes.designations
        : []
);



            setEmployees(
                Array.isArray(employeesRes.data?.data)
                    ? employeesRes.data.data
                    : Array.isArray(employeesRes.data)
                    ? employeesRes.data
                    : []
            );

            setFormData({

                employee_code: employee.employee_code || "",

                aadhaar_number: employee.aadhaar_number || "",
                pan_number: employee.pan_number || "",

                email: employee.email || "",
                mobile: employee.phone_number || "",
                whatsapp_number: employee.whatsapp_number || "",

                // Emergency Contact 1
                emergency_contact_1_name: employee.emergency_contact_1_name || "",
                emergency_contact_1_relation: employee.emergency_contact_1_relation || "",
                emergency_contact_1_place: employee.emergency_contact_1_place || "",
                emergency_contact_1_phone: employee.emergency_contact_1_phone || "",

                // Emergency Contact 2
                emergency_contact_2_name: employee.emergency_contact_2_name || "",
                emergency_contact_2_relation: employee.emergency_contact_2_relation || "",
                emergency_contact_2_place: employee.emergency_contact_2_place || "",
                emergency_contact_2_phone: employee.emergency_contact_2_phone || "",

                // Personal Information
                first_name: employee.first_name || "",
                middle_name: employee.middle_name || "",
                last_name: employee.last_name || "",

                gender: employee.gender || "",
                dob: employee.dob ? employee.dob.substring(0, 10) : "", 
                marital_status: employee.marital_status || "",

                religion: employee.religion || "",
                caste: employee.caste || "",
                sub_caste: employee.sub_caste || "",

                present_address: employee.present_address || "",
                permanent_address: employee.permanent_address || "",

                // Employment Information
                branch_id: employee.branch_id || "",
                
                department_id: employee.department_id ? String(employee.department_id) : "", 
                designation_id: employee.designation_id ? String(employee.designation_id) : "", 

                employee_type: employee.employee_type || "",

                joining_date: employee.joining_date ? employee.joining_date.substring(0, 10) : "", 
                last_working_date: employee.last_working_date ? employee.last_working_date.substring(0, 10) : "",

                shift: employee.shift || "",

                start_time: employee.start_time? employee.start_time.substring(0, 5): "",
                end_time: employee.end_time? employee.end_time.substring(0, 5): "",

                reporting_id: employee.reporting_id || "",
                buddy_id: employee.buddy_id || "",

                salary: employee.salary_scale || "",

                // Bank Details
                bank_name: employee.bank_name || "",
                branch_name: employee.branch_name || "",
                account_number: employee.bank_account_number || "",
                bank_account_name: employee.bank_account_name || "",
                ifsc_code: employee.ifsc_code || "",

                // Education
                qualification: employee.qualification || "",
                teaching_subject: employee.teaching_subject || "",

                // Std 10
                board_10th: employee.board_10th || "",
                year_pass_10th: employee.year_pass_10th || "",
                percentage_10th: employee.percentage_10th || "",

                // Std 12
                board_12th: employee.board_12th || "",
                year_pass_12th: employee.year_pass_12th || "",
                percentage_12th: employee.percentage_12th || "",

                // Graduate
                board_graduate: employee.board_graduate || "",
                year_pass_graduate: employee.year_pass_graduate || "",
                percentage_graduate: employee.percentage_graduate || "",

                // Post Graduate
                board_post_graduate: employee.board_post_graduate || "",
                year_pass_post_graduate: employee.year_pass_post_graduate || "",
                percentage_post_graduate: employee.percentage_post_graduate || "",

                // Experience
                experience: employee.experience_duration || "",
                last_salary: employee.experience_last_salary || "",
                reference: employee.reference || "",

                // Login
                username: employee.username || "",
                role_id: employee.role_id || "",

                active: employee.active ? 1 : 0,

                // Documents
                // Keep these NULL on edit.
                // If user selects a new file, handleChange will replace the value.
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

        } catch (error) {

            console.error(error);

            alert("Unable to load employee.");

            navigate("/configuration/employees");

        } finally {

            setPageLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name, value, files, type } = e.target;

        setFormData(prev => ({

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

                if (
                    formData[key] !== null &&
                    formData[key] !== undefined
                ) {
                    payload.append(key, formData[key]);
                }

            });

            const response = await employeeApi.update(id, payload);

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

                alert(

                    error.response?.data?.message ||

                    "Unable to update employee."

                );

            }

        } finally {

            setLoading(false);

        }

    };

    if (pageLoading) {

        return (

            <div className="flex justify-center items-center h-96">

                <div className="text-center">

                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#610e1e] mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading Employee...
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">

                    Edit Employee

                </h1>

                <p className="text-gray-600 mt-2">

                    Update employee information.

                </p>

            </div>

            <EmployeeForm

                mode="edit"

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