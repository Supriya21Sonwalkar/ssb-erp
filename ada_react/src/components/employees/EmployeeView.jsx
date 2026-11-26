import { Link } from "react-router-dom";

export default function EmployeeView({ employee }) {

    const fullName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    return (

        <div className="max-w-7xl mx-auto space-y-5">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Employee Details
                    </h1>

                    <p className="text-sm text-gray-500">
                        View employee information
                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        to="/configuration/employees"
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Back
                    </Link>

                    <Link
                        to={`/configuration/employees/${employee.id}/edit`}
                        className="px-4 py-2 bg-[#610e1e] text-white rounded-lg hover:bg-[#4d0b18]"
                    >
                        Edit
                    </Link>

                </div>

            </div>

            {/* Profile Card */}

            <div className="bg-white rounded-xl shadow border">

                <div className="p-6 flex items-center gap-6">

                    {/* Profile */}

                    <div className="flex-shrink-0">

                        {employee.profile_photo ? (

                            <img
                                src={employee.profile_photo}
                                alt={fullName}
                                className="w-28 h-28 rounded-full object-cover border"
                            />

                        ) : (

                            <div className="w-28 h-28 rounded-full bg-[#610e1e] text-white flex items-center justify-center text-4xl font-bold">

                                {employee.first_name
                                    ? employee.first_name.charAt(0).toUpperCase()
                                    : "E"}

                            </div>

                        )}

                    </div>

                    {/* Details */}

                    <div className="flex-1">

                        <h2 className="text-3xl font-bold text-gray-800">

                            {fullName}

                        </h2>

                        <p className="text-gray-500 mt-1">

                            {employee.designation?.designation_name || "-"}

                        </p>

                        <div className="flex flex-wrap gap-3 mt-4">

                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">

                                {employee.employee_code}

                            </span>

                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">

                                {employee.branch?.branch_name || "-"}

                            </span>

                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">

                                {employee.department?.department_name || "-"}

                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    employee.active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {employee.active ? "Active" : "Inactive"}
                            </span>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Basic Information & Employment */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Basic Information */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Basic Information
                        </h3>

                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">

                        <div>

                            <p className="text-gray-500">Employee Code</p>
                            <p className="font-medium">
                                {employee.employee_code}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Gender</p>
                            <p className="font-medium">
                                {employee.gender || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Date of Birth</p>
                            <p className="font-medium">
                                {employee.dob || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Mobile</p>
                            <p className="font-medium">
                                {employee.phone_number || "-"}
                            </p>

                        </div>

                        <div className="col-span-2">

                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">
                                {employee.email || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Aadhaar Number</p>
                            <p className="font-medium">
                                {employee.aadhaar_number || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">PAN Number</p>
                            <p className="font-medium">
                                {employee.pan_number || "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Employment Information */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Employment Information
                        </h3>

                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">

                        <div>

                            <p className="text-gray-500">Branch</p>
                            <p className="font-medium">
                                {employee.branch?.branch_name || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Department</p>
                            <p className="font-medium">
                                {employee.department?.department_name || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Designation</p>
                            <p className="font-medium">
                                {employee.designation?.designation_name || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Employee Type</p>
                            <p className="font-medium">
                                {employee.employee_type || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Joining Date</p>
                            <p className="font-medium">
                                {employee.joining_date || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Shift</p>
                            <p className="font-medium">
                                {employee.shift || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Salary</p>
                            <p className="font-medium">
                                ₹ {employee.salary_scale || "0"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">Reference</p>
                            <p className="font-medium">
                                {employee.reference || "-"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Address & Bank Details */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Address */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Address Information
                        </h3>

                    </div>

                    <div className="p-5 space-y-5">

                        <div>

                            <p className="text-gray-500 text-sm mb-1">
                                Present Address
                            </p>

                            <div className="border rounded-lg bg-gray-50 p-3 min-h-[80px]">

                                {employee.present_address || "-"}

                            </div>

                        </div>

                        <div>

                            <p className="text-gray-500 text-sm mb-1">
                                Permanent Address
                            </p>

                            <div className="border rounded-lg bg-gray-50 p-3 min-h-[80px]">

                                {employee.permanent_address || "-"}

                            </div>

                        </div>

                    </div>

                </div>

                {/* Bank Details */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Bank Details
                        </h3>

                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">

                        <div>

                            <p className="text-gray-500">
                                Bank Name
                            </p>

                            <p className="font-medium">
                                {employee.bank_name || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Branch Name
                            </p>

                            <p className="font-medium">
                                {employee.branch_name || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Account Number
                            </p>

                            <p className="font-medium">
                                {employee.bank_account_number || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                IFSC Code
                            </p>

                            <p className="font-medium">
                                {employee.ifsc_code || "-"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Qualification & Documents */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Qualification */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Qualification & Experience
                        </h3>

                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">

                        <div>

                            <p className="text-gray-500">
                                Qualification
                            </p>

                            <p className="font-medium">
                                {employee.qualification || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Teaching Subject
                            </p>

                            <p className="font-medium">
                                {employee.teaching_subject || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Experience
                            </p>

                            <p className="font-medium">
                                {employee.experience_duration || "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Username
                            </p>

                            <p className="font-medium">
                                {employee.username || "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Documents */}

                <div className="bg-white rounded-xl shadow border">

                    <div className="px-5 py-3 border-b bg-gray-50">

                        <h3 className="font-semibold text-[#610e1e]">
                            Documents
                        </h3>

                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4">

                        <DocumentItem
                            title="Profile Photo"
                            file={employee.profile_photo}
                        />

                        <DocumentItem
                            title="PAN Card"
                            file={employee.pan_card_photo}
                        />

                        <DocumentItem
                            title="Aadhaar Card"
                            file={employee.aadhaar_card_photo}
                        />

                        <DocumentItem
                            title="Signature"
                            file={employee.signature}
                        />

                    </div>

                </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3">

                <Link
                    to="/employees"
                    className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                >
                    Back
                </Link>

                <Link
                    to={`/configuration/employees/${employee.id}/edit`}
                    className="px-5 py-2 bg-[#610e1e] text-white rounded-lg hover:bg-[#4d0b18]"
                >
                    Edit Employee
                </Link>

            </div>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Document Card
|--------------------------------------------------------------------------
*/

function DocumentItem({ title, file }) {

    return (

        <div className="border rounded-lg p-4 text-center">

            <h4 className="font-medium text-sm mb-3">

                {title}

            </h4>

            {file ? (

                <a
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    View Document
                </a>

            ) : (

                <span className="text-gray-400 text-sm">

                    Not Uploaded

                </span>

            )}

        </div>

    );

}