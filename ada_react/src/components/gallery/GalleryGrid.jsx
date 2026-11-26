import GalleryCard from "./GalleryCard";

export default function GalleryGrid({
    galleryItems,
    onImageClick,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {galleryItems.map((item, index) => (
                <GalleryCard
                    key={item.id}
                    item={item}
                    index={index}
                    onImageClick={onImageClick}
                />
            ))}

        </div>
    );
}