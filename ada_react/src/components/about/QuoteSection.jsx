import { motion } from "framer-motion";
import { FiShield } from "react-icons/fi";

export default function QuoteSection() {
    return (
        <section className="relative overflow-hidden bg-[#610e1e] py-24 px-6 md:px-12">

            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">

                <FiShield
                    size={420}
                    className="text-[#FFD963]"
                />

            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                whileInView={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    duration: 0.8,
                }}
                viewport={{
                    once: true,
                    amount: 0.4,
                }}
                className="relative z-10 max-w-5xl mx-auto text-center"
            >

                <motion.h2
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.2,
                        duration: 0.8,
                    }}
                    viewport={{ once: true }}
                    className="font-heading italic font-bold text-3xl md:text-5xl leading-tight text-[#FFD963]"
                >
                    "Nurturing and developing students
                    to serve a meritocratic India and inspire
                    them to be just and ethical citizens."
                </motion.h2>

            </motion.div>

        </section>
    );
}