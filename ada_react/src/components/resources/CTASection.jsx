import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#610e1e] py-24 px-6 md:px-12">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFD963]/10 blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>

                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, white 1px, transparent 1px),
                            linear-gradient(to bottom, white 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative z-10 mx-auto max-w-4xl text-center"
            >
                <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
                    Looking for specific prep material?
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-white/70">
                    Our mentors can provide personalized study plans and
                    reference materials based on your entry type, helping
                    you prepare with confidence and achieve your defence
                    career goals.
                </p>

                <Link
                    to="/contact"
                    className="group mt-10 inline-flex items-center gap-3 rounded-lg border-2 border-[#FFD963] px-10 py-4 font-bold uppercase tracking-[0.2em] text-[#FFD963] transition-all duration-300 hover:bg-[#FFD963] hover:text-[#610e1e]"
                >
                    Request Personalized Material

                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </motion.div>
        </section>
    );
}