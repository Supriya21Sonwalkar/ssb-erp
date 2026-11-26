export default function LectureAttendanceRow({
    student,
    index,
    students,
    setStudents,
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
            <td className="px-4 py-3 text-center font-medium">
                {student.roll_no}
            </td>


            {/* Admission No */}
            <td className="px-4 py-3">
                {student.admission_no}
            </td>


            {/* Student Name */}
            <td className="px-4 py-3 font-medium">
                {student.student_name}
            </td>


            {/* Attendance */}
            <td className="px-4 py-3">

                <div className="flex justify-center gap-8">

                    {/* Present */}
                    <label className="flex items-center gap-2 cursor-pointer">

                        <input
                            type="radio"
                            name={`lecture-attendance-${student.student_id}`}
                            checked={
                                student.attendance_status === "P"
                            }
                            onChange={() =>
                                updateStudent(
                                    "attendance_status",
                                    "P"
                                )
                            }
                            className="w-4 h-4"
                        />

                        <span className="text-green-600 font-semibold">
                            Present
                        </span>

                    </label>


                    {/* Absent */}
                    <label className="flex items-center gap-2 cursor-pointer">

                        <input
                            type="radio"
                            name={`lecture-attendance-${student.student_id}`}
                            checked={
                                student.attendance_status === "A"
                            }
                            onChange={() =>
                                updateStudent(
                                    "attendance_status",
                                    "A"
                                )
                            }
                            className="w-4 h-4"
                        />

                        <span className="text-red-600 font-semibold">
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
                    placeholder="Remarks"
                    className="
                        border
                        rounded-lg
                        px-3
                        py-2
                        w-full
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#610e1e]
                    "
                />

            </td>

        </tr>
    );
}