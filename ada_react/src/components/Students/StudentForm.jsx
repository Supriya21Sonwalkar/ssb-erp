import { useState } from "react";

const HostelRulesModal = ({ isOpen, onClose, onAgree }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl max-h-[80vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-[#610e1e] mb-4">Hostel Rules & Agreement</h2>
                
                <div className="space-y-4 text-sm text-gray-700 mb-6">
                    <h3 className="font-bold text-lg text-[#610e1e]">General Rules</h3>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Maintain absolute discipline within the hostel premises at all times.</li>
                        <li>All students must maintain the decorum of the hostel. In case of any difficulty or emergency, contact the hostel management immediately.</li>
                        <li>In case of medical problems, the student must immediately inform the Warden. Management will then inform the parents.</li>
                        <li>Usage of smartphones without prior permission is strictly prohibited. If found, management has the authority to confiscate or destroy the device without notice.</li>
                        <li>The management and staff will not be responsible for the loss of any personal belongings or valuables.</li>
                        <li>Rooms, once allotted, will not be changed. If a student leaves, another may be shifted to that room only with management permission.</li>
                        <li>Students must stay in their allotted rooms only. Sleeping in rooms not allotted to them is strictly prohibited.</li>
                        <li>Students shall not enter the rooms of other students without explicit permission.</li>
                        <li>During their stay, students will be governed by the management rules and the Academy's Code of Conduct.</li>
                        <li>Parents are permitted to meet students only on the first Sunday of the month. Meetings will take place in the designated campus area, not in the hostel rooms.</li>
                        <li>For leave or an out-pass, students must take prior written permission from the hostel authority.</li>
                        <li>Any student found in the hostel room during lecture hours without permission will face strict punishment.</li>
                        <li>Celebrations (birthdays/festivals) are not allowed in rooms. Food delivery apps are strictly prohibited.</li>
                        <li>Valuable items should not be kept in rooms. The Academy takes no responsibility for such items.</li>
                        <li>Food will be served only in the Dining Hall during specific timings. Wasting food/water is discouraged.</li>
                        <li>Visiting the mess outside of designated mess hours is strictly prohibited.</li>
                        <li>Making tea, coffee, or other food items is not allowed in the hostel rooms.</li>
                        <li>Students must use electricity responsibly. All switches must be turned off when leaving the room.</li>
                        <li>All lights must be switched off by 11:00 PM. Only study lamps are permitted after this time.</li>
                    </ol>

                    <h3 className="font-bold text-lg text-[#610e1e] mt-6">Cleanliness</h3>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>All students shall keep their rooms neat, clean, and organized.</li>
                        <li>Do not hang or stick posters on walls, doors, or windows.</li>
                        <li>Garbage must be disposed of in dustbins only; do not throw litter in corridors or parking areas.</li>
                        <li>Students must keep bathrooms and toilets clean after use.</li>
                        <li>It is mandatory to use hand sanitizer regularly.</li>
                    </ol>

                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h3 className="font-bold text-lg text-[#610e1e] mb-2">Hostel Agreement</h3>
                        <p className="mb-4">After taking admission in the hostel, you are bound to stay until the end of the course. This agreement will not be cancelled under any circumstances. Requests for refunds will not be entertained.</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p>Signature of Candidate: ______________________</p>
                            </div>
                            <div>
                                <p>Signature of Parent: _________________________</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-6">
                        <h3 className="font-bold text-lg text-red-800 mb-2">RULES ARE RULES</h3>
                        <p>Everyone must follow these rules and remain disciplined throughout the academic year. Management reserves the right to impose fines for any violations. In case of a serious offence, the Academy reserves the right to suspend or expel the candidate.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="checkbox"
                        id="hostelAgreement"
                        className="w-5 h-5 accent-[#610e1e]"
                        onChange={(e) => onAgree(e.target.checked)}
                    />
                    <label htmlFor="hostelAgreement" className="text-sm font-semibold text-gray-700">
                        I have read and agree to all the hostel rules and regulations
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded bg-[#610e1e] text-white hover:bg-[#7a182b]"
                    >
                        Agree & Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

// Placeholder components for each form step
const AdmissionForm = ({ formData, handleChange, dropdowns, filteredSections }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Admission Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Course *</label>
                <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white"
                >
                    <option value="">Select Course</option>
                    {dropdowns.courses && dropdowns.courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Academic Year *</label>
                <select
                    name="academic_year_id"
                    value={formData.academic_year_id}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white"
                >
                    <option value="">Select Academic Year</option>
                    {dropdowns.academicYears.map(year => (
                        <option key={year.id} value={year.id}>{year.academic_year}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Class *</label>
                <select
                    name="class_id"
                    value={formData.class_id}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white"
                >
                    <option value="">Select Class</option>
                    {dropdowns.classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Section</label>
                <select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    disabled={!formData.class_id}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white disabled:bg-gray-100"
                >
                    <option value="">Select Section</option>
                    {filteredSections.map(section => (
                        <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Admission Date *</label>
                <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Admission Type *</label>
                <select
                    name="admission_type"
                    value={formData.admission_type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white"
                >
                    <option value="">Select Type</option>
                    <option value="New Admission">New Admission</option>
                    <option value="Re-Admission">Re-Admission</option>
                    <option value="Transfer">Transfer</option>
                </select>
            </div>
        </div>
    </div>
);

const StudentDetailsForm = ({ formData, handleChange, mode }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Student Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">First Name *</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Middle Name</label>
                <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name *</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Gender *</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 bg-white"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Date of Birth *</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Student Email * <span className="text-blue-600">(Login ID)</span></label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 border-blue-300 bg-blue-50"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Student Mobile</label>
                <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Login Password <span className="text-xs text-gray-500">
                        {mode === "edit" ? "(leave blank to keep current)" : "(min 6 chars)"}
                    </span>
                </label>
                <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={mode === "edit" ? "New password (optional)" : "If blank, DOB (DDMMYYYY) is used"}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300 border-blue-300 bg-blue-50"
                />
            </div>
        </div>
    </div>
);

const ParentDetailsForm = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Parent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Father Name *</label>
                <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Father Mobile *</label>
                <input
                    type="text"
                    name="father_mobile"
                    value={formData.father_mobile}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Father Email</label>
                <input
                    type="email"
                    name="father_email"
                    value={formData.father_email}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Mother Name</label>
                <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Mother Mobile</label>
                <input
                    type="text"
                    name="mother_mobile"
                    value={formData.mother_mobile}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
        </div>
    </div>
);

const TransportForm = ({ formData, handleChange, onHostelChange }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Transport & Hostel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="transport_required"
                    checked={formData.transport_required === 1}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#610e1e]"
                />
                <label className="text-sm font-semibold text-gray-700">Transport Required</label>
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="hostel_required"
                    checked={formData.hostel_required === 1}
                    onChange={(e) => {
                        handleChange(e);
                        if (e.target.checked) {
                            onHostelChange();
                        }
                    }}
                    className="w-4 h-4 accent-[#610e1e]"
                />
                <label className="text-sm font-semibold text-gray-700">Hostel Required</label>
            </div>
        </div>
    </div>
);

const DocumentsForm = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Documents</h3>
        
        {/* Student Photo */}
        <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Student Photo</label>
            <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                className="w-full h-10 px-3 border rounded-lg border-gray-300"
            />
        </div>

        <h4 className="text-lg font-semibold text-[#610e1e] mt-6 mb-4 border-b pb-2">Required Documents</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Passport Size Photos */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Passport Size Photos (Qty: 10)</label>
                <input
                    type="file"
                    name="documents[0][file]"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Aadhar Card Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Aadhar Card (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[1][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Aadhar Card Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Aadhar Card (Copy) (Qty: 5)</label>
                <input
                    type="file"
                    name="documents[2][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Birth Certificate Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Birth Certificate (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[3][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Birth Certificate Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Birth Certificate (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[4][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* TC/SLC Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">TC/SLC (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[5][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* TC/SLC Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">TC/SLC (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[6][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Caste Certificate Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Caste Certificate (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[7][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Caste Certificate Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Caste Certificate (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[8][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Income Certificate Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Income Certificate (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[9][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Income Certificate Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Income Certificate (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[10][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Ration Card Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Ration Card (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[11][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Ration Card Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Ration Card (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[12][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Voter ID Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Voter ID (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[13][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* Voter ID Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Voter ID (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[14][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* PAN Card Original */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">PAN Card (Original) (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[15][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>

            {/* PAN Card Copy */}
            {/* <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">PAN Card (Copy) (Qty: 2)</label>
                <input
                    type="file"
                    name="documents[16][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    multiple
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div> */}

            {/* Bank Passbook */}
            <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Bank Passbook (Qty: 1)</label>
                <input
                    type="file"
                    name="documents[17][file]"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="w-full h-10 px-3 border rounded-lg border-gray-300"
                />
            </div>
        </div>
    </div>
);

const ReviewForm = ({ formData, mode }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#610e1e] mb-4">Review Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Name:</strong> {formData.first_name} {formData.middle_name} {formData.last_name}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>DOB:</strong> {formData.dob}</p>
            <p><strong>Student Email (Login ID):</strong> {formData.email || <span className="text-red-500">Required</span>}</p>
            <p><strong>Student Mobile:</strong> {formData.mobile || "—"}</p>
            <p><strong>Login Password:</strong> {formData.password ? "Provided" : (mode === "edit" ? "Unchanged (keep current)" : (formData.dob ? "Auto (DOB as DDMMYYYY)" : "Auto (default)"))}</p>
            <p><strong>Father:</strong> {formData.father_name}</p>
            <p><strong>Father Mobile:</strong> {formData.father_mobile}</p>
        </div>
    </div>
);

export default function StudentForm({

    mode,

    formData,

    handleChange,

    handleSubmit,

    loading,

    dropdowns,

    filteredSections,

}) {

    const [step, setStep] = useState(1);

    const [showHostelModal, setShowHostelModal] = useState(false);
    const [hostelAgreed, setHostelAgreed] = useState(false);

    const totalSteps = 6;

    const nextStep = () => {

        if (step < totalSteps) {

            setStep(step + 1);

        }

    };

    const previousStep = () => {

        if (step > 1) {

            setStep(step - 1);

        }

    };

    const handleHostelChange = () => {
        setShowHostelModal(true);
        setHostelAgreed(false);
    };

    const handleHostelAgree = (agreed) => {
        setHostelAgreed(agreed);
    };

    const handleHostelModalClose = () => {
        if (hostelAgreed) {
            setShowHostelModal(false);
        } else {
            setShowHostelModal(false);
            handleChange({
                target: {
                    name: 'hostel_required',
                    value: 0,
                    type: 'checkbox',
                    checked: false
                }
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>

                {/* Progress */}

                <div className="bg-white rounded-xl shadow mb-6 p-5">

                    <div className="flex justify-between">

                        {[
                            "Admission",
                            "Student",
                            "Parent",
                            "Documents",
                            "Transport",
                            "Review",
                        ].map((title, index) => (

                            <div
                                key={index}
                                className="flex flex-col items-center flex-1"
                            >

                                <div

                                    className={`
                                        w-10
                                        h-10
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                        mb-2

                                        ${
                                            step >= index + 1

                                            ?

                                            "bg-[#610e1e] text-white"

                                            :

                                            "bg-gray-200 text-gray-500"

                                        }
                                    `}
                                >

                                    {index + 1}

                                </div>

                                <span className="text-xs">

                                    {title}

                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Current Step */}

                <div className="bg-white rounded-xl shadow p-6">

                    {step === 1 && (

                        <AdmissionForm

                            formData={formData}

                            handleChange={handleChange}

                            dropdowns={dropdowns}

                            filteredSections={filteredSections}

                        />

                    )}

                    {step === 2 && (

                        <StudentDetailsForm

                            formData={formData}

                            handleChange={handleChange}

                            mode={mode}

                        />

                    )}

                    {step === 3 && (

                        <ParentDetailsForm

                            formData={formData}

                            handleChange={handleChange}

                        />

                    )}

                    {step === 4 && (

                        <DocumentsForm

                            formData={formData}

                            handleChange={handleChange}

                        />

                    )}

                    {step === 5 && (

                        <TransportForm

                            formData={formData}

                            handleChange={handleChange}

                            onHostelChange={handleHostelChange}

                        />

                    )}

                    {step === 6 && (

                        <ReviewForm

                            formData={formData}

                            mode={mode}

                        />

                    )}

                </div>

                {/* Buttons */}

                <div className="flex justify-between mt-6">

                    <button

                        type="button"

                        onClick={previousStep}

                        disabled={step === 1}

                        className="px-6 py-2 rounded bg-gray-500 text-white disabled:opacity-50"

                    >

                        Previous

                    </button>

                    {step < totalSteps ? (

                        <button

                            type="button"

                            onClick={nextStep}

                            className="px-6 py-2 rounded bg-[#610e1e] text-white"

                        >

                            Next

                        </button>

                    ) : (

                        <button

                            type="submit"

                            disabled={loading}

                            className="px-6 py-2 rounded bg-green-600 text-white"

                        >

                            {loading

                                ? "Saving..."

                                : mode === "create"

                                ? "Register Student"

                                : "Update Student"}

                        </button>

                    )}

                </div>

            </form>

            <HostelRulesModal
                isOpen={showHostelModal}
                onClose={handleHostelModalClose}
                onAgree={handleHostelAgree}
            />
        </>
    );

}