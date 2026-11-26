import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
    FiCheck,
    FiBookOpen,
    FiAward,
    FiUsers,
    FiShield,
    FiSend,
    FiDownload,
    FiDollarSign,
} from "react-icons/fi";

const iconMap = {
    school: FiBookOpen,
    military_tech: FiShield,
    flight_takeoff: FiAward,
    groups: FiUsers,
    workspace_premium: FiAward,
    psychology: FiUsers,
};

export default function CourseCard({ course, index }) {

    const Icon = iconMap[course.icon_class] || FiBookOpen;

    return (

        <motion.div
    initial={{
        opacity: 0,
        x: index % 2 === 0 ? -120 : 120,
        scale: 0.96,
    }}
    whileInView={{
        opacity: 1,
        x: 0,
        scale: 1,
    }}
    transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
    }}
    viewport={{
        once: true,
        amount: 0.25,
    }}
    className={`bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col lg:flex-row ${
        index % 2 !== 0 ? "lg:flex-row-reverse" : ""
    }`}
>

            {/* Left Panel */}

<motion.div
    initial={{
        opacity: 0,
        scale: 0.85,
        rotate: -8,
    }}
    whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
    }}
    transition={{
        delay: 0.25,
        duration: 0.7,
    }}
    viewport={{ once: true }}
    className="lg:w-1/3 bg-[#610e1e] relative overflow-hidden flex items-center justify-center p-12"
>
                <div className="absolute top-8 left-8 text-[9rem] font-black text-white/5 select-none">
                    {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10 flex flex-col items-center">

                    <div className="w-24 h-24 rounded-2xl bg-[#FFD963] flex items-center justify-center shadow-xl">

                        <Icon
                            size={48}
                            className="text-[#610e1e]"
                        />

                    </div>

                    <span className="mt-8 text-white/40 text-6xl font-bold italic">
                        {String(index + 1).padStart(2, "0")}
                    </span>

                </div>

            </motion.div>

            {/* Right Panel */}

<motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
        delay: 0.3,
        duration: 0.7,
    }}
    viewport={{ once: true }}
    className="lg:w-2/3 p-8 md:p-12 flex flex-col justify-center"
>
                <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#610e1e] border-l-4 border-[#FFD963] pl-4 mb-4">

                    {course.subtitle}

                </p>

                <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#610e1e] mb-6">

                    {course.title}

                </h2>

                <p className="text-gray-600 leading-8 text-lg mb-10">

                    {course.description}

                </p>

                {/* Features */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

                    {course.features?.map((feature, i) => (

                        <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
            delay: 0.4 + i * 0.08,
            duration: 0.4,
        }}
        viewport={{ once: true }}
        className="flex items-center gap-3"
    >

                            <div className="w-7 h-7 rounded-full bg-[#610e1e]/10 flex items-center justify-center">

                                <FiCheck
                                    className="text-[#610e1e]"
                                    size={14}
                                />

                            </div>

                            <span className="text-gray-700">

                                {feature}

                            </span>

                        </motion.div>

                    ))}

                </div>

                {/* Fees */}

                {course.fees && (

                    <div className="flex items-center gap-5 bg-[#FFD963]/15 border border-[#FFD963] rounded-2xl p-6 mb-10">

                        <div className="w-14 h-14 rounded-xl bg-[#FFD963] flex items-center justify-center">

                            <FiDollarSign
                                size={28}
                                className="text-[#610e1e]"
                            />

                        </div>

                        <div>

                            <p className="uppercase tracking-[0.25em] text-[10px] text-gray-500 font-semibold">

                                Course Fees

                            </p>

                            <h3 className="text-3xl font-bold text-[#610e1e]">

                                ₹{Number(course.fees).toLocaleString("en-IN")}

                            </h3>

                        </div>

                    </div>

                )}

                {/* Buttons */}

<motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{
        delay: 0.7,
        duration: 0.5,
    }}
    viewport={{ once: true }}
    className="flex flex-wrap gap-4 border-t pt-8"
>
                    <Link
                        to={`/booking?course=${course.id}`}
                        className="px-8 py-4 rounded-xl bg-[#610e1e] text-white font-semibold hover:bg-[#FFD963] hover:text-[#610e1e] transition flex items-center gap-2"
                    >

                        🎯 Book Now

                    </Link>

                    <Link
                        to={`/contact?course=${course.id}`}
                        className="px-8 py-4 rounded-xl border-2 border-[#610e1e] text-[#610e1e] font-semibold hover:bg-[#610e1e] hover:text-white transition flex items-center gap-2"
                    >

                        <FiSend />

                        Enquire

                    </Link>

                    <button
                        className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:border-[#610e1e] hover:text-[#610e1e] transition flex items-center gap-2"
                    >

                        <FiDownload />

                        Brochure

                    </button>

                </motion.div>

            </motion.div>

        </motion.div>

    );

}