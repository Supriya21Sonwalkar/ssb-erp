import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function FooterCTASection() {
    return (
        <section className="bg-[#FFD963] py-16 md:py-20 px-6">

            <div className="max-w-6xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left"
                >

                    {/* Left Content */}

                    <div>

                        <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#610e1e]/70 mb-3">
                            Need Guidance?
                        </p>

                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#610e1e] leading-tight">
                            Not sure which
                            <br />
                            programme fits you?
                        </h2>

                        <p className="mt-5 text-[#610e1e]/80 text-lg max-w-2xl leading-8">
                            Our experienced counsellors will help you choose the
                            right defence career path based on your academic
                            background, goals and aspirations.
                        </p>

                    </div>

                    {/* Button */}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-3 bg-[#610e1e] text-white px-10 py-4 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-white hover:text-[#610e1e] transition-all duration-300"
                        >
                            TALK TO AN ADVISOR

                            <FiArrowRight size={20} />

                        </Link>

                    </motion.div>

                </motion.div>

            </div>

        </section>
    );
}