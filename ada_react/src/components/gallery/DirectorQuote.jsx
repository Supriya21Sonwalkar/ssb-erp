import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";

export default function DirectorQuote() {
    return (
        <section className="bg-white py-24 px-6 md:px-12">

            <div className="max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-r-3xl border-l-[12px] border-[#FFD963] bg-gray-50 py-10 pl-8 pr-8 md:pl-16 shadow-xl"
                >

                    {/* Decorative Background */}
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#FFD963]/10 blur-3xl" />

                    {/* Quote Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.2,
                            duration: 0.6,
                        }}
                        viewport={{ once: true }}
                    >
                        <FiMessageSquare
                            size={64}
                            className="mb-8 text-[#FFD963] opacity-40"
                        />
                    </motion.div>

                    {/* Quote */}
                    <motion.h3
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.35,
                            duration: 0.7,
                        }}
                        viewport={{ once: true }}
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-[#610e1e] mb-8"
                    >
                        “An officer is not made in the exam hall,
                        but in daily habits, discipline and mindset.
                        Our job is to build that mindset —
                        the uniform follows.”
                    </motion.h3>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.55,
                            duration: 0.7,
                        }}
                        viewport={{ once: true }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <div className="h-1 w-12 bg-[#FFD963]" />

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#610e1e]">
                            SSB Guide Aaryans Defence School · Director's Note
                        </p>
                    </motion.div>

                </motion.div>

            </div>

        </section>
    );
}