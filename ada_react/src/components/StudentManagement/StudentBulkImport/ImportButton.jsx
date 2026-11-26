import {
    FaCloudUploadAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import studentBulkImportApi from "../../../services/studentBulkImportApi";

export default function ImportButton({

    previewData,

    setLoading,

    setProgress,

    setImportSummary,

}) {

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Handle Import
    |--------------------------------------------------------------------------
    */

    const handleImport = async () => {

        if (previewData.length === 0) {

            alert("No data to import.");

            return;

        }

        if (!confirm(`Are you sure you want to import ${previewData.length} students?`)) {

            return;

        }

        try {

            setLoading(true);

            setProgress(10);

            const response = await studentBulkImportApi.import(previewData);

            setProgress(50);

            if (response.data.status) {

                setProgress(80);

                setImportSummary({

                    total: response.data.total,

                    imported: response.data.imported,

                    failed: response.data.failed,

                    skipped: 0,

                });

                setProgress(100);

                // Redirect to student index after successful import
                setTimeout(() => {

                    navigate("/student-management/students");

                }, 2000);

            } else {

                alert(response.data.message || "Import failed.");

            }

        }

        catch (error) {

            console.error(error);

            alert("Import failed. Please try again.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex justify-end mt-6">

            <button

                onClick={handleImport}

                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold flex items-center gap-2 hover:scale-105 transition"

            >

                <FaCloudUploadAlt />

                Import Students

            </button>

        </div>

    );

}
