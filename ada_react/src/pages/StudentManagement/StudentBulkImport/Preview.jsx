import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentBulkImportApi from "../../../services/studentBulkImportApi";

import {
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationCircle,
    FaSave,
    FaSpinner,
} from "react-icons/fa";

/*
|--------------------------------------------------------------------------
| Exact Excel Columns
|--------------------------------------------------------------------------
|
| Keep this order exactly the same as StudentSampleExport.php.
|
*/

const EXCEL_COLUMNS = [
    { key: "course", label: "Course" },
    { key: "academic_year", label: "Academic Year" },
    { key: "class", label: "Class" },
    { key: "section", label: "Section" },

    { key: "student_code", label: "Student Code" },
    { key: "admission_no", label: "Admission No" },
    { key: "form_no", label: "Form No" },
    { key: "roll_no", label: "Roll No" },

    { key: "class_admitted_aws", label: "Class Admitted AWS" },
    {
        key: "caution_fee_receipt_no",
        label: "Caution Fee Receipt No",
    },

    {
        key: "admission_date",
        label: "Admission Date (DD-MM-YYYY)",
    },
    {
        key: "admission_type",
        label: "Admission Type",
    },
    {
        key: "admission_status",
        label: "Admission Status",
    },

    { key: "first_name", label: "First Name" },
    { key: "middle_name", label: "Middle Name" },
    { key: "last_name", label: "Last Name" },

    { key: "gender", label: "Gender" },
    { key: "dob", label: "DOB (DD-MM-YYYY)" },

    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "password", label: "Password" },

    { key: "blood_group", label: "Blood Group" },
    { key: "category", label: "Category" },
    { key: "caste", label: "Caste" },
    { key: "sub_caste", label: "Sub Caste" },
    { key: "religion", label: "Religion" },
    { key: "nationality", label: "Nationality" },
    { key: "mother_tongue", label: "Mother Tongue" },

    { key: "birth_place", label: "Birth Place" },
    { key: "birth_taluka", label: "Birth Taluka" },
    { key: "birth_district", label: "Birth District" },
    { key: "birth_state", label: "Birth State" },
    { key: "birth_country", label: "Birth Country" },

    { key: "house", label: "House" },
    { key: "landmark", label: "Landmark" },

    { key: "aadhaar_number", label: "Aadhaar Number" },
    { key: "apaar_id", label: "APAAR ID" },
    { key: "pen_number", label: "PEN Number" },
    {
        key: "birth_certificate_no",
        label: "Birth Certificate No",
    },

    { key: "previous_school", label: "Previous School" },
    {
        key: "previous_school_u_dise_no",
        label: "Previous School U-DISE No",
    },
    {
        key: "previous_school_address",
        label: "Previous School Address",
    },
    {
        key: "previous_school_board",
        label: "Previous School Board",
    },
    {
        key: "previous_school_class",
        label: "Previous School Class",
    },
    {
        key: "previous_school_percentage_grade",
        label: "Previous School Percentage/Grade",
    },

    { key: "father_name", label: "Father Name" },
    {
        key: "father_birth_date",
        label: "Father Birth Date (DD-MM-YYYY)",
    },
    { key: "father_birth_place", label: "Father Birth Place" },
    { key: "father_religion", label: "Father Religion" },

    { key: "father_mobile", label: "Father Mobile" },
    { key: "father_whatsapp", label: "Father WhatsApp" },
    { key: "father_email", label: "Father Email" },

    {
        key: "father_pan_election_no",
        label: "Father PAN/Election No",
    },
    {
        key: "father_aadhaar_number",
        label: "Father Aadhaar Number",
    },

    { key: "father_occupation", label: "Father Occupation" },
    {
        key: "father_education_qualification",
        label: "Father Education Qualification",
    },
    { key: "father_income", label: "Father Income" },

    { key: "mother_name", label: "Mother Name" },
    {
        key: "mother_birth_date",
        label: "Mother Birth Date (DD-MM-YYYY)",
    },
    { key: "mother_birth_place", label: "Mother Birth Place" },
    { key: "mother_religion", label: "Mother Religion" },

    { key: "mother_mobile", label: "Mother Mobile" },
    { key: "mother_whatsapp", label: "Mother WhatsApp" },
    { key: "mother_email", label: "Mother Email" },

    {
        key: "mother_pan_election_no",
        label: "Mother PAN/Election No",
    },
    {
        key: "mother_aadhaar_number",
        label: "Mother Aadhaar Number",
    },

    { key: "mother_occupation", label: "Mother Occupation" },
    {
        key: "mother_education_qualification",
        label: "Mother Education Qualification",
    },
    { key: "mother_income", label: "Mother Income" },

    { key: "guardian_name", label: "Guardian Name" },
    { key: "guardian_relation", label: "Guardian Relation" },
    { key: "guardian_mobile", label: "Guardian Mobile" },

    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "pincode", label: "Pincode" },

    {
        key: "transport_required",
        label: "Transport Required",
    },
    {
        key: "hostel_required",
        label: "Hostel Required",
    },

    { key: "remarks", label: "Remarks" },
    { key: "other_illness", label: "Other Illness" },
    { key: "gr_no", label: "GR No" },
    { key: "sibling_info", label: "Sibling Info" },
    { key: "saral_id", label: "Saral ID" },
];

export default function Preview() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Load Preview Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        try {
            const storedData = sessionStorage.getItem(
                "student_import_preview"
            );

            if (!storedData) {
                alert("No Excel preview data found.");

                navigate(
                    "/student-management/students/bulk-import"
                );

                return;
            }

            const parsedData = JSON.parse(storedData);

            setRows(parsedData.data || []);
        } catch (error) {
            console.error(
                "Preview data error:",
                error
            );

            alert("Unable to load Excel preview.");

            navigate(
                "/student-management/students/bulk-import"
            );
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    /*
    |--------------------------------------------------------------------------
    | Cell Change
    |--------------------------------------------------------------------------
    */

    const handleCellChange = (rowIndex, column, value) => {
        setRows(previousRows => {
            const updatedRows = [...previousRows];

            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                [column]: value,
                _is_valid: false,
            };

            return updatedRows;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Cell Error
    |--------------------------------------------------------------------------
    */

    const getCellError = (
        rowIndex,
        column
    ) => {
        const row = rows[rowIndex];

        if (!row) {
            return "";
        }

        if (
            row._errors &&
            typeof row._errors === "object" &&
            row._errors[column]
        ) {
            return row._errors[column];
        }

        if (
            row.errors &&
            typeof row.errors === "object" &&
            row.errors[column]
        ) {
            return row.errors[column];
        }

        return "";
    };

    /*
    |--------------------------------------------------------------------------
    | Has Cell Error
    |--------------------------------------------------------------------------
    */

    const hasCellError = (
        rowIndex,
        column
    ) => {
        return Boolean(
            getCellError(
                rowIndex,
                column
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Invalid Rows
    |--------------------------------------------------------------------------
    */

    const invalidRows = rows.filter(
        (row) =>
            row &&
            row._errors &&
            Object.keys(row._errors).length > 0
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Valid Rows
    |--------------------------------------------------------------------------
    */

    const validRows =
        rows.length - invalidRows;

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const handleSave = async () => {
        if (!rows.length) {
            alert("No student data available.");
            return;
        }

        try {
            setSaving(true);

            // Re-validate the edited data before saving
            const validationResponse = await studentBulkImportApi.validate(rows);

            if (!validationResponse.data?.status) {
                alert(
                    validationResponse.data?.message ||
                    "Unable to validate student data."
                );
                return;
            }

            const validatedRows = validationResponse.data?.data || [];

            // Update rows with latest validation errors
            setRows(validatedRows);

            const invalidRecords =
                validationResponse.data?.invalid_records || 0;

            if (invalidRecords > 0) {
                alert("Please correct all highlighted errors before saving.");
                return;
            }

            // All records are valid
            const confirmed = window.confirm(
                `Are you sure you want to save ${validatedRows.length} student records?`
            );

            if (!confirmed) {
                return;
            }

            // Final import
            const response = await studentBulkImportApi.save(validatedRows);

            if (response.data?.status === true) {
                alert(
                    response.data?.message ||
                    "Student records inserted successfully"
                );

                sessionStorage.removeItem("student_import_preview");

                navigate("/student-management/students");
                return;
            }

            alert(
                response.data?.message ||
                "Unable to save student data."
            );

        } catch (error) {
            console.error("Student import save error:", error);

            const responseData = error.response?.data;

            alert(
                responseData?.message ||
                "Unable to save student data. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        sessionStorage.removeItem(
            "student_import_preview"
        );

        navigate(
            "/student-management/students/bulk-import"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="flex items-center gap-3 text-[#610e1e]">
                    <FaSpinner
                        className="animate-spin"
                        size={22}
                    />

                    <span className="font-medium">
                        Loading Excel preview...
                    </span>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Student Import Preview
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Review and correct the Excel data before
                        saving.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleBack}
                    disabled={saving}
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        text-gray-700
                        hover:bg-gray-50
                        transition
                        disabled:opacity-50
                    "
                >
                    <FaArrowLeft />
                    Back
                </button>

            </div>

            {/* ============================================================
                SUMMARY
            ============================================================ */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Total */}

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

                    <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                            <span className="font-bold">
                                #
                            </span>
                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Records
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                {rows.length}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Valid */}

                <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5">

                    <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                            <FaCheckCircle />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Valid Records
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                {validRows}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Invalid */}

                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">

                    <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                            <FaExclamationCircle />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Records With Errors
                            </p>

                            <p className="text-2xl font-bold text-red-600">
                                {invalidRows}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ============================================================
                VALIDATION MESSAGE
            ============================================================ */}

            {invalidRows > 0 && (
                <div className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-red-50
                    border
                    border-red-200
                    text-red-700
                ">

                    <FaExclamationCircle className="mt-0.5 flex-shrink-0" />

                    <div>

                        <p className="font-semibold">
                            Please correct the highlighted cells.
                        </p>

                        <p className="text-sm mt-1">
                            Records containing errors cannot be
                            saved until the errors are corrected.
                        </p>

                    </div>

                </div>
            )}

            {invalidRows === 0 &&
                rows.length > 0 && (
                    <div className="
                        flex
                        items-start
                        gap-3
                        p-4
                        rounded-xl
                        bg-green-50
                        border
                        border-green-200
                        text-green-700
                    ">

                        <FaCheckCircle className="mt-0.5 flex-shrink-0" />

                        <div>

                            <p className="font-semibold">
                                All preview records are valid.
                            </p>

                            <p className="text-sm mt-1">
                                You can review the data and save
                                the records.
                            </p>

                        </div>

                    </div>
                )}

            {/* ============================================================
                EXCEL TABLE
            ============================================================ */}

            <div className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-200
                overflow-hidden
            ">

                {/* Table Header */}

                <div className="
                    px-6
                    py-5
                    bg-gradient-to-r
                    from-[#610e1e]
                    to-[#8a1a2e]
                ">

                    <h2 className="text-xl font-semibold text-white">
                        Excel Data Preview
                    </h2>

                    <p className="text-sm text-white/70 mt-1">
                        Edit any value directly in the table.
                    </p>

                </div>

                {/* ========================================================
                    TABLE
                ======================================================== */}

                <div className="overflow-x-auto">

                    <table className="
                        min-w-max
                        border-collapse
                    ">

                        <thead>

                            <tr className="bg-gray-100">

                                {/* Serial Number */}

                                <th className="
                                    sticky
                                    left-0
                                    z-30
                                    bg-gray-100
                                    border
                                    border-gray-200
                                    px-4
                                    py-3
                                    text-center
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    min-w-[80px]
                                ">
                                    Sr. No.
                                </th>

                                {EXCEL_COLUMNS.map(
                                    (column) => (
                                        <th
                                            key={
                                                column.key
                                            }
                                            className="
                                                border
                                                border-gray-200
                                                px-4
                                                py-3
                                                text-left
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                                whitespace-nowrap
                                                min-w-[190px]
                                            "
                                        >
                                            {
                                                column.label
                                            }
                                        </th>
                                    )
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {rows.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            EXCEL_COLUMNS.length +
                                            1
                                        }
                                        className="
                                            px-6
                                            py-10
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        No student records found.
                                    </td>

                                </tr>

                            ) : (

                                rows.map(
                                    (
                                        row,
                                        rowIndex
                                    ) => (

                                        <tr
                                            key={
                                                rowIndex
                                            }
                                            className="
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* ==================================================
                                                SERIAL NUMBER
                                            ================================================== */}

                                            <td className="
                                                sticky
                                                left-0
                                                z-20
                                                bg-white
                                                border
                                                border-gray-200
                                                px-4
                                                py-2
                                                text-center
                                                text-sm
                                                font-medium
                                                text-gray-700
                                            ">
                                                {
                                                    rowIndex +
                                                    1
                                                }
                                            </td>

                                            {/* ==================================================
                                                EXCEL COLUMNS
                                            ================================================== */}

                                            {EXCEL_COLUMNS.map(
                                                (
                                                    column
                                                ) => {

                                                    const cellHasError =
                                                        hasCellError(
                                                            rowIndex,
                                                            column.key
                                                        );

                                                    const cellError =
                                                        getCellError(
                                                            rowIndex,
                                                            column.key
                                                        );

                                                    return (
                                                        <td
                                                            key={
                                                                column.key
                                                            }
                                                            className={`
                                                                border
                                                                border-gray-200
                                                                p-1
                                                                min-w-[190px]
                                                                align-top
                                                                ${
                                                                    cellHasError
                                                                        ? "bg-red-50"
                                                                        : "bg-white"
                                                                }
                                                            `}
                                                        >

                                                            <input
                                                                type="text"
                                                                value={
                                                                    row[
                                                                        column.key
                                                                    ] ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleCellChange(
                                                                        rowIndex,
                                                                        column.key,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`
                                                                    w-full
                                                                    px-3
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    text-sm
                                                                    outline-none
                                                                    transition
                                                                    ${
                                                                        cellHasError
                                                                            ? "border-red-500 bg-red-50 text-red-800 focus:ring-2 focus:ring-red-300"
                                                                            : "border-gray-200 bg-white text-gray-700 focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/20"
                                                                    }
                                                                `}
                                                            />

                                                            {cellHasError && (
                                                                <p className="
                                                                    text-xs
                                                                    text-red-600
                                                                    mt-1
                                                                    px-1
                                                                    leading-4
                                                                ">
                                                                    {
                                                                        cellError
                                                                    }
                                                                </p>
                                                            )}

                                                        </td>
                                                    );
                                                }
                                            )}

                                        </tr>
                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ============================================================
                BOTTOM ACTION
            ============================================================ */}

            <div className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-200
                p-5
            ">

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    items-center
                    justify-between
                    gap-4
                ">

                    <div>

                        <p className="font-semibold text-gray-800">
                            Ready to save?
                        </p>

                        <p className="text-sm text-gray-500 mt-1">

                            {invalidRows > 0
                                ? "Correct all highlighted errors before saving."
                                : "All records can be submitted for final database validation."
                            }

                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !rows.length}
                        className=" flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#610e1e] text-white font-semibold shadow-md hover:bg-[#4d0b18] transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed " > 
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Save & Import
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}