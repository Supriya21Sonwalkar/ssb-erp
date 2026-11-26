import HeroSection from "../components/resources/HeroSection";
import CTASection from "../components/resources/CTASection";
import FilterSection from "../components/resources/FilterSection";
    
export default function Resources() {
    return (
        <>
            <HeroSection />
            <FilterSection
                resources={[]}
                activeCategory="nda_syllabus"
                setActiveCategory={() => {}}
            />
            <CTASection />
            
        </>
    );
}