import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBook,
    FaRupeeSign,
} from "react-icons/fa";

import StatCard from "../components/dashboard/cards/StatCard";
import StudentChart from "../components/dashboard/charts/StudentChart";

export default function Dashboard() {
    return (
        <>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <StatCard
                    title="Students"
                    value="1250"
                    icon={<FaUserGraduate />}
                    color="#610e1e"
                    bgColor="#FFF5D9"
                    growth="+12%"
                />

                <StatCard
                    title="Teachers"
                    value="85"
                    icon={<FaChalkboardTeacher />}
                    color="#0F766E"
                    bgColor="#D1FAE5"
                    growth="+4%"
                />

                <StatCard
                    title="Courses"
                    value="12"
                    icon={<FaBook />}
                    color="#2563EB"
                    bgColor="#DBEAFE"
                />

                <StatCard
                    title="Revenue"
                    value="₹18.5L"
                    icon={<FaRupeeSign />}
                    color="#B45309"
                    bgColor="#FEF3C7"
                />

            </div>

            <StudentChart />

        </>
    );
}