import { motion } from "framer-motion";
import { FiTarget, FiEye } from "react-icons/fi";

const cards = [
    {
        title: "Our Mission",
        icon: FiTarget,
        description:
            "Nurturing and developing students to serve a meritocratic India and inspire them to be just and ethical citizens. We aim to provide a conducive environment for holistic development through academic excellence, character building, and physical training.",
    },
    {
        title: "Our Vision",
        icon: FiEye,
        description:
            'To be a premier institution that transforms young aspirants into disciplined, courageous, and patriotic leaders who are ready to lead the nation\'s armed forces with integrity and honor. We envision a future where every Aaryan cadet embodies the spirit of "Seva Parmo Dharmah".',
    },
];

export default function MissionVisionSection() {
    return (
        <section className="bg-gray-50 py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

                {cards.map((card, index) => {

                    const Icon = card.icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                y: 80,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.2,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.25,
                            }}
                            whileHover={{
                                y: -10,
                            }}
                            className="group bg-white rounded-[2.5rem] p-12 border border-[#610e1e]/10 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >

                            <div className="w-16 h-16 rounded-2xl bg-[#FFD963] flex items-center justify-center text-[#610e1e] shadow-lg mb-8 group-hover:rotate-6 transition duration-500">

                                <Icon size={32} />

                            </div>

                            <h3 className="font-heading text-3xl font-bold text-[#610e1e] mb-6">

                                {card.title}

                            </h3>

                            <p className="text-gray-600 text-lg leading-8">

                                {card.description}

                            </p>

                        </motion.div>
                    );

                })}

            </div>
        </section>
    );
}