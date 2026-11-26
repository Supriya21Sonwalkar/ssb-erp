import { motion } from "framer-motion";

export default function GalleryCard({
    item,
    index,
    onImageClick,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 50,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.6,
                delay: (index % 3) * 0.15,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            whileHover={{
                y: -8,
            }}
            onClick={() => onImageClick(item)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-[#610e1e]/10 shadow-lg cursor-pointer"
        >
            <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#610e1e]/90 via-[#610e1e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">

                <span className="inline-block w-fit mb-2 rounded-full bg-[#FFD963] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#610e1e]">
                    {item.category_name}
                </span>

                <h3 className="font-heading text-xl font-bold text-white">
                    {item.title}
                </h3>

            </div>
        </motion.div>
    );
}