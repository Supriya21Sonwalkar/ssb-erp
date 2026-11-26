import {
    FaSpinner,
    FaCheckCircle,
} from "react-icons/fa";

export default function ProgressCard({

    progress = 0,

    title = "Processing",

    description = "Please wait...",

    completed = false,

}) {

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 bg-gradient-to-r from-[#610e1e] to-[#8a1a2e]">

                <h2 className="text-lg font-semibold text-white">

                    Import Progress

                </h2>

            </div>

            {/* Body */}

            <div className="p-8">

                <div className="flex items-center gap-4">

                    {

                        completed ?

                            <FaCheckCircle
                                className="text-green-600 text-3xl"
                            />

                            :

                            <FaSpinner
                                className="text-[#610e1e] text-3xl animate-spin"
                            />

                    }

                    <div>

                        <h3 className="text-xl font-semibold text-gray-800">

                            {title}

                        </h3>

                        <p className="text-gray-500 mt-1">

                            {description}

                        </p>

                    </div>

                </div>

                {/* Progress */}

                <div className="mt-8">

                    <div className="flex justify-between text-sm text-gray-600 mb-2">

                        <span>

                            Progress

                        </span>

                        <span>

                            {progress}%

                        </span>

                    </div>

                    <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">

                        <div

                            className="h-full bg-gradient-to-r from-[#FFD963] to-[#610e1e] transition-all duration-500"

                            style={{

                                width: `${progress}%`

                            }}

                        />

                    </div>

                </div>

            </div>

        </div>

    );

}