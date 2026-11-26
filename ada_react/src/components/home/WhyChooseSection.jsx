import { motion } from "framer-motion";

const features = [
    {
        icon: "🛡️",
        title: "Early & Honest Preparation",
        description:
            "No false promises. We start from the basics to build a foundation that lasts a lifetime.",
    },
    {
        icon: "🌟",
        title: "Holistic Development",
        description:
            "Focus on personality, communication, and mindset along with academic excellence.",
    },
    {
        icon: "⏰",
        title: "Discipline & Routine",
        description:
            "A strictly residential program that instills officer-like qualities from day one.",
    },
    {
        icon: "🤝",
        title: "Mentorship that Lasts",
        description:
            "Guided by retired SSB panel members who understand exactly what the armed forces seek.",
    },
];

export default function WhyChooseSection() {
    return (
        <section className="relative bg-gradient-to-b from-[#f5f0e8] to-[#faf8f4] py-24 px-6 md:px-12 border-t border-primary/5 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#610e1e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

            <div className="relative max-w-7xl mx-auto">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">
                        WHY CHOOSE US
                    </span>

                    <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-primary">
                        Building Future Defence Officers
                    </h2>

                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Our training philosophy focuses on developing confidence,
                        discipline, leadership and the officer-like qualities required
                        to succeed in the Indian Armed Forces.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {features.map((feature, index) => (

                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group bg-white rounded-2xl p-8 text-center lg:text-left shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#FFD963]/40"
                        >

                            {/* Icon */}
                            <div className="relative w-16 h-16 mx-auto lg:mx-0 mb-6 rounded-full bg-[#FFD963] flex items-center justify-center text-3xl shadow-lg overflow-hidden">

                                <div className="absolute inset-0 bg-primary scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></div>

                                <span className="relative z-10 group-hover:scale-110 transition-all duration-300 group-hover:text-white">
                                    {feature.icon}
                                </span>

                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-xl font-bold text-primary mb-4">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-7">
                                {feature.description}
                            </p>

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}