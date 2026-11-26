import { motion } from "framer-motion";
import LeaderCard from "./LeaderCard";
import milind_ladge from "../../assets/images/MilindSir.jpeg";
import arpit_chaudhary from "../../assets/images/arpit_choudhary.png";
import kartikey_chaudhary from "../../assets/images/kartikey_choudhary.png";
import pratik_ladge from "../../assets/images/PratikSir.jpeg";
import pranav_ladge from "../../assets/images/PranavSir.jpeg";


const leaders = [

    {
        name: "Milind Ladge",
        designation: "MD, Aaryans Group",
        image: milind_ladge,
        badge: "🎖️",
        quote: "Building excellence on discipline.",
        description:
            "Building excellence in defence training on the pillars of discipline, experience, and innovation.",
    },

    {
        name: "Arpit Chaudhary",
        designation: "Director, SSB GUIDE",
        image: arpit_chaudhary,
        objectPosition: "center 20%",
        badge: "⚔️",
        quote: "Academic excellence & personality.",
        description:
            "Focusing on academic excellence and the development of soft skills and personality for military candidates.",
    },

    {
        name: "Kartikey Chaudhary",
        designation: "Director, SSB GUIDE",
        image: kartikey_chaudhary,
        objectPosition: "center 10%",
        badge: "🎖️",
        quote: "Grooming character for SSB.",
        description:
            "Grooming character and personality to make candidates acceptable at SSB Interviews and beyond.",
    },
    {
        name: "Pratik Ladge",
        designation: "Director & CEO",
        image: pratik_ladge,
        badge: "🎓",
        quote: "Shaping the guardians of our nation.",
        description:
            "Dedicated to shaping the future guardians of our nation by focusing on character, discipline, and leadership.",
    },

    {
        name: "Pranav Ladge",
        designation: "Director & COO",
        image: pranav_ladge,
        badge: "🚀",
        quote: "Bridging dreams and reality.",
        description:
            "Harnessing the power of discipline to bridge the gap between dreams and reality for every aspiring leader.",
    },

];

export default function LeadershipSection() {
    return (
        <section className="bg-gray-50 py-24 px-6 md:px-12">

            <div className="max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >

                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#610e1e]">

                        Our Leadership Team

                    </h2>

                    <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 leading-8">

                        The visionaries behind SSB Guide Aaryans Defence School,
                        committed to excellence in defence education and
                        character building.

                    </p>

                </motion.div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

                    {leaders.map((leader, index) => (

                        <LeaderCard
                            key={leader.name}
                            leader={leader}
                            index={index}
                        />

                    ))}

                </div>

            </div>

        </section>
    );
}