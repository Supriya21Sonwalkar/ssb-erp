import { useRef } from "react";

import {
    FaCloudUploadAlt,
    FaFileExcel,
    FaTrash,
    FaEye,
} from "react-icons/fa";

import studentBulkImportApi from "../../../services/studentBulkImportApi";

export default function UploadCard({

    selectedFile,

    setSelectedFile,

    setPreviewData,

    setValidationSummary,

    setLoading,

    setProgress,

}) {

    const fileInputRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Browse File
    |--------------------------------------------------------------------------
    */

    const handleBrowse = () => {

        fileInputRef.current.click();

    };

    /*
    |--------------------------------------------------------------------------
    | File Selected
    |--------------------------------------------------------------------------
    */

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);

    };

    /*
    |--------------------------------------------------------------------------
    | Drag Drop
    |--------------------------------------------------------------------------
    */

    const handleDrop = (e) => {

        e.preventDefault();

        const file = e.dataTransfer.files[0];

        if (!file) return;

        setSelectedFile(file);

    };

    /*
    |--------------------------------------------------------------------------
    | Preview Excel
    |--------------------------------------------------------------------------
    */

    const handlePreview = async () => {

        if (!selectedFile) {

            alert("Please select an Excel file.");

            return;

        }

        try {

            setLoading(true);

            setProgress(20);

            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await studentBulkImportApi.preview(formData);

            setProgress(80);

            setPreviewData(response.data.data);

            setValidationSummary({

                total: response.data.total_records,

                valid: response.data.total_records,

                invalid: 0,

            });

            setProgress(100);

        }

        catch (error) {

            console.error(error);

            alert("Unable to preview Excel.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">

            {/* Header */}

            <div className="px-6 py-4 border-b">

                <h2 className="text-xl font-bold text-[#610e1e]">

                    Upload Student Excel

                </h2>

            </div>

            {/* Body */}

            <div className="p-8">

                <div

                    onDragOver={(e) => e.preventDefault()}

                    onDrop={handleDrop}

                    className="border-2 border-dashed border-[#FFD963] rounded-2xl p-12 text-center bg-[#FFFDF7]"

                >

                    <FaCloudUploadAlt

                        size={60}

                        className="mx-auto text-[#610e1e]"

                    />

                    <h3 className="mt-4 text-xl font-semibold">

                        Drag & Drop Excel File

                    </h3>

                    <p className="text-gray-500 mt-2">

                        or

                    </p>

                    <button

                        onClick={handleBrowse}

                        className="mt-5 px-6 py-3 rounded-xl bg-[#610e1e] text-white hover:bg-[#7c1830]"

                    >

                        Browse File

                    </button>

                    <input

                        ref={fileInputRef}

                        type="file"

                        accept=".xlsx,.xls,.csv"

                        hidden

                        onChange={handleFileChange}

                    />

                </div>

                {/* Selected File */}

                {selectedFile && (

                    <div className="mt-6 rounded-xl border p-5 flex justify-between items-center">

                        <div className="flex items-center gap-4">

                            <FaFileExcel

                                size={40}

                                className="text-green-600"

                            />

                            <div>

                                <h4 className="font-semibold">

                                    {selectedFile.name}

                                </h4>

                                <p className="text-sm text-gray-500">

                                    {(selectedFile.size / 1024).toFixed(2)} KB

                                </p>

                            </div>

                        </div>

                        <button

                            onClick={() => setSelectedFile(null)}

                            className="text-red-600"

                        >

                            <FaTrash size={22} />

                        </button>

                    </div>

                )}

                {/* Preview */}

                {selectedFile && (

                    <div className="flex justify-end mt-6">

                        <button

                            onClick={handlePreview}

                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#610e1e] to-[#8a1a2e] text-white font-semibold flex items-center gap-2"

                        >

                            <FaEye />

                            Preview Students

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}