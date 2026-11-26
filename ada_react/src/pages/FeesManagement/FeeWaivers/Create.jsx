import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSearch,
    FaUserGraduate,
    FaPaperPlane,
    FaSpinner,
    FaTimes,
    FaPercent,
    FaRupeeSign,
} from "react-icons/fa";

import feeWaiverApi from "../../../services/feeWaiverApi";
import feeStructureApi from "../../../services/feeStructureApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";


export default function FeeWaiverCreate() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const searchRef = useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Academic Years
    |--------------------------------------------------------------------------
    */

    const [academicYears, setAcademicYears] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Classes
    |--------------------------------------------------------------------------
    */

    const [classes, setClasses] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Fee Structures
    |--------------------------------------------------------------------------
    */

    const [feeStructures, setFeeStructures] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Student Search
    |--------------------------------------------------------------------------
    */

    const [academicYearId, setAcademicYearId] = useState(
        searchParams.get("academic_year_id") || ""
    );

    const [search, setSearch] = useState("");

    const [students, setStudents] = useState([]);

    const [showSuggestions, setShowSuggestions] = useState(false);

    const [loadingStudents, setLoadingStudents] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Selected Student
    |--------------------------------------------------------------------------
    */

    const [selectedStudent, setSelectedStudent] = useState(null);

    const [studentDetails, setStudentDetails] = useState(null);

    const [loadingDetails, setLoadingDetails] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Waiver Form
    |--------------------------------------------------------------------------
    */

    const [waiverForm, setWaiverForm] = useState({
        fee_structure_id: "",
        waiver_type: "fixed",
        waiver_value: "",
        reason: "",
        status: true,
        remarks: "",
    });

    const [calculatedWaiverAmount, setCalculatedWaiverAmount] = useState(0);

    const [submitting, setSubmitting] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Academic Years & Classes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAcademicYears();
        loadClasses();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Load Fee Structures when Student is Selected
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (selectedStudent) {

            loadFeeStructures();

        }

    }, [selectedStudent]);


    /*
    |--------------------------------------------------------------------------
    | Calculate Waiver Amount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (studentDetails && waiverForm.fee_structure_id) {

            const structure = feeStructures.find(
                (s) => Number(s.id) === Number(waiverForm.fee_structure_id)
            );

            if (structure) {

                const totalFee = Number(structure.total_amount || 0);
                const waiverValue = Number(waiverForm.waiver_value || 0);

                let amount = 0;

                if (waiverForm.waiver_type === "percentage") {

                    if (waiverValue <= 100) {

                        amount = (totalFee * waiverValue) / 100;

                    }

                }
                else {

                    if (waiverValue <= totalFee) {

                        amount = waiverValue;

                    }

                }

                setCalculatedWaiverAmount(amount);

            }

        }

    }, [waiverForm.waiver_type, waiverForm.waiver_value, waiverForm.fee_structure_id, studentDetails, feeStructures]);


    /*
    |--------------------------------------------------------------------------
    | Load Academic Years
    |--------------------------------------------------------------------------
    */

    const loadAcademicYears = async () => {

        try {

            const response = await academicYearApi.getAll();

            const data = response?.data?.data ?? response?.data ?? [];

            setAcademicYears(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Academic Years Error:", error);
            setAcademicYears([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Classes
    |--------------------------------------------------------------------------
    */

    const loadClasses = async () => {

        try {

            const response = await classApi.getAll();

            const data = response?.data?.data ?? response?.data ?? [];

            setClasses(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Classes Error:", error);
            setClasses([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Fee Structures
    |--------------------------------------------------------------------------
    */

    const loadFeeStructures = async () => {

        if (!selectedStudent) return;

        try {

            const params = {
                course_id: selectedStudent.course_id,
                academic_year_id: selectedStudent.academic_year_id,
                status: 1,
            };

            const response = await feeStructureApi.getAll(params);

            const data = response?.data?.data ?? response?.data ?? [];

            setFeeStructures(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Fee Structures Error:", error);
            setFeeStructures([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Search Students
    |--------------------------------------------------------------------------
    */

    const handleSearch = async (value) => {

        setSearch(value);

        if (value.trim().length < 2) {

            setStudents([]);
            setShowSuggestions(false);
            return;

        }

        try {

            setLoadingStudents(true);

            const params = {
                search: value,
                academic_year_id: academicYearId,
            };

            const response = await feeWaiverApi.searchStudents(params);

            const data = response?.data?.data ?? response?.data ?? [];

            setStudents(Array.isArray(data) ? data : []);

            setShowSuggestions(true);

        }
        catch (error) {

            console.error("Search Students Error:", error);
            setStudents([]);
            setShowSuggestions(false);

        }
        finally {

            setLoadingStudents(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Select Student
    |--------------------------------------------------------------------------
    */

    const selectStudent = (student) => {

        setSelectedStudent(student);
        setSearch(`${student.full_name || student.first_name} (${student.admission_no})`);
        setShowSuggestions(false);
        setStudents([]);

        setWaiverForm((prev) => ({
            ...prev,
            fee_structure_id: "",
        }));

        setCalculatedWaiverAmount(0);

    };


    /*
    |--------------------------------------------------------------------------
    | Clear Student Selection
    |--------------------------------------------------------------------------
    */

    const clearStudent = () => {

        setSelectedStudent(null);
        setSearch("");
        setStudentDetails(null);
        setFeeStructures([]);
        setWaiverForm((prev) => ({
            ...prev,
            fee_structure_id: "",
        }));
        setCalculatedWaiverAmount(0);

    };


    /*
    |--------------------------------------------------------------------------
    | Handle Form Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!selectedStudent) {

            alert("Please select a student.");
            return;

        }

        if (!waiverForm.fee_structure_id) {

            alert("Please select a fee structure.");
            return;

        }

        if (!waiverForm.waiver_value || Number(waiverForm.waiver_value) <= 0) {

            alert("Please enter a valid waiver value.");
            return;

        }

        if (!waiverForm.reason.trim()) {

            alert("Please enter a reason for the waiver.");
            return;

        }

        try {

            setSubmitting(true);

            const payload = {
                student_id: selectedStudent.id,
                fee_structure_id: waiverForm.fee_structure_id,
                waiver_type: waiverForm.waiver_type,
                waiver_value: waiverForm.waiver_value,
                reason: waiverForm.reason,
                status: waiverForm.status,
                remarks: waiverForm.remarks,
            };

            const response = await feeWaiverApi.create(payload);

            console.log("Waiver Created:", response);

            navigate("/fees/waivers");

        }
        catch (error) {

            console.error("Create Waiver Error:", error);
            console.error("Backend:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Unable to create fee waiver. Please try again."
            );

        }
        finally {

            setSubmitting(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });

    };


    /*
    |--------------------------------------------------------------------------
    | Get Fee Structure Info
    |--------------------------------------------------------------------------
    */

    const getSelectedFeeStructure = () => {

        if (!waiverForm.fee_structure_id) return null;

        return feeStructures.find(
            (s) => Number(s.id) === Number(waiverForm.fee_structure_id)
        );

    };


    return (

        <div className="space-y-6">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex items-center gap-4">

                <button
                    onClick={() => navigate("/fees/waivers")}
                    className="
                        w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center
                        hover:bg-gray-200 transition
                    "
                >

                    <FaArrowLeft />

                </button>

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Create Fee Waiver
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Assign fee waiver to a student
                    </p>

                </div>

            </div>


            {/* =====================================================
                FORM
            ===================================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* =====================================================
                        Student Search
                    ===================================================== */}

                    <div className="space-y-4">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Select Student
                        </h3>


                        {/* Academic Year Filter */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Academic Year
                            </label>

                            <select
                                value={academicYearId}
                                onChange={(e) => setAcademicYearId(e.target.value)}
                                className="
                                    w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                "
                            >

                                <option value="">All Academic Years</option>

                                {academicYears.map((year) => (

                                    <option key={year.id} value={year.id}>
                                        {year.name || year.title || year.academic_year}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Student Search */}

                        <div className="relative">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Student
                            </label>

                            <div className="relative">

                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by name or admission number..."
                                    className="
                                        w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                    "
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearStudent}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >

                                        <FaTimes />

                                    </button>
                                )}

                            </div>


                            {/* Suggestions Dropdown */}

                            {showSuggestions && students.length > 0 && (

                                <div className="
                                    absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto
                                ">

                                    {students.map((student) => (

                                        <button
                                            key={student.id}
                                            type="button"
                                            onClick={() => selectStudent(student)}
                                            className="
                                                w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                                                flex items-center gap-3
                                            "
                                        >

                                            <div className="
                                                w-10 h-10 rounded-full bg-[#610e1e] flex items-center justify-center text-white font-semibold
                                            ">

                                                {student.first_name?.charAt(0) || "S"}

                                            </div>

                                            <div className="flex-1">

                                                <p className="font-medium text-gray-800">
                                                    {student.full_name || student.first_name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {student.admission_no}
                                                </p>

                                            </div>

                                        </button>

                                    ))}

                                </div>

                            )}

                        </div>


                        {/* Selected Student Info */}

                        {selectedStudent && (

                            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">

                                <div className="
                                    w-12 h-12 rounded-full bg-[#610e1e] flex items-center justify-center text-white font-bold text-lg
                                ">

                                    {selectedStudent.first_name?.charAt(0) || "S"}

                                </div>

                                <div className="flex-1">

                                    <p className="font-semibold text-gray-800">
                                        {selectedStudent.full_name || selectedStudent.first_name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Admission No: {selectedStudent.admission_no}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={clearStudent}
                                    className="
                                        px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition
                                    "
                                >

                                    Change

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =====================================================
                        Waiver Details
                    ===================================================== */}

                    {selectedStudent && (

                        <div className="space-y-4 pt-6 border-t border-gray-200">

                            <h3 className="text-lg font-semibold text-gray-800">
                                Waiver Details
                            </h3>


                            {/* Fee Structure */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fee Structure
                                </label>

                                <select
                                    value={waiverForm.fee_structure_id}
                                    onChange={(e) => setWaiverForm({
                                        ...waiverForm,
                                        fee_structure_id: e.target.value,
                                    })}
                                    className="
                                        w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
                                        focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                    "
                                    required
                                >

                                    <option value="">Select Fee Structure</option>

                                    {feeStructures.map((structure) => (

                                        <option key={structure.id} value={structure.id}>
                                            {structure.fee_component?.name} - {formatAmount(structure.total_amount)}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Fee Structure Info */}

                            {getSelectedFeeStructure() && (

                                <div className="bg-blue-50 rounded-lg p-4">

                                    <div className="grid grid-cols-2 gap-4">

                                        <div>

                                            <p className="text-sm text-gray-600">
                                                Component
                                            </p>

                                            <p className="font-semibold text-gray-800">
                                                {getSelectedFeeStructure().fee_component?.name || "-"}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-gray-600">
                                                Total Fee
                                            </p>

                                            <p className="font-bold text-[#610e1e]">
                                                {formatAmount(getSelectedFeeStructure().total_amount)}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* Waiver Type */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Waiver Type
                                </label>

                                <div className="flex gap-4">

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="waiver_type"
                                            value="fixed"
                                            checked={waiverForm.waiver_type === "fixed"}
                                            onChange={(e) => setWaiverForm({
                                                ...waiverForm,
                                                waiver_type: e.target.value,
                                            })}
                                            className="w-4 h-4 text-[#610e1e]"
                                        />

                                        <span className="flex items-center gap-2">
                                            <FaRupeeSign className="text-[#610e1e]" />
                                            Fixed Amount
                                        </span>

                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="waiver_type"
                                            value="percentage"
                                            checked={waiverForm.waiver_type === "percentage"}
                                            onChange={(e) => setWaiverForm({
                                                ...waiverForm,
                                                waiver_type: e.target.value,
                                            })}
                                            className="w-4 h-4 text-[#610e1e]"
                                        />

                                        <span className="flex items-center gap-2">
                                            <FaPercent className="text-[#610e1e]" />
                                            Percentage
                                        </span>

                                    </label>

                                </div>

                            </div>


                            {/* Waiver Value */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {waiverForm.waiver_type === "percentage"
                                        ? "Waiver Percentage"
                                        : "Waiver Amount"
                                    }
                                </label>

                                <div className="relative">

                                    {waiverForm.waiver_type === "percentage" && (
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                    )}

                                    <input
                                        type="number"
                                        value={waiverForm.waiver_value}
                                        onChange={(e) => setWaiverForm({
                                            ...waiverForm,
                                            waiver_value: e.target.value,
                                        })}
                                        placeholder={
                                            waiverForm.waiver_type === "percentage"
                                                ? "Enter percentage (e.g., 10)"
                                                : "Enter amount"
                                        }
                                        min="0"
                                        max={waiverForm.waiver_type === "percentage" ? "100" : undefined}
                                        step={waiverForm.waiver_type === "percentage" ? "1" : "0.01"}
                                        className={`
                                            w-full px-4 py-3 border border-gray-300 rounded-lg
                                            focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                            ${waiverForm.waiver_type === "percentage" ? "pl-8" : ""}
                                        `}
                                        required
                                    />

                                </div>

                            </div>


                            {/* Calculated Waiver Amount */}

                            {calculatedWaiverAmount > 0 && getSelectedFeeStructure() && (

                                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-gray-600">
                                            Calculated Waiver Amount
                                        </p>

                                        <p className="text-2xl font-bold text-green-700">
                                            {formatAmount(calculatedWaiverAmount)}
                                        </p>

                                    </div>

                                    <div className="text-right text-sm text-gray-600">

                                        <p>Total Fee: {formatAmount(getSelectedFeeStructure().total_amount)}</p>

                                        <p>Net Payable: {formatAmount(
                                            getSelectedFeeStructure().total_amount - calculatedWaiverAmount
                                        )}</p>

                                    </div>

                                </div>

                            )}


                            {/* Reason */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Waiver
                                </label>

                                <textarea
                                    value={waiverForm.reason}
                                    onChange={(e) => setWaiverForm({
                                        ...waiverForm,
                                        reason: e.target.value,
                                    })}
                                    placeholder="Enter the reason for granting this waiver..."
                                    rows="3"
                                    className="
                                        w-full px-4 py-3 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                    "
                                    required
                                />

                            </div>


                            {/* Remarks */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks (Optional)
                                </label>

                                <textarea
                                    value={waiverForm.remarks}
                                    onChange={(e) => setWaiverForm({
                                        ...waiverForm,
                                        remarks: e.target.value,
                                    })}
                                    placeholder="Any additional remarks..."
                                    rows="2"
                                    className="
                                        w-full px-4 py-3 border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                                    "
                                />

                            </div>


                            {/* Status */}

                            <div>

                                <label className="flex items-center gap-2 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        checked={waiverForm.status}
                                        onChange={(e) => setWaiverForm({
                                            ...waiverForm,
                                            status: e.target.checked,
                                        })}
                                        className="w-4 h-4 text-[#610e1e] rounded"
                                    />

                                    <span className="text-sm text-gray-700">
                                        Active (Approve immediately)
                                    </span>

                                </label>

                            </div>

                        </div>

                    )}


                    {/* =====================================================
                        Submit Button
                    ===================================================== */}

                    {selectedStudent && (

                        <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => navigate("/fees/waivers")}
                                className="
                                    px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold
                                    hover:bg-gray-50 transition
                                "
                            >

                                Cancel

                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                                    px-6 py-3 bg-[#610e1e] text-white rounded-lg font-semibold
                                    hover:bg-[#4d0b18] transition disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center gap-2
                                "
                            >

                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Create Waiver
                                    </>
                                )}

                            </button>

                        </div>

                    )}

                </form>

            </div>

        </div>

    );

}
