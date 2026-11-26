import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import ProgramsSection from "../components/home/ProgramsSection";
import WhyChooseSection from "../components/home/WhyChooseSection";
import MissionSection from "../components/home/MissionSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CtaSection from "../components/home/CtaSection";
import GallerySection from "../components/home/GallerySection";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
    return (
        <>
            <HeroSection />

            <StatsSection />

            <ProgramsSection />

            <WhyChooseSection />

            <MissionSection />

            <TestimonialsSection />

            {/* <GallerySection /> */}

            {/* <ContactSection /> */}

            <CtaSection />
        </>
    );
}