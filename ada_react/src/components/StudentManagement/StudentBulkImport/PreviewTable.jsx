import {
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";

export default function PreviewTable({ rows = [] }) {

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e]">

                <h2 className="text-lg font-semibold text-white">

                    Student Preview

                </h2>

                <p className="text-sm text-white/70 mt-1">

                    Verify all uploaded student records before importing.

                </p>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left text-sm font-semibold">

                                Sr. No.

                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">

                                Admission No

                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">

                                Student Name

                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">

                                Class

                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">

                                Section

                            </th>

                            <th className="px-4 py-3 text-center text-sm font-semibold">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {rows.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-12 text-gray-500"
                                >

                                    No preview available.

                                </td>

                            </tr>

                        ) : (

                            rows.map((row, index) => (

                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50 transition"
                                >

                                    <td className="px-4 py-3">

                                        {index + 1}

                                    </td>

                                    <td className="px-4 py-3">

                                        {row.admission_no}

                                    </td>

                                    <td className="px-4 py-3">

                                        {row.first_name} {row.middle_name} {row.last_name}

                                    </td>

                                    <td className="px-4 py-3">

                                        {row.class}

                                    </td>

                                    <td className="px-4 py-3">

                                        {row.section}

                                    </td>

                                    <td className="px-4 py-3 text-center">

                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">

                                            <FaCheckCircle />

                                            Valid

                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}