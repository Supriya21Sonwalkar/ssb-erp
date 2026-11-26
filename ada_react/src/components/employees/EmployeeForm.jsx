import React from "react";

const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="bg-[#610e1e] text-white px-5 py-3">
            <h2 className="font-semibold text-lg">
                {title}
            </h2>
        </div>

        <div className="p-5">
            {children}
        </div>
    </div>
);

const Label = ({ children, required = false }) => (
    <label className="block mb-1 text-sm font-semibold text-gray-700">
        {children}

        {required && (
            <span className="text-red-500 ml-1">*</span>
        )}
    </label>
);

const Input = ({
    handleChange,
    className = "",
    type = "text",
    ...props
}) => {
    const isFile = type === "file";
    return (
        <input
            {...props}
            type={type}
            onChange={handleChange}
            autoComplete="off"
            value={isFile ? undefined : props.value}
            className={`w-full h-10 px-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#610e1e] focus:border-[#610e1e] outline-none ${className}`}
        />
    );
};

const Select = ({
    children,
    handleChange,
    className = "",
    ...props
}) => (
    <select
        {...props}
        onChange={handleChange}
        className={`w-full h-10 px-3 border rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-[#610e1e] focus:border-[#610e1e] outline-none ${className}`}
    >
        {children}
    </select>
);

const Textarea = ({
    handleChange,
    className = "",
    ...props
}) => (
    <textarea
        {...props}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#610e1e] focus:border-[#610e1e] outline-none ${className}`}
    />
);

/*
|--------------------------------------------------------------------------
| Employee Form
|--------------------------------------------------------------------------
*/

export default function EmployeeForm({

    formData,

    handleChange,

    handleSubmit,

    loading,

    roles = [],

    branches = [],

    departments = [],

    designations = [],

    employees = [],

    mode = "create",

}) {

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <Section title="Basic & Personal Details">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Employee Code */}
                <div>
                    <Label>
                        Employee Code
                    </Label>

                    <Input
                        value={
                            formData.employee_code || "Auto Generated"
                        }
                        readOnly
                        className="bg-gray-100"
                    />
                </div>

                {/* Aadhaar Number */}
                <div>
                    <Label required>
                        Aadhaar Number
                    </Label>

                    <Input
                        name="aadhaar_number"
                        value={formData.aadhaar_number}
                        handleChange={handleChange}
                        readOnly
                        className="bg-gray-100"
                    />
                </div>

                {/* First Name */}
                <div>
                    <Label required>
                        First Name
                    </Label>

                    <Input
                        name="first_name"
                        value={formData.first_name}
                        handleChange={handleChange}
                        placeholder="First Name"
                    />
                </div>

                {/* Middle Name */}
                <div>
                    <Label>
                        Middle Name
                    </Label>

                    <Input
                        name="middle_name"
                        value={formData.middle_name}
                        handleChange={handleChange}
                        placeholder="Middle Name"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <Label required>
                        Last Name
                    </Label>

                    <Input
                        name="last_name"
                        value={formData.last_name}
                        handleChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>

                {/* Gender */}
                <div>
                    <Label required>
                        Gender
                    </Label>

                    <Select
                        name="gender"
                        value={formData.gender}
                        handleChange={handleChange}
                    >
                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </Select>
                </div>

                {/* Religion */}
                <div>
                    <Label>
                        Religion
                    </Label>

                    <Input
                        name="religion"
                        value={formData.religion}
                        handleChange={handleChange}
                        placeholder="e.g., Hinduism"
                    />
                </div>

                {/* Caste */}
                <div>
                    <Label>
                        Caste
                    </Label>

                    <Input
                        name="caste"
                        value={formData.caste}
                        handleChange={handleChange}
                        placeholder="e.g., Maratha"
                    />
                </div>

                {/* Sub Caste */}
                <div>
                    <Label>
                        Sub Caste
                    </Label>

                    <Input
                        name="sub_caste"
                        value={formData.sub_caste}
                        handleChange={handleChange}
                        placeholder="Sub Caste"
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <Label required>
                        Date of Birth
                    </Label>

                    <Input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        handleChange={handleChange}
                    />
                </div>

                {/* Marital Status */}
                <div>
                    <Label required>
                        Marital Status
                    </Label>

                    <Select
                        name="marital_status"
                        value={formData.marital_status}
                        handleChange={handleChange}
                    >
                        <option value="">
                            Select Status
                        </option>

                        <option value="Single">
                            Single
                        </option>

                        <option value="Married">
                            Married
                        </option>

                        <option value="Divorced">
                            Divorced
                        </option>
                    </Select>
                </div>

                {/* Phone Number */}
                <div>
                    <Label required>
                        Phone No
                    </Label>

                    <Input
                        name="mobile"
                        value={formData.mobile}
                        handleChange={handleChange}
                        placeholder="10-digit number"
                    />
                </div>

                {/* WhatsApp Number */}
                <div>
                    <Label>
                        WhatsApp No
                    </Label>

                    <Input
                        name="whatsapp_number"
                        value={formData.whatsapp_number}
                        handleChange={handleChange}
                        placeholder="10-digit number"
                    />
                </div>

                {/* Email */}
                <div>
                    <Label>
                        Email ID
                    </Label>

                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        handleChange={handleChange}
                        placeholder="example@mail.com"
                    />
                </div>

                {/* PAN Number */}
                <div>
                    <Label>
                        PAN Number
                    </Label>

                    <Input
                        name="pan_number"
                        value={formData.pan_number}
                        handleChange={handleChange}
                        placeholder="PAN Number"
                    />
                </div>

                {/* Qualification */}
                <div>
                    <Label required>
                        Qualification
                    </Label>

                    <Input
                        name="qualification"
                        value={formData.qualification}
                        handleChange={handleChange}
                        placeholder="e.g., B.Sc. Computer Science"
                    />
                </div>

            </div>

            {/* Present Address */}
            <div className="mt-4">
                <Label required>
                    Present Address
                </Label>

                <Textarea
                    rows={3}
                    name="present_address"
                    value={formData.present_address}
                    handleChange={handleChange}
                    placeholder="Current residential address"
                />
            </div>

            {/* Permanent Address */}
            <div className="mt-4">
                <Label>
                    Permanent Address
                </Label>

                <Textarea
                    rows={3}
                    name="permanent_address"
                    value={formData.permanent_address}
                    handleChange={handleChange}
                    placeholder="Permanent address (if different)"
                />
            </div>

            {/* Experience */}
            <div className="mt-4 max-w-md">
                <Label required>
                    Experience
                </Label>

                <Select
                    name="experience"
                    value={formData.experience}
                    handleChange={handleChange}
                >
                    <option value="">
                        Select Experience
                    </option>

                    <option value="Fresher">
                        Fresher
                    </option>

                    <option value="1 Year">
                        1 Year
                    </option>

                    <option value="2 Years">
                        2 Years
                    </option>

                    <option value="3 Years">
                        3 Years
                    </option>

                    <option value="4 Years">
                        4 Years
                    </option>

                    <option value="5 Years">
                        5 Years
                    </option>

                    <option value="6 Years">
                        6 Years
                    </option>

                    <option value="7 Years">
                        7 Years
                    </option>

                    <option value="8 Years">
                        8 Years
                    </option>

                    <option value="9 Years">
                        9 Years
                    </option>

                    <option value="10+ Years">
                        10+ Years
                    </option>
                </Select>
            </div>

        </Section>

{/* =====================================================
                        EMERGENCY CONTACT DETAILS
        ====================================================== */}

        <Section title="Emergency Contact Details">

            {/* Emergency Contact 1 */}
            <div className="mb-6">

                <h5 className="text-red-600 font-semibold text-base mb-3">
                    Emergency Contact 1
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Name */}
                    <div>
                        <Label>
                            Name
                        </Label>

                        <Input
                            name="emergency_contact_1_name"
                            value={formData.emergency_contact_1_name}
                            handleChange={handleChange}
                            placeholder="Contact Name"
                        />
                    </div>

                    {/* Relation */}
                    <div>
                        <Label>
                            Relation
                        </Label>

                        <Input
                            name="emergency_contact_1_relation"
                            value={formData.emergency_contact_1_relation}
                            handleChange={handleChange}
                            placeholder="e.g., Father, Mother, Spouse"
                        />
                    </div>

                    {/* Place */}
                    <div>
                        <Label>
                            Place
                        </Label>

                        <Input
                            name="emergency_contact_1_place"
                            value={formData.emergency_contact_1_place}
                            handleChange={handleChange}
                            placeholder="Place"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label>
                            Phone No
                        </Label>

                        <Input
                            name="emergency_contact_1_phone"
                            value={formData.emergency_contact_1_phone}
                            handleChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </div>

                </div>

            </div>


            {/* Emergency Contact 2 */}
            <div className="border-t border-gray-200 pt-5">

                <h5 className="text-red-600 font-semibold text-base mb-3">
                    Emergency Contact 2
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Name */}
                    <div>
                        <Label>
                            Name
                        </Label>

                        <Input
                            name="emergency_contact_2_name"
                            value={formData.emergency_contact_2_name}
                            handleChange={handleChange}
                            placeholder="Contact Name"
                        />
                    </div>

                    {/* Relation */}
                    <div>
                        <Label>
                            Relation
                        </Label>

                        <Input
                            name="emergency_contact_2_relation"
                            value={formData.emergency_contact_2_relation}
                            handleChange={handleChange}
                            placeholder="e.g., Father, Mother, Spouse"
                        />
                    </div>

                    {/* Place */}
                    <div>
                        <Label>
                            Place
                        </Label>

                        <Input
                            name="emergency_contact_2_place"
                            value={formData.emergency_contact_2_place}
                            handleChange={handleChange}
                            placeholder="Place"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label>
                            Phone No
                        </Label>

                        <Input
                            name="emergency_contact_2_phone"
                            value={formData.emergency_contact_2_phone}
                            handleChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </div>

                </div>

            </div>

        </Section>

            <Section title="Employment Information">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    {/* Branch */}

                    <div>

                        <Label required>
                            Branch
                        </Label>

                        <Select
                            name="branch_id"
                            value={formData.branch_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Branch
                            </option>

                            {branches.map(branch => (

                                <option
                                    key={branch.id}
                                    value={branch.id}
                                >
                                    {branch.branch_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Department */}

                    <div>

                        <Label required>
                            Department
                        </Label>

                        <Select
                            name="department_id"
                            value={formData.department_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Department
                            </option>

                            {departments.map(department => (

                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.department_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Designation */}

                    <div>

                        <Label required>
                            Designation
                        </Label>

                        <Select
                            name="designation_id"
                            value={formData.designation_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Designation
                            </option>

                            {designations.map(designation => (

                                <option
                                    key={designation.id}
                                    value={designation.id}
                                >
                                    {designation.designation_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Employee Type */}

                    <div>

                        <Label>
                            Employee Type
                        </Label>

                        <Select
                            name="employee_type"
                            value={formData.employee_type}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Type
                            </option>

                            <option value="Teaching">
                                Teaching
                            </option>

                            <option value="Non Teaching">
                                Non Teaching
                            </option>

                            <option value="Administrative">
                                Administrative
                            </option>

                            <option value="Contract">
                                Contract
                            </option>

                        </Select>

                    </div>

                    {/* Salary */}
                    <div>

                        <Label required>
                            Salary
                        </Label>

                        <Input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            handleChange={handleChange}
                            placeholder="Enter Salary"
                            min="0"
                            step="0.01"
                        />

                    </div>

                    {/* Joining Date */}

                    <div>

                        <Label>
                            Joining Date
                        </Label>

                        <Input
                            type="date"
                            name="joining_date"
                            value={formData.joining_date}
                            handleChange={handleChange}
                        />

                    </div>

                    {/* Last Working Date */}

                    <div>

                        <Label>
                            Last Working Date
                        </Label>

                        <Input
                            type="date"
                            name="last_working_date"
                            value={formData.last_working_date}
                            handleChange={handleChange}
                        />

                    </div>

                    {/* Shift */}

                    <div>

                        <Label required>
                            Shift
                        </Label>

                        <Select
                            name="shift"
                            value={formData.shift}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Shift
                            </option>

                            <option value="Day Shift">
                                Day Shift
                            </option>

                            <option value="Morning Shift">
                                Morning Shift
                            </option>

                            <option value="Evening Shift">
                                Evening Shift
                            </option>

                            <option value="Night Shift">
                                Night Shift
                            </option>

                        </Select>

                    </div>

                    {/* In Time */}

                    <div>

                        <Label>
                            In Time
                        </Label>

                        <Input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            handleChange={handleChange}
                        />

                    </div>

                    {/* Out Time */}

                    <div>

                        <Label>
                            Out Time
                        </Label>

                        <Input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            handleChange={handleChange}
                        />

                    </div>

                    {/* Reporting Manager */}

                    <div>

                        <Label>
                            Reporting Manager
                        </Label>

                        <Select
                            name="reporting_id"
                            value={formData.reporting_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Reporting Manager
                            </option>

                            {employees.map(employee => (

                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.full_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Buddy */}

                    <div>

                        <Label>
                            Buddy
                        </Label>

                        <Select
                            name="buddy_id"
                            value={formData.buddy_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Buddy
                            </option>

                            {employees.map(employee => (

                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.full_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Role */}

                    <div>

                        <Label required>
                            Role
                        </Label>

                        <Select
                            name="role_id"
                            value={formData.role_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Role
                            </option>

                            {roles.map(role => (

                                <option
                                    key={role.id}
                                    value={role.id}
                                >
                                    {role.name}
                                </option>

                            ))}

                        </Select>

                    </div>

                </div>

            </Section>

            {/* <Section title="Address Information">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div>

                        <Label>
                            Present Address
                        </Label>

                        <Textarea
                            rows={3}
                            name="present_address"
                            value={formData.present_address}
                            handleChange={handleChange}
                        />

                    </div>

                    <div>

                        <Label>
                            Permanent Address
                        </Label>

                        <Textarea
                            rows={3}
                            name="permanent_address"
                            value={formData.permanent_address}
                            handleChange={handleChange}
                        />

                    </div>

                </div>

            </Section> */}

                        {/* =====================================================
                            SALARY & BANK DETAILS
            ====================================================== */}

           <Section title="Bank, ID & Other Details">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Row 1 */}

                {/* Aadhaar Card No. */}
                <div>
                    <Label required>
                        Aadhaar Card No.
                    </Label>

                    <Input
                        name="aadhaar_number"
                        value={formData.aadhaar_number}
                        handleChange={handleChange}
                        placeholder="Aadhaar Number"
                        readOnly
                        className="bg-gray-100"
                    />
                </div>

                {/* PAN No. */}
                <div>
                    <Label required>
                        PAN No.
                    </Label>

                    <Input
                        name="pan_number"
                        value={formData.pan_number}
                        handleChange={handleChange}
                        placeholder="ABCDE1234F"
                    />
                </div>

                {/* Bank Name */}
                <div>
                    <Label>
                        Bank Name
                    </Label>

                    <Input
                        name="bank_name"
                        value={formData.bank_name}
                        handleChange={handleChange}
                        placeholder="Bank Name"
                    />
                </div>

                {/* Bank Branch */}
                <div>
                    <Label>
                        Bank Branch
                    </Label>

                    <Input
                        name="branch_name"
                        value={formData.branch_name}
                        handleChange={handleChange}
                        placeholder="Branch Name"
                    />
                </div>


                {/* Row 2 */}

                {/* Bank A/C Name */}
                <div>
                    <Label>
                        Bank A/C Name
                    </Label>

                    <Input
                        name="bank_account_name"
                        value={formData.bank_account_name}
                        handleChange={handleChange}
                        placeholder="Account Holder Name"
                    />
                </div>

                {/* Bank A/C No. */}
                <div>
                    <Label>
                        Bank A/C No.
                    </Label>

                    <Input
                        name="account_number"
                        value={formData.account_number}
                        handleChange={handleChange}
                        placeholder="Account Number"
                    />
                </div>

                {/* IFSC Code */}
                <div>
                    <Label>
                        IFSC Code
                    </Label>

                    <Input
                        name="ifsc_code"
                        value={formData.ifsc_code}
                        handleChange={handleChange}
                        placeholder="IFSC Code"
                    />
                </div>

                {/* Reference */}
                <div>
                    <Label>
                        Reference
                    </Label>

                    <Input
                        name="reference"
                        value={formData.reference}
                        handleChange={handleChange}
                        placeholder="Reference"
                    />
                </div>

            </div>  

           </Section>

            <Section title="Qualification & Experience">

                {/* Education Qualification Details */}

                <div className="mb-6">

                    <h5 className="text-red-600 font-semibold text-base mb-3">
                        Education Qualification Details
                    </h5>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">

                        <table className="w-full text-sm border-collapse">

                            <thead>
                                <tr className="bg-[#610e1e] text-white">

                                    <th className="px-4 py-3 text-left border-r border-white/20">
                                        ID
                                    </th>

                                    <th className="px-4 py-3 text-left border-r border-white/20">
                                        Education
                                    </th>

                                    <th className="px-4 py-3 text-left border-r border-white/20">
                                        Board / University
                                    </th>

                                    <th className="px-4 py-3 text-left border-r border-white/20">
                                        Year Of Passing
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Percentage
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {/* Std 10 */}

                                <tr className="border-b border-gray-200">

                                    <th className="px-4 py-3 text-left font-semibold">
                                        1
                                    </th>

                                    <td className="px-4 py-3 font-medium">
                                        Std 10
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="board_10th"
                                            value={formData.board_10th}
                                            handleChange={handleChange}
                                            placeholder="Board / University"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="year_pass_10th"
                                            value={formData.year_pass_10th}
                                            handleChange={handleChange}
                                            placeholder="Year Of Passing"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            name="percentage_10th"
                                            value={formData.percentage_10th}
                                            handleChange={handleChange}
                                            placeholder="Percentage"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                    </td>

                                </tr>


                                {/* Std 12 */}

                                <tr className="border-b border-gray-200">

                                    <th className="px-4 py-3 text-left font-semibold">
                                        2
                                    </th>

                                    <td className="px-4 py-3 font-medium">
                                        Std 12
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="board_12th"
                                            value={formData.board_12th}
                                            handleChange={handleChange}
                                            placeholder="Board / University"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="year_pass_12th"
                                            value={formData.year_pass_12th}
                                            handleChange={handleChange}
                                            placeholder="Year Of Passing"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            name="percentage_12th"
                                            value={formData.percentage_12th}
                                            handleChange={handleChange}
                                            placeholder="Percentage"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                    </td>

                                </tr>


                                {/* Graduate */}

                                <tr className="border-b border-gray-200">

                                    <th className="px-4 py-3 text-left font-semibold">
                                        3
                                    </th>

                                    <td className="px-4 py-3 font-medium">
                                        Graduate
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="board_graduate"
                                            value={formData.board_graduate}
                                            handleChange={handleChange}
                                            placeholder="Board / University"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="year_pass_graduate"
                                            value={formData.year_pass_graduate}
                                            handleChange={handleChange}
                                            placeholder="Year Of Passing"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            name="percentage_graduate"
                                            value={formData.percentage_graduate}
                                            handleChange={handleChange}
                                            placeholder="Percentage"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                    </td>

                                </tr>


                                {/* Post Graduate */}

                                <tr>

                                    <th className="px-4 py-3 text-left font-semibold">
                                        4
                                    </th>

                                    <td className="px-4 py-3 font-medium">
                                        Post Graduate
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="board_post_graduate"
                                            value={formData.board_post_graduate}
                                            handleChange={handleChange}
                                            placeholder="Board / University"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            name="year_pass_post_graduate"
                                            value={formData.year_pass_post_graduate}
                                            handleChange={handleChange}
                                            placeholder="Year Of Passing"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            name="percentage_post_graduate"
                                            value={formData.percentage_post_graduate}
                                            handleChange={handleChange}
                                            placeholder="Percentage"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Computer Proficiency / Experience Details */}

                <div className="border-t border-gray-200 pt-5">

                    {/* <h5 className="text-red-600 font-semibold text-base mb-3">
                        Computer Proficiency Details
                    </h5> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                        {/* Work Experience */}

                        <div>
                            <Label required>
                                Work Experience (Till Date)
                            </Label>

                            <Input
                                name="experience"
                                value={formData.experience}
                                handleChange={handleChange}
                                placeholder="Work Experience (Till Date)"
                            />
                        </div>


                        {/* Last Salary */}

                        <div>
                            <Label required>
                                Last Salary
                            </Label>

                            <Input
                                type="number"
                                name="last_salary"
                                value={formData.last_salary}
                                handleChange={handleChange}
                                placeholder="Last Salary"
                                min="0"
                                step="0.01"
                            />
                        </div>

                    </div>

                </div>

            </Section>

            {/* =====================================================
                            LOGIN INFORMATION
            ====================================================== */}

            <Section title="Login Information">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    <div>

                        <Label>
                            Username
                        </Label>

                        <Input
                            name="username"
                            value={formData.username}
                            handleChange={handleChange}
                            placeholder="Auto Generated"
                            readOnly
                            className="bg-gray-100"
                        />

                    </div>

                    <div>

                        <Label>
                            {mode === "create" ? "Password" : "New Password (leave blank to keep current)"}
                        </Label>

                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            handleChange={handleChange}
                            placeholder={mode === "create" ? "Auto: DOB (ddmmyyyy) or Employee@123" : "Leave blank for no change"}
                        />

                    </div>

                    <div>

                        <Label>
                            Status
                        </Label>

                        <Select
                            name="active"
                            value={formData.active}
                            handleChange={handleChange}
                        >

                            <option value={1}>
                                Active
                            </option>

                            <option value={0}>
                                Inactive
                            </option>

                        </Select>

                    </div>

                </div>

            </Section>
            
            {/* =====================================================
                            DOCUMENTS
            ====================================================== */}

            <Section title="Upload Documents">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

                    {/* Aadhaar */}
                    <div>
                        <Label required>
                            Aadhaar Card
                        </Label>

                        <Input
                            type="file"
                            name="aadhaar_card_photo"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* PAN */}
                    <div>
                        <Label required>
                            PAN Card
                        </Label>

                        <Input
                            type="file"
                            name="pan_card_photo"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Bank Details */}
                    <div>
                        <Label>
                            Bank Details
                        </Label>

                        <Input
                            type="file"
                            name="bank_details_document"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Driving License */}
                    <div>
                        <Label>
                            Driving License
                        </Label>

                        <Input
                            type="file"
                            name="driving_license_document"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* 10th Marksheet */}
                    <div>
                        <Label>
                            10th Marksheet
                        </Label>

                        <Input
                            type="file"
                            name="marksheet_10th"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* 12th Marksheet */}
                    <div>
                        <Label>
                            12th Marksheet
                        </Label>

                        <Input
                            type="file"
                            name="marksheet_12th"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Graduation */}
                    <div>
                        <Label>
                            Graduation Certificate
                        </Label>

                        <Input
                            type="file"
                            name="graduation_certificate"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Post Graduation */}
                    <div>
                        <Label>
                            Post Grad Certificate
                        </Label>

                        <Input
                            type="file"
                            name="post_graduation_certificate"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Policy */}
                    <div>
                        <Label>
                            Policy Document
                        </Label>

                        <Input
                            type="file"
                            name="policy_document"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Other */}
                    <div>
                        <Label>
                            Other Documents
                        </Label>

                        <Input
                            type="file"
                            name="other_documents"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Profile */}
                    <div>
                        <Label>
                            Profile Photo
                        </Label>

                        <Input
                            type="file"
                            name="profile_photo"
                            accept=".jpg,.jpeg,.png,.webp"
                            handleChange={handleChange}
                        />
                    </div>


                    {/* Signature */}
                    <div>
                        <Label>
                            Signature
                        </Label>

                        <Input
                            type="file"
                            name="signature"
                            accept=".jpg,.jpeg,.png,.webp"
                            handleChange={handleChange}
                        />
                    </div>

                </div>

            </Section>

            {/* =====================================================
                            ACTION BUTTONS
            ====================================================== */}

            <div className="sticky bottom-0 bg-white border rounded-xl shadow-lg px-6 py-4">

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 rounded-lg bg-[#610e1e] text-white hover:bg-[#7a1225] disabled:opacity-60 font-semibold"
                    >
                        {loading
                            ? "Saving..."
                            : mode === "edit"
                            ? "Update Employee"
                            : "Create Employee"}
                    </button>

                </div>

            </div>

        </form>

    );

}