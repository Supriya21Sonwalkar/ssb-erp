import { FaDownload, FaFileExcel, FaInfoCircle } from "react-icons/fa";
import studentBulkImportApi from "../../../services/studentBulkImportApi";

export default function TemplateDownloadCard() {

    /*
    |--------------------------------------------------------------------------
    | Download Sample Excel
    |--------------------------------------------------------------------------
    */

    const handleDownload = async () => {

        try {

            const response = await studentBulkImportApi.downloadSample();

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "Student_Registration_Template.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            alert("Unable to download template.");

        }

    };

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow-lg
                border
                border-gray-200
                overflow-hidden
            "
        >

            {/* Header */}

            <div
                className="
                    px-6
                    py-4
                    border-b
                    bg-gradient-to-r
                    from-[#610e1e]
                    to-[#7c1830]
                    text-white
                "
            >

                <div className="flex items-center gap-3">

                    <FaFileExcel
                        className="text-[#FFD963]"
                        size={24}
                    />

                    <div>

                        <h2 className="text-lg font-bold">

                            Download Student Import Template

                        </h2>

                        <p className="text-sm text-white/80">

                            Download the official Excel template before importing students.

                        </p>

                    </div>

                </div>

            </div>

            {/* Body */}

            <div className="p-6">

                <div
                    className="
                        grid
                        lg:grid-cols-2
                        gap-6
                    "
                >

                    {/* Left */}

                    <div>

                        <h3
                            className="
                                font-semibold
                                text-[#610e1e]
                                mb-3
                            "
                        >

                            Supported Format

                        </h3>

                        <div className="space-y-2 text-sm text-gray-600">

                            <p>• Microsoft Excel (.xlsx)</p>

                            <p>• Microsoft Excel (.xls)</p>

                            <p>• CSV (.csv)</p>

                        </div>

                    </div>

                    {/* Right */}

                    <div>

                        <h3
                            className="
                                font-semibold
                                text-[#610e1e]
                                mb-3
                            "
                        >

                            Important Notes

                        </h3>

                        <div className="space-y-2 text-sm text-gray-600">

                            <div className="flex gap-2">

                                <FaInfoCircle className="mt-1 text-[#FFD963]" />

                                <span>
                                    Do not change column names.
                                </span>

                            </div>

                            <div className="flex gap-2">

                                <FaInfoCircle className="mt-1 text-[#FFD963]" />

                                <span>
                                    Fill one student per row.
                                </span>

                            </div>

                            <div className="flex gap-2">

                                <FaInfoCircle className="mt-1 text-[#FFD963]" />

                                <span>
                                    Keep the header row unchanged.
                                </span>

                            </div>

                            <div className="flex gap-2">

                                <FaInfoCircle className="mt-1 text-[#FFD963]" />

                                <span>
                                    Mandatory fields should not be left blank.
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Download Button */}

                <div className="mt-8 flex justify-end">

                    <button
                        onClick={handleDownload}
                        className="
                            inline-flex
                            items-center
                            gap-3
                            px-6
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-[#610e1e]
                            to-[#8b1f38]
                            text-white
                            font-semibold
                            shadow-lg
                            hover:scale-105
                            transition
                        "
                    >

                        <FaDownload />

                        Download Sample Excel

                    </button>

                </div>

            </div>

        </div>

    );

}