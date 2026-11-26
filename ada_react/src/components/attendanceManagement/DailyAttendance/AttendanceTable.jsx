import AttendanceRow from "./AttendanceRow";

export default function AttendanceTable({

    students,

    setStudents,

}) {

    if (students.length === 0) {

        return (

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">

                No students found.

            </div>

        );

    }

    const uniqueClassIds = new Set(students.map(s => s.class_id).filter(Boolean));
    const uniqueSectionIds = new Set(students.map(s => s.section_id).filter(Boolean));
    const showClassSection = uniqueClassIds.size > 1 || uniqueSectionIds.size > 1;

    return (

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-[#610e1e] text-white">

                        <tr>

                            <th className="px-4 py-3 text-left">

                                Roll No

                            </th>

                            <th className="px-4 py-3 text-left">

                                Admission No

                            </th>

                            {showClassSection && (
                                <>
                                    <th className="px-4 py-3 text-left">

                                        Class

                                    </th>
                                    <th className="px-4 py-3 text-left">

                                        Section

                                    </th>
                                </>
                            )}

                            <th className="px-4 py-3 text-left">

                                Student Name

                            </th>

                            <th className="px-4 py-3 text-center">

                                Attendance

                            </th>

                            <th className="px-4 py-3 text-left">

                                Remarks

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            students.map((student, index) => (

                                <AttendanceRow

                                    key={student.student_id}

                                    student={student}

                                    index={index}

                                    students={students}

                                    setStudents={setStudents}

                                    showClassSection={showClassSection}

                                />

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}