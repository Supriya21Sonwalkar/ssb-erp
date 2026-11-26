import { useEffect, useState } from "react";
import { getGallery } from "../services/galleryService";

import HeroSection from "../components/gallery/HeroSection";
import FilterSection from "../components/gallery/FilterSection";
import ResultHighlights from "../components/gallery/ResultHighlights";
import DirectorQuote from "../components/gallery/DirectorQuote";
import CTASection from "../components/gallery/CTASection";
import Lightbox from "../components/gallery/Lightbox";

export default function Gallery() {
    const [categories, setCategories] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const data = await getGallery();

            setCategories(data.categories || []);
            setGalleryItems(data.galleryItems || []);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        }
    };

    const filteredImages =
        activeCategory === "all"
            ? galleryItems
            : galleryItems.filter(
                  (item) => item.category === activeCategory
              );

    return (
        <>
            <HeroSection />

            <FilterSection
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                galleryItems={filteredImages}
                onImageClick={setSelectedImage}
            />

            <ResultHighlights />

            <DirectorQuote />

            <CTASection />

            <Lightbox
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </>
    );
}