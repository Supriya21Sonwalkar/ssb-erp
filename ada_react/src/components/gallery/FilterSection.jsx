import { motion } from "framer-motion";
import GalleryGrid from "./GalleryGrid";

export default function FilterSection({
    categories,
    activeCategory,
    setActiveCategory,
    galleryItems,
    onImageClick,
}) {
    return (
        <section className="bg-gray-50 py-20 px-6 md:px-12">

            <div className="max-w-7xl mx-auto">

                {/* Filter Buttons */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >

                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 ${
                            activeCategory === "all"
                                ? "bg-[#610e1e] text-white border-[#FFD963] shadow-xl scale-105"
                                : "bg-white text-[#610e1e] border-[#610e1e]/10 hover:bg-[#610e1e] hover:text-white hover:scale-105"
                        }`}
                    >
                        All
                    </button>

                    {categories.map((category) => (

                        <button
                            key={category.id}
                            onClick={() =>
                                setActiveCategory(category.slug)
                            }
                            className={`px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 ${
                                activeCategory === category.slug
                                    ? "bg-[#610e1e] text-white border-[#FFD963] shadow-xl scale-105"
                                    : "bg-white text-[#610e1e] border-[#610e1e]/10 hover:bg-[#610e1e] hover:text-white hover:scale-105"
                            }`}
                        >
                            {category.name}
                        </button>

                    ))}

                </motion.div>

                <GalleryGrid
                    galleryItems={galleryItems}
                    onImageClick={onImageClick}
                />

            </div>

        </section>
    );
}