import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CtaSection() {
    return (
        <section className="relative px-6 md:px-12 pb-24 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFD963]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#610e1e]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden max-w-7xl mx-auto rounded-[2rem] bg-[#FFD963] p-10 md:p-16 lg:p-20"
            >

                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary blur-3xl"></div>
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="max-w-2xl text-center lg:text-left"
                    >
                        <span className="uppercase tracking-[0.25em] text-xs font-bold text-primary">
                            START YOUR JOURNEY
                        </span>

                        <h2 className="mt-4 font-heading text-4xl md:text-5xl font-black text-primary leading-tight">
                            Book a Free
                            <br />
                            Counselling Session
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-primary/70">
                            Understand the right pathway for your defence career.
                            Our experts will guide you through NDA, CDS, AFCAT,
                            SSB and Graduation entries.
                        </p>
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="flex flex-col items-center gap-6"
                    >

                        {/* Phone */}
                        <a
                            href="tel:+919823456789"
                            className="group flex items-center gap-4"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                                📞
                            </div>

                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest text-primary/60">
                                    Call Us
                                </p>

                                <p className="text-xl font-bold text-primary">
                                    +91 98234 56789
                                </p>
                            </div>
                        </a>

                        {/* Button */}
                        <Link
                            to="/contact"
                            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-5 font-bold uppercase tracking-widest text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-primary"
                        >
                            Book Counselling

                            <span className="transition-transform duration-300 group-hover:translate-x-2">
                                →
                            </span>
                        </Link>

                    </motion.div>

                </div>

            </motion.div>

        </section>
    );
}