import {
    FaDatabase,
    FaCheckCircle,
    FaTimesCircle,
    FaForward,
    FaDownload,
} from "react-icons/fa";

export default function ImportSummary({ summary }) {

    if (!summary) return null;

    const cards = [

        {
            title: "Total Records",
            value: summary.total || 0,
            icon: <FaDatabase size={28} />,
            color: "from-blue-500 to-blue-700",
        },

        {
            title: "Imported",
            value: summary.imported || 0,
            icon: <FaCheckCircle size={28} />,
            color: "from-green-500 to-green-700",
        },

        {
            title: "Failed",
            value: summary.failed || 0,
            icon: <FaTimesCircle size={28} />,
            color: "from-red-500 to-red-700",
        },

        {
            title: "Skipped",
            value: summary.skipped || 0,
            icon: <FaForward size={28} />,
            color: "from-yellow-500 to-orange-500",
        },

    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e]">

                <h2 className="text-lg font-semibold text-white">

                    Import Summary

                </h2>

                <p className="text-sm text-white/70 mt-1">

                    Student import has been completed successfully.

                </p>

            </div>

            {/* Summary Cards */}

            <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {

                        cards.map((card, index) => (

                            <div
                                key={index}
                                className={`
                                    rounded-2xl
                                    bg-gradient-to-r
                                    ${card.color}
                                    text-white
                                    p-5
                                    shadow-lg
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

                                <div>

                                    {card.icon}

                                </div>

                            </div>

                        ))

                    }

                </div>

                {/* Footer */}

                <div className="mt-8 flex flex-wrap gap-4 justify-end">

                    {

                        summary.failed > 0 && (

                            <button
                                className="
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    font-semibold
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                "
                            >

                                <FaDownload />

                                Download Error Report

                            </button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}