import { motion } from "framer-motion";

const stats = [
    {
        value: "10+",
        label: "Years Guiding Aspirants",
    },
    {
        value: "Retd.",
        label: "SSB Panel Mentors",
    },
    {
        value: "Pune",
        label: "Closest to NDA",
    },
    {
        value: "200+",
        label: "Cadets Recommended",
    },
    {
        value: "15+",
        label: "Years of Legacy",
    },
];

export default function StatsSection() {
    return (
        <section className="relative bg-gradient-to-br from-[#610e1e] via-[#6b1023] to-[#8b1a35] py-12 px-6 md:px-12 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD963]/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD963]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            </div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMEgwTDQwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

            <div className="relative mx-auto max-w-7xl">

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15,
                            },
                        },
                    }}
                    className="grid grid-cols-2 gap-6 text-center md:grid-cols-5 md:gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    y: 30,
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.6,
                                    },
                                },
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.05,
                            }}
                            className="group relative cursor-pointer"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD963]/0 via-[#FFD963]/0 to-[#FFD963]/0 blur-3xl transition-all duration-700 group-hover:from-[#FFD963]/20 group-hover:via-[#FFD963]/10 group-hover:to-[#FFD963]/0"></div>
                            
                            {/* Border Glow */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FFD963]/30 transition-all duration-500"></div>

                            {/* Number */}
                            <motion.h3
                                animate={{
                                    y: [0, -5, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: index * 0.4,
                                    ease: "easeInOut"
                                }}
                                className="relative mb-2 font-heading text-3xl font-bold bg-gradient-to-br from-[#FFD963] via-[#FFE5A0] to-[#FFD963] bg-clip-text text-transparent md:text-4xl lg:text-5xl drop-shadow-lg"
                            >
                                {stat.value}
                            </motion.h3>

                            {/* Label */}
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 transition-all duration-300 group-hover:text-white/90 group-hover:tracking-[0.3em] md:text-xs">
                                {stat.label}
                            </p>

                            {/* Animated Underline */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                whileInView={{ width: '60%', opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.15 + 0.3,
                                    duration: 0.6,
                                    ease: "easeOut"
                                }}
                                className="mx-auto mt-4 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#FFD963] to-transparent"
                            />

                            {/* Divider */}
                            {index !== stats.length - 1 && (
                                <div className="absolute right-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent md:block"></div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}