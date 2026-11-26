import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon,
    color = "#610e1e",
    bgColor = "#FFF8E6",
    growth,
}) {
    return (
        <motion.div
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
        >
            <div className="flex items-start justify-between">

                {/* Left Content */}
                <div>

                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-3 text-[#610e1e]">
                        {value}
                    </h2>

                    {growth && (
                        <p className="mt-3 text-sm font-semibold text-green-600">
                            {growth}
                        </p>
                    )}

                </div>

                {/* Icon */}
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{
                        backgroundColor: bgColor,
                        color: color,
                    }}
                >
                    <span className="text-3xl">
                        {icon}
                    </span>
                </div>

            </div>

            {/* Bottom Accent Line */}
            <div
                className="mt-6 h-1 rounded-full"
                style={{
                    backgroundColor: color,
                }}
            />
        </motion.div>
    );
}