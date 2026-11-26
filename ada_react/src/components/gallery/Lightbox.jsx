import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function Lightbox({ image, onClose }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            {image && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#610e1e]/95 backdrop-blur-md p-6"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white hover:text-[#FFD963] transition-colors"
                    >
                        <FiX size={40} />
                    </button>

                    {/* Content */}
                    <motion.div
                        initial={{
                            scale: 0.9,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        exit={{
                            scale: 0.9,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-5xl text-center"
                    >
                        <img
                            src={image.image}
                            alt={image.title}
                            className="max-h-[80vh] w-auto mx-auto rounded-2xl border-4 border-[#FFD963]/20 shadow-[0_0_50px_rgba(255,217,99,0.30)]"
                        />

                        <h3 className="mt-6 font-heading text-3xl font-bold text-white">
                            {image.title}
                        </h3>

                        {image.description && (
                            <p className="mt-3 max-w-3xl mx-auto text-white/70 leading-7">
                                {image.description}
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}