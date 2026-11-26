import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const values = [
    {
        icon: "🎖️",
        title: "Discipline",
        description: "The foundation of everything we do.",
    },
    {
        icon: "💎",
        title: "Integrity",
        description: "Unwavering honesty in preparation.",
    },
    {
        icon: "🦁",
        title: "Courage",
        description: "Facing challenges head-on.",
    },
    {
        icon: "🇮🇳",
        title: "Patriotism",
        description: "Serving the nation with pride.",
    },
];

export default function MissionSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#610e1e] via-[#6b1023] to-[#8b1a35] py-24 px-6 md:px-12">

            {/* Background Decorations */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>

            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <span className="text-[#FFD963] uppercase tracking-[0.25em] text-xs font-bold">
                        OUR MISSION
                    </span>

                    <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold text-white leading-tight">
                        Nurturing Leaders for a Meritocratic India.
                    </h2>

                    <p className="mt-8 text-white/70 text-lg leading-8">
                        Our mission is to shape disciplined individuals into
                        future officers. We combine the legacy of Aaryans World
                        School with specialized defence training to create a
                        pathway for students from Class 8 through
                        post-graduation.
                    </p>

                    <Link
                        to="/about"
                        className="inline-flex items-center gap-3 mt-10 border-2 border-[#FFD963] text-[#FFD963] px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#FFD963] hover:text-primary hover:gap-5"
                    >
                        Read Our Vision
                        <span>→</span>
                    </Link>

                </motion.div>

                {/* Right Cards */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 gap-6"
                >

                    {values.map((item, index) => (

                        <motion.div
                            key={index}
                            whileHover={{
                                y: -8,
                                scale: 1.03,
                            }}
                            transition={{ duration: 0.3 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 cursor-default"
                        >

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#FFD963]/10 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500"></div>

                            <div className="relative z-10">

                                <div className="text-4xl mb-5">
                                    {item.icon}
                                </div>

                                <h3 className="text-white font-heading text-2xl font-bold mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-white/60 text-sm leading-6">
                                    {item.description}
                                </p>

                            </div>

                        </motion.div>

                    ))}

                </motion.div>

            </div>

        </section>
    );
}