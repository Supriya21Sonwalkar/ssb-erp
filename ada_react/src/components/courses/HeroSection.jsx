import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-[#610e1e]">

            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&q=80&w=1920"
                    alt="Defence Training"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#610e1e]/70"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#610e1e] via-[#610e1e]/60 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

                <motion.span
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="inline-block mb-5 text-[#FFD963] uppercase tracking-[0.25em] font-semibold text-sm"
                >
                    Pratham Pag Program
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                >
                    Our Defence{" "}
                    <span className="text-[#FFD963]">
                        Training
                    </span>{" "}
                    Programs
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mt-8 max-w-3xl mx-auto text-lg md:text-xl leading-8 text-gray-200"
                >
                    Six specialized courses built on the legacy of Aaryans
                    World School—from Class 8 to Graduation and intensive
                    SSB training guided by experienced retired defence officers.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mt-10 flex justify-center"
                >
                    <div className="h-1 w-28 rounded-full bg-[#FFD963]"></div>
                </motion.div>

            </div>

        </section>
    );
}