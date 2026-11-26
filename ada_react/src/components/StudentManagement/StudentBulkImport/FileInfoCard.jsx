import {
    FaFileExcel,
    FaWeightHanging,
    FaCalendarAlt,
    FaFileAlt,
} from "react-icons/fa";

export default function FileInfoCard({ file }) {

    if (!file) return null;

    const fileSize = (file.size / 1024).toFixed(2);

    const modifiedDate = new Date(
        file.lastModified
    ).toLocaleString();

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e]">

                <h2 className="text-lg font-semibold text-white">

                    Selected File Information

                </h2>

            </div>

            {/* Body */}

            <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* File Name */}

                    <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">

                        <div className="flex items-center gap-3">

                            <FaFileExcel
                                className="text-green-600 text-2xl"
                            />

                            <div>

                                <p className="text-xs text-gray-500">

                                    File Name

                                </p>

                                <h4 className="font-semibold text-gray-800 break-all">

                                    {file.name}

                                </h4>

                            </div>

                        </div>

                    </div>

                    {/* File Size */}

                    <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">

                        <div className="flex items-center gap-3">

                            <FaWeightHanging
                                className="text-[#610e1e] text-2xl"
                            />

                            <div>

                                <p className="text-xs text-gray-500">

                                    File Size

                                </p>

                                <h4 className="font-semibold text-gray-800">

                                    {fileSize} KB

                                </h4>

                            </div>

                        </div>

                    </div>

                    {/* File Type */}

                    <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">

                        <div className="flex items-center gap-3">

                            <FaFileAlt
                                className="text-blue-600 text-2xl"
                            />

                            <div>

                                <p className="text-xs text-gray-500">

                                    File Type

                                </p>

                                <h4 className="font-semibold text-gray-800">

                                    {file.type || "Excel"}

                                </h4>

                            </div>

                        </div>

                    </div>

                    {/* Last Modified */}

                    <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">

                        <div className="flex items-center gap-3">

                            <FaCalendarAlt
                                className="text-orange-500 text-2xl"
                            />

                            <div>

                                <p className="text-xs text-gray-500">

                                    Last Modified

                                </p>

                                <h4 className="font-semibold text-gray-800 text-sm">

                                    {modifiedDate}

                                </h4>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}