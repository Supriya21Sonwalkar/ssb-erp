
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#610e1e] pt-40 pb-24 px-6 md:px-12">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">

                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern
                            id="gallery-grid"
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 10 0 L 0 0 0 10"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.15"
                            />
                        </pattern>
                    </defs>

                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#gallery-grid)"
                    />
                </svg>

            </div>

            {/* Decorative Blur */}
            <div className="absolute -top-32 -right-24 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left"
                >

                    {/* Badge */}
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.6,
                        }}
                        viewport={{ once: true }}
                        className="block mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#FFD963]"
                    >
                        Gallery
                    </motion.span>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.35,
                            duration: 0.8,
                        }}
                        viewport={{ once: true }}
                        className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8"
                    >
                        Success Stories &{" "}
                        <span className="text-[#FFD963]">
                            Training
                        </span>{" "}
                        Life
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.55,
                            duration: 0.8,
                        }}
                        viewport={{ once: true }}
                        className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/70"
                    >
                        Disciplined mornings, classroom focus,
                        GTO ground sweat and the moment a cadet earns
                        their uniform — a glimpse of the journey we
                        live every day.
                    </motion.p>

                </motion.div>

            </div>

        </section>
    );
}