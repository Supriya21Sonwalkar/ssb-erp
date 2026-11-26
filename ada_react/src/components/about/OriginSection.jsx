import { motion } from "framer-motion";
import images from "../../assets/images/about1.png";

export default function OriginSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <span className="block mb-4 text-sm uppercase tracking-[0.25em] font-bold text-[#610e1e]">
                        Our Origin
                    </span>

                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#610e1e] leading-tight mb-8">
                        Future Officers,
                        <br />
                        built today.
                    </h2>

                    <div className="space-y-6 text-gray-600 text-lg leading-8">

                        <p>
                            SSB Guide Aaryans Defence School,
                            built on the legacy of Aaryans World School,
                            is dedicated to shaping disciplined individuals
                            into future officers and leaders of the nation.
                        </p>

                        <p>
                            We recognize that preparation for the Indian
                            Armed Forces starts early. Our unique curriculum
                            integrates rigorous academics with physical and
                            mental defence training, ensuring every cadet
                            develops confidence, discipline and leadership.
                        </p>

                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative"
                >

                    <div className="rounded-[3rem] overflow-hidden shadow-2xl">

                        <img
                            src={images}
                            alt="Our Origin"
                            className="w-full aspect-[4/5] object-cover hover:scale-105 transition duration-700"
                        />

                    </div>

                    {/* Experience Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            delay: 0.4,
                            duration: 0.6,
                        }}
                        viewport={{ once: true }}
                        className="hidden md:block absolute -bottom-8 -left-8 bg-[#FFD963] rounded-[2rem] p-8 shadow-2xl"
                    >

                        <h3 className="font-heading text-5xl font-black text-[#610e1e]">
                            15+
                        </h3>

                        <p className="mt-2 uppercase tracking-[0.25em] text-xs font-bold text-[#610e1e]">
                            Years of Excellence
                        </p>

                    </motion.div>

                </motion.div>

            </div>
        </section>
    );
}