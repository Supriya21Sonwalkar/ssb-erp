import {
    FaDatabase,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

export default function ValidationSummary({ summary }) {

    const cards = [

        {
            title: "Total Records",
            value: summary.total || 0,
            icon: <FaDatabase size={28} />,
            bg: "from-blue-500 to-blue-700",
        },

        {
            title: "Valid Records",
            value: summary.valid || 0,
            icon: <FaCheckCircle size={28} />,
            bg: "from-green-500 to-green-700",
        },

        {
            title: "Invalid Records",
            value: summary.invalid || 0,
            icon: <FaTimesCircle size={28} />,
            bg: "from-red-500 to-red-700",
        },

        {
            title: "Duplicate Records",
            value: summary.duplicate || 0,
            icon: <FaExclamationTriangle size={28} />,
            bg: "from-yellow-500 to-orange-500",
        },

    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e]">

                <h2 className="text-lg font-semibold text-white">

                    Validation Summary

                </h2>

                <p className="text-sm text-white/70 mt-1">

                    Summary of the uploaded Excel after validation.

                </p>

            </div>

            {/* Cards */}

            <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {cards.map((card, index) => (

                        <div
                            key={index}
                            className={`
                                rounded-2xl
                                bg-gradient-to-r
                                ${card.bg}
                                text-white
                                shadow-lg
                                p-5
                                flex
                                justify-between
                                items-center
                            `}
                        >

                            <div>

                                <p className="text-sm opacity-90">

                                    {card.title}

                                </p>

                                <h2 className="text-3xl font-bold mt-2">

                                    {card.value}

                                </h2>

                            </div>

                            <div className="opacity-90">

                                {card.icon}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}   