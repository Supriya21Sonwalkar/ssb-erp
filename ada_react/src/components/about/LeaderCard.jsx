import { motion } from "framer-motion";

export default function LeaderCard({ leader, index }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 70,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.7,
                delay: index * 0.12,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            whileHover={{
                y: -10,
            }}
            className="group bg-white rounded-3xl overflow-hidden border border-[#610e1e]/10 shadow-sm hover:shadow-2xl hover:border-[#FFD963]/50 transition-all duration-500"
        >
            {/* Image */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={leader.image}
                    alt={leader.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        leader.imageClass || ""
                    }`}
                    style={{
                        objectPosition: leader.objectPosition || "center top"
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#610e1e]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">

                    <p className="text-white italic text-sm">
                        "{leader.quote}"
                    </p>

                </div>

            </div>

            {/* Content */}
            <div className="relative p-8 transition-all duration-500 group-hover:bg-[#610e1e] group-hover:text-white">

                <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FFD963] flex items-center justify-center text-xl shadow-xl scale-0 group-hover:scale-100 transition-transform duration-500">

                    {leader.badge}

                </div>

                <h3 className="font-heading text-2xl font-bold mb-2">
                    {leader.name}
                </h3>

                <p className="uppercase tracking-[0.2em] text-[11px] font-bold text-[#FFD963] mb-5">

                    {leader.designation}

                </p>

                <p className="leading-7 opacity-80">

                    {leader.description}

                </p>

            </div>

        </motion.div>
    );
}