import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        quote:
            "The guidance and discipline at Aaryans Defence School completely transformed my personality. Clearing the SSB interview became possible because of the mentors here.",
        cadet: "Rahul Patil",
        entry: "NDA",
        batch: "2024",
        image: null,
    },
    {
        quote:
            "From communication skills to psychological tests, every aspect of the SSB process was covered thoroughly. I owe my recommendation to this academy.",
        cadet: "Sneha Jadhav",
        entry: "AFCAT",
        batch: "2023",
        image: null,
    },
    {
        quote:
            "The structured routine, leadership activities and personal mentoring helped me develop officer-like qualities and confidence.",
        cadet: "Aditya Deshmukh",
        entry: "CDS",
        batch: "2025",
        image: null,
    },
];

export default function TestimonialsSection() {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrent((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            next();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative bg-gradient-to-b from-white to-[#faf8f4] py-24 px-6 md:px-12 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#610e1e]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>

            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary uppercase tracking-[0.25em] text-xs font-bold">
                        TESTIMONIALS
                    </span>

                    <h2 className="mt-4 font-heading text-4xl md:text-5xl font-bold text-primary">
                        Cadets Recommended.
                        <br />
                        Lives Transformed.
                    </h2>
                </motion.div>

                {/* Slider */}
                <div className="relative max-w-5xl mx-auto overflow-hidden">

                    <motion.div
                        animate={{
                            x: `-${current * 100}%`,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                        }}
                        className="flex"
                    >

                        {testimonials.map((item, index) => (

                            <div
                                key={index}
                                className="min-w-full px-4"
                            >

                                <div className="relative bg-[#faf8f4] rounded-3xl p-10 md:p-16 shadow-lg">

                                    {/* Quote Icon */}
                                    <div className="absolute top-8 left-8 text-[#FFD963] text-8xl opacity-20 font-serif">
                                        "
                                    </div>

                                    <div className="relative z-10 text-center">

                                        <p className="italic text-primary text-xl md:text-2xl leading-relaxed mb-12">
                                            {item.quote}
                                        </p>

                                        {/* Avatar */}
                                        <div className="flex flex-col items-center">

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.cadet}
                                                    className="w-20 h-20 rounded-full border-4 border-[#FFD963] object-cover mb-4"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full border-4 border-[#FFD963] bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                                                    {item.cadet.charAt(0)}
                                                </div>
                                            )}

                                            <h3 className="font-heading text-2xl font-bold text-primary">
                                                {item.cadet}
                                            </h3>

                                            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-primary/60 font-bold">
                                                {item.entry} • Batch {item.batch}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </motion.div>

                    {/* Previous */}
                    {/* Previous */}
<button
    onClick={prev}
    className="absolute left-6 top-1/2 -translate-y-1/2 z-20
               w-12 h-12 rounded-full
               bg-white/95 backdrop-blur
               shadow-xl
               flex items-center justify-center
               text-primary
               hover:bg-primary hover:text-white
               transition-all duration-300"
>
    ←
</button>

{/* Next */}
<button
    onClick={next}
    className="absolute right-6 top-1/2 -translate-y-1/2 z-20
               w-12 h-12 rounded-full
               bg-white/95 backdrop-blur
               shadow-xl
               flex items-center justify-center
               text-primary
               hover:bg-primary hover:text-white
               transition-all duration-300"
>
    →
</button>

                    {/* Dots */}
                    <div className="flex justify-center gap-3 mt-10">

                        {testimonials.map((_, index) => (

                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    current === index
                                        ? "bg-[#FFD963] w-8"
                                        : "bg-primary/30"
                                }`}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </section>
    );
}