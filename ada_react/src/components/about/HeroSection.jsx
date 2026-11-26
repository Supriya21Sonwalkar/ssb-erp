import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#610e1e]">

            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&q=80&w=1920"
                    alt="About SSB Guide"
                    className="w-full h-full object-cover opacity-40"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#610e1e] via-[#610e1ecc] to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

                <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="block mb-6 uppercase tracking-[0.3em] text-sm font-bold text-[#FFD963]"
                >
                    About the Academy
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
                >
                    Built on legacy.
                    <br />
                    <span className="text-[#FFD963]">
                        Driven
                    </span>{" "}
                    by purpose.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-8 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
                >
                    SSB Guide Aaryans Defence School stands on the
                    foundation of Aaryans World School — an institution
                    committed to academic integrity, discipline,
                    and the dreams of uniform.
                </motion.p>

            </div>
        </section>
    );
}