import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#FFD963] py-16 px-6 md:px-12">

            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden">

                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />

                <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#610e1e]/10 blur-3xl" />

            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left"
            >

                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.6,
                    }}
                    viewport={{ once: true }}
                    className="font-heading text-3xl md:text-4xl font-bold text-[#610e1e]"
                >
                    Become the next success story.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 0.35,
                        duration: 0.6,
                    }}
                    viewport={{ once: true }}
                >

                    <Link
                        to="/contact"
                        className="group inline-flex items-center gap-3 rounded-lg bg-[#610e1e] px-10 py-4 font-bold uppercase tracking-[0.18em] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#4b0b17]"
                    >
                        APPLY NOW

                        <FiArrowRight
                            size={20}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                </motion.div>

            </motion.div>

        </section>
    );
}