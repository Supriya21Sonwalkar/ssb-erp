import { motion } from "framer-motion";
// import ResourceGrid from "./ResourceGrid";

export default function FilterSection({
    resources,
    activeCategory,
    setActiveCategory,
    onDownload,
}) {
    const categories = [
        {
            label: "NDA Syllabus",
            value: "nda_syllabus",
        },
        {
            label: "SSB Preparation",
            value: "ssb_prep",
        },
        {
            label: "Previous Year Papers",
            value: "previous_papers",
        },
        {
            label: "Current Affairs",
            value: "current_affairs",
        },
    ];

    const filteredResources = resources.filter(
        (resource) => resource.category === activeCategory
    );

    return (
        <section className="bg-gray-50 py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 flex flex-wrap justify-center gap-4 rounded-full border border-[#610e1e]/10 bg-white p-2 shadow-lg"
                >
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() =>
                                setActiveCategory(category.value)
                            }
                            className={`rounded-full px-8 py-3 font-semibold transition-all duration-300
                                ${
                                    activeCategory === category.value
                                        ? "bg-[#610e1e] text-white shadow-lg"
                                        : "text-[#610e1e] hover:bg-[#610e1e]/5"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </motion.div>



            </div>
        </section>
    );
}