import { motion } from "framer-motion";
import {
    FiAward,
    FiHome,
    FiShield,
    FiTarget,
} from "react-icons/fi";

const highlights = [
    {
        icon: FiAward,
        title: "Holistic",
        subtitle: "Academic + SSB + Fitness",
    },
    {
        icon: FiHome,
        title: "Residential",
        subtitle: "Distraction-free campus",
    },
    {
        icon: FiShield,
        title: "Honest",
        subtitle: "No false promises, real guidance",
    },
    {
        icon: FiTarget,
        title: "Disciplined",
        subtitle: "Defence-style daily routine",
    },
];

export default function ResultHighlights() {
    return (
        <section className="bg-gray-50 border-t border-[#610e1e]/5 py-24 px-6 md:px-12">

            <div className="max-w-7xl mx-auto">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-[#610e1e] text-sm font-bold uppercase tracking-[0.2em]">

                        Result Highlights

                    </span>

                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#610e1e] mt-4">

                        Proven results across NDA, SSB, CDS and AFCAT

                    </h2>

                    <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-8">

                        Student transformation through disciplined
                        training — academics, fitness and personality,
                        every single day.

                    </p>

                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {highlights.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-2xl border border-transparent hover:border-[#FFD963]/40 transition-all duration-300"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#610e1e]/10 flex items-center justify-center group-hover:bg-[#610e1e] transition-all duration-300">

                                    <Icon
                                        size={30}
                                        className="text-[#610e1e] group-hover:text-[#FFD963] transition-colors duration-300"
                                    />

                                </div>

                                <h3 className="font-heading text-2xl font-bold text-[#610e1e] mb-3">

                                    {item.title}

                                </h3>

                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 leading-6">

                                    {item.subtitle}

                                </p>
                            </motion.div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}