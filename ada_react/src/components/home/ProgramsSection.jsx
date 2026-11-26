import { motion } from "framer-motion";

const programs = [
    {
        icon: "🎓",
        title: "NDA Foundation",
        subtitle: "National Defence Academy",
        description:
            "Comprehensive coaching for NDA written examination, SSB interview and personality development.",
    },
    {
        icon: "⚔️",
        title: "CDS Preparation",
        subtitle: "Combined Defence Services",
        description:
            "Complete preparation for CDS written examination with expert mentoring and interview guidance.",
    },
    {
        icon: "✈️",
        title: "AFCAT Training",
        subtitle: "Indian Air Force",
        description:
            "Specialized coaching for AFCAT with aptitude development and officer-like qualities.",
    },
    {
        icon: "👥",
        title: "SSB Interview",
        subtitle: "5-Day Interview Process",
        description:
            "Psychological tests, GTO tasks, personal interview and complete officer personality grooming.",
    },
    {
        icon: "🏆",
        title: "Military School",
        subtitle: "Foundation Course",
        description:
            "Early preparation for Rashtriya Military School, Sainik School and RIMC entrance examinations.",
    },
    {
        icon: "🧠",
        title: "Personality Development",
        subtitle: "Leadership Program",
        description:
            "Communication skills, confidence building, leadership qualities and discipline enhancement.",
    },
];

export default function ProgramsSection() {
    return (
        <section className="relative bg-gradient-to-b from-[#faf8f4] to-[#f5f0e8] py-24 px-6 md:px-12 overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#610e1e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block text-primary font-bold uppercase tracking-[0.25em] text-xs px-4 py-2 rounded-full border-2 border-[#FFD963]/30 bg-[#FFD963]/10"
                    >
                        OUR PROGRAMS
                    </motion.span>

                    <h2 className="mt-3 font-heading font-bold text-3xl md:text-4xl text-primary">
                        Six Pathways into the Indian Armed Forces
                    </h2>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                    {programs.map((program, index) => (

                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group bg-white rounded-xl p-6 md:p-8 shadow-sm border border-transparent hover:border-[#FFD963]/30 hover:shadow-2xl transition-all duration-500"
                        >

                            {/* Icon */}
                            <div className="relative overflow-hidden flex items-center justify-center w-14 h-14 rounded-lg bg-primary text-white text-2xl mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110">

                                <div className="absolute inset-0 bg-[#FFD963] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                                <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                                    {program.icon}
                                </span>

                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-2">
                                {program.title}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest mb-3">
                                {program.subtitle}
                            </p>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {program.description}
                            </p>

                            {/* Learn More */}
                            <button className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] transition-all duration-300 group-hover:gap-4">
                                LEARN MORE

                                <span className="text-[#FFD963] transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}
