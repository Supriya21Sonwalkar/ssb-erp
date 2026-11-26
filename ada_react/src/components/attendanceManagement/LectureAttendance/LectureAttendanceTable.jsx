import LectureAttendanceRow from "./LectureAttendanceRow";

export default function LectureAttendanceTable({
    students,
    setStudents,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-bold text-[#610e1e]">
                    Student Attendance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Mark each student's attendance for this lecture.
                </p>
            </div>


            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-[#610e1e] text-white">

                        <tr>

                            {/* Roll No */}
                            <th className="px-4 py-3 text-center whitespace-nowrap">
                                Roll No
                            </th>

                            {/* Admission No */}
                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Admission No
                            </th>

                            {/* Student Name */}
                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Student Name
                            </th>

                            {/* Attendance */}
                            <th className="px-4 py-3 text-center whitespace-nowrap">
                                Attendance
                            </th>

                            {/* Remarks */}
                            <th className="px-4 py-3 text-left whitespace-nowrap">
                                Remarks
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student, index) => (
                            <LectureAttendanceRow
                                key={student.student_id}
                                student={student}
                                index={index}
                                students={students}
                                setStudents={setStudents}
                            />
                        ))}

                    </tbody>

                </table>

            </div>


            {/* Empty State */}
            {students.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No students available.
                </div>
            )}

        </div>
    );
}