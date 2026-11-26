import HeroSection from "../components/about/HeroSection";
import OriginSection from "../components/about/OriginSection";
import MissionVisionSection from "../components/about/MissionVisionSection";
import QuoteSection from "../components/about/QuoteSection";
import ExamCoverageSection from "../components/about/ExamCoverageSection";
import ValuesSection from "../components/about/ValuesSection";
import LeadershipSection from "../components/about/LeadershipSection";
import CTASection from "../components/about/CTASection";

export default function About() {
    return (
        <>
            <HeroSection />
            <OriginSection />
            <MissionVisionSection />
            <QuoteSection />
            <ExamCoverageSection />
            <ValuesSection />
            <LeadershipSection />
            <CTASection />
        </>
    );
}