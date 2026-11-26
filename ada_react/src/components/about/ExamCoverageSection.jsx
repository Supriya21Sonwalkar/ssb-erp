import { motion } from "framer-motion";
import {
    FiShield,
    FiCompass,
    FiAward,
    FiStar,
} from "react-icons/fi";

const exams = [
    { title: "NDA", icon: FiShield },
    { title: "Indian Navy (Tech)", icon: FiCompass },
    { title: "Indian Army (Tech)", icon: FiShield },
    { title: "Air Force", icon: FiStar },
    { title: "Indian Navy", icon: FiCompass },
    { title: "NCC Special Entry", icon: FiAward },
    { title: "JEE Technical Entry", icon: FiStar },
    { title: "AFCAT", icon: FiAward },
];

export default function ExamCoverageSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-gray-50 overflow-hidden">

            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="block mb-4 uppercase tracking-[0.25em] text-sm font-bold text-[#610e1e]">
                        The Path Ahead
                    </span>

                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#610e1e]">
                        Comprehensive Exam Coverage
                    </h2>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                    {exams.map((exam, index) => {

                        const Icon = exam.icon;

                        return (
                            <motion.div
                                key={exam.title}
                                initial={{
                                    opacity: 0,
                                    y: 50,
                                    scale: 0.9,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.3,
                                }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                }}
                                className="group bg-white rounded-2xl border border-[#610e1e]/10 shadow-sm hover:shadow-xl hover:border-[#FFD963] transition-all duration-500 p-8 text-center cursor-pointer"
                            >

                                <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#FFD963]/20 flex items-center justify-center group-hover:bg-[#FFD963] transition-all duration-500">

                                    <Icon
                                        size={28}
                                        className="text-[#610e1e]"
                                    />

                                </div>

                                <h3 className="font-semibold text-[#610e1e] leading-6">
                                    {exam.title}
                                </h3>

                            </motion.div>
                        );

                    })}

                </div>

            </div>

        </section>
    );
}