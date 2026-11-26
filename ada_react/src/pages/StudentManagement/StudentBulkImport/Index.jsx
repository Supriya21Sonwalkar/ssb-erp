import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFileExcel,
    FaUpload,
    FaArrowLeft,
    FaSpinner,
} from "react-icons/fa";

import studentBulkImportApi from "../../../services/studentBulkImportApi";

export default function Index() {
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        const allowedExtensions = [".xlsx", ".xls", ".csv"];

        const fileName = file.name.toLowerCase();

        const isValidFile = allowedExtensions.some((extension) =>
            fileName.endsWith(extension)
        );

        if (!isValidFile) {
            alert("Please select a valid Excel file (.xlsx, .xls or .csv).");
            event.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const handleImportData = async () => {
        if (!selectedFile) {
            alert("Please select an Excel file first.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            /*
             * IMPORTANT:
             * This API will only read and validate the Excel file.
             *
             * It will NOT insert anything into the database.
             */
            const response = await studentBulkImportApi.preview(formData);

            if (!response.data?.status) {
                alert(
                    response.data?.message ||
                        "Unable to process the Excel file."
                );
                return;
            }

            /*
             * Store preview data temporarily in sessionStorage.
             *
             * This allows the Preview page to display and edit
             * the imported Excel data.
             */
            sessionStorage.setItem(
                "student_import_preview",
                JSON.stringify(response.data)
            );

            navigate("/student-management/students/bulk-import/preview");
        } catch (error) {
            console.error("Excel preview error:", error);

            const message =
                error.response?.data?.message ||
                "Unable to process the Excel file. Please try again.";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);

        const input = document.getElementById(
            "student-excel-file"
        );

        if (input) {
            input.value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Student Bulk Import
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Upload an Excel file to preview and validate student
                        data before saving.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-lg
                        border border-gray-300
                        bg-white
                        text-gray-700
                        hover:bg-gray-50
                        transition
                    "
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#FFD963] text-[#610e1e] flex items-center justify-center">
                            <FaFileExcel size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Select Excel File
                            </h2>

                            <p className="text-sm text-white/70 mt-1">
                                Select the student registration Excel file to
                                continue.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="p-8">
                    <label
                        htmlFor="student-excel-file"
                        className="
                            block
                            border-2
                            border-dashed
                            border-gray-300
                            rounded-2xl
                            p-10
                            text-center
                            cursor-pointer
                            hover:border-[#610e1e]
                            hover:bg-[#610e1e]/5
                            transition
                        "
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className="
                                    w-16 h-16
                                    rounded-full
                                    bg-[#610e1e]/10
                                    text-[#610e1e]
                                    flex items-center justify-center
                                    mb-4
                                "
                            >
                                <FaUpload size={26} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800">
                                Choose Excel File
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Click here to select your student Excel file
                            </p>

                            <p className="text-xs text-gray-400 mt-2">
                                Supported formats: .xlsx, .xls, .csv
                            </p>
                        </div>

                        <input
                            id="student-excel-file"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {/* Selected File */}
                    {selectedFile && (
                        <div className="mt-6">
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    p-4
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                "
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div
                                        className="
                                            w-12 h-12
                                            rounded-lg
                                            bg-green-100
                                            text-green-600
                                            flex items-center justify-center
                                            flex-shrink-0
                                        "
                                    >
                                        <FaFileExcel size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">
                                            {selectedFile.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {(
                                                selectedFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={loading}
                                    className="
                                        px-3 py-2
                                        text-sm
                                        font-medium
                                        text-red-600
                                        hover:bg-red-50
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Import Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={handleImportData}
                            disabled={!selectedFile || loading}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                min-w-[160px]
                                px-6
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                                shadow-md
                                bg-[#610e1e]
                                text-white
                                hover:bg-[#4d0b18]
                                disabled:bg-gray-300
                                disabled:text-gray-500
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaUpload />
                                    Import Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}