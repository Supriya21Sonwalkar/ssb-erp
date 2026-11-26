const isPresent = (status) => status === "Present" || status === "P";
const isAbsent = (status) => status === "Absent" || status === "A";

export default function AttendanceRow({

    student,

    index,

    students,

    setStudents,

    showClassSection = false,

}) {

    /*
    |--------------------------------------------------------------------------
    | Update Student
    |--------------------------------------------------------------------------
    */

    const updateStudent = (field, value) => {

        const updatedStudents = [...students];

        updatedStudents[index] = {

            ...updatedStudents[index],

            [field]: value,

        };

        setStudents(updatedStudents);

    };

    return (

        <tr className="border-b hover:bg-gray-50">

            {/* Roll No */}

            <td className="px-4 py-3">

                {student.roll_no}

            </td>

            {/* Admission No */}

            <td className="px-4 py-3">

                {student.admission_no}

            </td>

            {/* Class & Section (only shown if needed) */}

            {showClassSection && (
                <>
                    <td className="px-4 py-3">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                            {student.class_name || "-"}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        <span className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                            {student.section_name || "-"}
                        </span>
                    </td>
                </>
            )}

            {/* Student Name */}

            <td className="px-4 py-3 font-medium">

                {student.student_name}

            </td>

            {/* Attendance */}

            <td className="px-4 py-3">

                <div className="flex justify-center gap-6">

                    {/* Present */}
<label className="flex items-center gap-2 cursor-pointer">
    <input
        type="radio"
        name={`attendance-${student.student_id}`}
        checked={isPresent(student.attendance_status)}
        onChange={() =>
            updateStudent("attendance_status", "P")
        }
        className="w-4 h-4 text-green-600 focus:ring-green-500"
    />
    <span className="text-green-600 font-bold text-base">
        Present
    </span>
</label>

{/* Absent */}
<label className="flex items-center gap-2 cursor-pointer">
    <input
        type="radio"
        name={`attendance-${student.student_id}`}
        checked={isAbsent(student.attendance_status)}
        onChange={() =>
            updateStudent("attendance_status", "A")
        }
        className="w-4 h-4 text-red-600 focus:ring-red-500"
    />
    <span className="text-red-600 font-bold text-base">
        Absent
    </span>
</label>

                </div>

            </td>

            {/* Remarks */}

            <td className="px-4 py-3">

                <input

                    type="text"

                    value={student.remarks || ""}

                    onChange={(e) =>
                        updateStudent(
                            "remarks",
                            e.target.value
                        )
                    }

                    placeholder="Remarks (optional)"

                    className="border rounded-lg px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#610e1e] focus:border-transparent"

                />

            </td>

        </tr>

    );

}