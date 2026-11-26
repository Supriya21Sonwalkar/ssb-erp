import {
    FaUsers,
    FaCheckCircle,
    FaTimesCircle,
    FaPercentage,
} from "react-icons/fa";

const isPresent = (status) => status === "Present" || status === "P";
const isAbsent = (status) => status === "Absent" || status === "A";

export default function AttendanceSummary({ students }) {

    const totalStudents = students.length;

    const present = students.filter(
        (student) => isPresent(student.attendance_status)
    ).length;

    const absent = students.filter(
        (student) => isAbsent(student.attendance_status)
    ).length;

    const unmarked = totalStudents - present - absent;

    const percentage =
        totalStudents > 0
            ? ((present / totalStudents) * 100).toFixed(2)
            : 0;

    const cards = [
        {
            title: "Total Students",
            value: totalStudents,
            color: "bg-blue-500",
            icon: <FaUsers size={22} />,
        },
        {
            title: "Present",
            value: present,
            color: "bg-green-500",
            icon: <FaCheckCircle size={22} />,
        },
        {
            title: "Absent",
            value: absent,
            color: "bg-red-500",
            icon: <FaTimesCircle size={22} />,
        },
        {
            title: "Unmarked",
            value: unmarked,
            color: "bg-gray-500",
            icon: <FaUsers size={22} />,
        },
        {
            title: "Attendance %",
            value: `${percentage}%`,
            color: "bg-[#610e1e]",
            icon: <FaPercentage size={22} />,
        },
    ];

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden border"
                >

                    <div
                        className={`${card.color} text-white flex justify-between items-center px-4 py-3`}
                    >

                        <span className="font-semibold">

                            {card.title}

                        </span>

                        {card.icon}

                    </div>

                    <div className="text-center py-6">

                        <h2 className="text-3xl font-bold text-gray-800">

                            {card.value}

                        </h2>

                    </div>

                </div>

            ))}

        </div>

    );

}