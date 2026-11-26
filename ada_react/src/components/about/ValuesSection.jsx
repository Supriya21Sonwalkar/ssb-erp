import { motion } from "framer-motion";
import {
    FiShield,
    FiTarget,
    FiZap,
    FiFlag,
} from "react-icons/fi";

const values = [
    {
        title: "Discipline",
        description: "The cornerstone of our academy life.",
        icon: FiShield,
    },
    {
        title: "Integrity",
        description: "Moral uprightness in every action.",
        icon: FiTarget,
    },
    {
        title: "Courage",
        description: "Bravery to face any situation.",
        icon: FiZap,
    },
    {
        title: "Patriotism",
        description: "Devotion to the motherland.",
        icon: FiFlag,
    },
];

export default function ValuesSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="block text-sm uppercase tracking-[0.25em] font-bold text-[#610e1e] mb-4">
                        Our Core Values
                    </span>

                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#610e1e]">
                        Values That Shape Every Cadet
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {values.map((value, index) => {

                        const Icon = value.icon;

                        return (
                            <motion.div
                                key={value.title}
                                initial={{
                                    opacity: 0,
                                    y: 60,
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
                                    amount: 0.25,
                                }}
                                whileHover={{
                                    y: -10,
                                }}
                                className="group text-center bg-white rounded-3xl p-8 border border-[#610e1e]/10 shadow-sm hover:shadow-2xl hover:border-[#FFD963] transition-all duration-500"
                            >

                                {/* Icon */}
                                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFD963] flex items-center justify-center shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">

                                    <Icon
                                        size={34}
                                        className="text-[#610e1e]"
                                    />

                                </div>

                                {/* Title */}
                                <h3 className="mt-8 text-2xl font-bold text-[#610e1e] font-heading">

                                    {value.title}

                                </h3>

                                {/* Divider */}
                                <div className="w-12 h-1 rounded-full bg-[#FFD963] mx-auto my-5 group-hover:w-20 transition-all duration-500" />

                                {/* Description */}
                                <p className="text-gray-600 leading-7">

                                    {value.description}

                                </p>

                            </motion.div>
                        );

                    })}

                </div>

            </div>

        </section>
    );
}