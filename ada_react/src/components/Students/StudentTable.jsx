import { Link } from "react-router-dom";

export default function StudentTable({

    students,

    loading,

    onDelete,

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full text-sm">

                <thead className="bg-[#610e1e] text-white">

                    <tr>

                        <th className="px-3 py-3 text-left">
                            Admission No
                        </th>

                        <th className="px-3 py-3 text-left">
                            Student
                        </th>

                        <th className="px-3 py-3 text-left">
                            Class
                        </th>

                        <th className="px-3 py-3 text-left">
                            Section
                        </th>

                        <th className="px-3 py-3 text-left">
                            Parent
                        </th>

                        <th className="px-3 py-3 text-left">
                            Mobile
                        </th>

                        <th className="px-3 py-3 text-center">
                            Status
                        </th>

                        <th className="px-3 py-3 text-center">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {loading ? (

                        <tr>

                            <td
                                colSpan="8"
                                className="text-center py-8"
                            >
                                Loading Students...
                            </td>

                        </tr>

                    ) : students.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                className="text-center py-8 text-gray-500"
                            >
                                No Students Found.
                            </td>

                        </tr>

                    ) : (

                        students.map((student) => (

                            <tr
                                key={student.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="px-3 py-3 font-medium">

                                    {student.admission_no}

                                </td>

                                <td className="px-3 py-3">

                                    <div className="flex items-center gap-3">

                                        <div>

                                            {student.photo ? (

                                                <img

                                                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${student.photo}`}

                                                    alt={student.full_name}

                                                    className="w-10 h-10 rounded-full object-cover border"

                                                />

                                            ) : (

                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">

                                                    👤

                                                </div>

                                            )}

                                        </div>

                                        <div>

                                            <div className="font-semibold">

                                                {student.full_name}

                                            </div>

                                            <div className="text-xs text-gray-500">

                                                {student.student_code}

                                            </div>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-3 py-3">

                                    {student.class?.class_name ?? "-"}

                                </td>

                                <td className="px-3 py-3">

                                    {student.section?.section_name ?? "-"}

                                </td>

                                <td className="px-3 py-3">

                                    {student.parents?.length > 0

                                        ? student.parents[0].father_name

                                        : "-"}

                                </td>

                                <td className="px-3 py-3">

                                    {student.parents?.length > 0

                                        ? student.parents[0].father_mobile

                                        : "-"}

                                </td>

                                <td className="px-3 py-3 text-center">

                                    {student.status ? (

                                        <span className="text-green-600 font-semibold">

                                            Active

                                        </span>

                                    ) : (

                                        <span className="text-red-600 font-semibold">

                                            Inactive

                                        </span>

                                    )}

                                </td>

                                <td className="px-3 py-3">

                                    <div className="flex justify-center gap-2">

                                        <Link

                                            to={`/student-management/students/show/${student.id}`}

                                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"

                                        >
                                            View
                                        </Link>

                                        <Link

                                            to={`/student-management/students/edit/${student.id}`}

                                            className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600"

                                        >
                                            Edit
                                        </Link>

                                        <button

                                            onClick={() => onDelete(student.id)}

                                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"

                                        >
                                            Inactive
                                        </button>

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