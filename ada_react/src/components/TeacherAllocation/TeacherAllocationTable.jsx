import { Link } from "react-router-dom";

import {
    FaEye,
    FaEdit,
    FaTrash,
    FaUndo,
} from "react-icons/fa";

export default function TeacherAllocationTable({

    allocations = [],

    loading = false,

    inactive = false,

    onDelete,

    onRestore,

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-[#610e1e] text-white">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Academic Year
                        </th>

                        <th className="px-4 py-3 text-left">
                            Class
                        </th>

                        <th className="px-4 py-3 text-left">
                            Subject
                        </th>

                        <th className="px-4 py-3 text-left">
                            Teacher
                        </th>

                        <th className="px-4 py-3 text-center">
                            Status
                        </th>

                        <th className="px-4 py-3 text-center">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {loading ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="text-center py-10"
                            >

                                Loading...

                            </td>

                        </tr>

                    ) : allocations.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="text-center py-10 text-gray-500"
                            >

                                No Teacher Allocation Found.

                            </td>

                        </tr>

                    ) : (

                        allocations.map((allocation) => (

                            <tr
                                key={allocation.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="px-4 py-3">

                                    {allocation.academicYear?.academic_year}

                                </td>

                                <td className="px-4 py-3">

                                    {allocation.class?.class_name}

                                </td>

                                <td className="px-4 py-3">

                                    {allocation.subject?.subject_name}

                                </td>

                                <td className="px-4 py-3">

                                    {allocation.employee?.first_name}
                                    {" "}
                                    {allocation.employee?.last_name}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    {allocation.status ? (

                                        <span className="text-green-600 font-semibold">

                                            Active

                                        </span>

                                    ) : (

                                        <span className="text-red-600 font-semibold">

                                            Inactive

                                        </span>

                                    )}

                                </td>

                                <td className="px-4 py-3">

                                    <div className="flex justify-center gap-2">

                                        <Link
                                            to={`/academic-management/teacher-allocations/show/${allocation.id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                                        >
                                            <FaEye />
                                        </Link>

                                        {!inactive && (

                                            <>

                                                <Link
                                                    to={`/academic-management/teacher-allocations/edit/${allocation.id}`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                                >
                                                    <FaEdit />
                                                </Link>

                                                <button
                                                    onClick={() => onDelete(allocation.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </>

                                        )}

                                        {inactive && (

                                            <button
                                                onClick={() => onRestore(allocation.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                                            >

                                                <FaUndo />

                                            </button>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}