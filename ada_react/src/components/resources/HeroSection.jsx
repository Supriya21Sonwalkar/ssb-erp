import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#610e1e] pt-40 pb-24 px-6 md:px-12">
            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#FFD963]/10 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl"></div>

                {/* Grid Pattern */}
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

            <div className="relative z-10 mx-auto max-w-7xl text-center md:text-left">
                {/* Badge */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-4 inline-block uppercase tracking-[0.3em] text-sm font-bold text-[#FFD963]"
                >
                    Resources
                </motion.span>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl font-black leading-tight text-white md:text-7xl lg:text-8xl"
                >
                    Free{" "}
                    <span className="text-[#FFD963]">
                        Study
                    </span>{" "}
                    Materials
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
                >
                    Download exam-ready PDFs for NDA, SSB, CDS, AFCAT,
                    and Current Affairs—carefully curated to support
                    disciplined defence preparation and help you excel
                    at every stage of your journey.
                </motion.p>
            </div>
        </section>
    );
}