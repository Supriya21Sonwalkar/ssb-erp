import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#610e1e] py-24 px-6 md:px-12">

            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">

                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FFD963] blur-3xl" />

                <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />

            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-4xl mx-auto text-center"
            >

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.7,
                    }}
                    viewport={{ once: true }}
                    className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8"
                >
                    Begin your{" "}
                    <span className="text-[#FFD963]">
                        Pratham Pag
                    </span>{" "}
                    with us.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{
                        delay: 0.35,
                        duration: 0.7,
                    }}
                    viewport={{ once: true }}
                    className="text-white/70 text-lg leading-8 max-w-2xl mx-auto mb-10"
                >
                    Take the first step towards a disciplined future.
                    Connect with our experts and discover the right
                    defence preparation programme for you.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: 0.5,
                        duration: 0.6,
                    }}
                    viewport={{ once: true }}
                >

                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 bg-[#FFD963] text-[#610e1e] px-10 md:px-12 py-5 rounded-xl font-bold uppercase tracking-[0.18em] shadow-2xl hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,217,99,0.35)] transition-all duration-300"
                    >
                        TALK TO US TODAY

                        <FiArrowRight size={20} />
                    </Link>

                </motion.div>

            </motion.div>

        </section>
    );
}