import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const data = [
    { month: "Jan", students: 780 },
    { month: "Feb", students: 840 },
    { month: "Mar", students: 910 },
    { month: "Apr", students: 980 },
    { month: "May", students: 1050 },
    { month: "Jun", students: 1120 },
    { month: "Jul", students: 1250 },
];

export default function StudentChart() {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#610e1e]">
                        Student Growth
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Monthly Student Admissions
                    </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#FFF5D9] text-[#610e1e] text-sm font-semibold">
                    2026
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>

                        <defs>
                            <linearGradient id="studentFill" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#610e1e"
                                    stopOpacity={0.45}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#610e1e"
                                    stopOpacity={0.02}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#ECECEC"
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="students"
                            stroke="#610e1e"
                            strokeWidth={4}
                            fill="url(#studentFill)"
                        />

                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}