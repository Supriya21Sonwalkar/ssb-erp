import { useEffect, useState } from "react";

import HeroSection from "../components/courses/HeroSection";
import CourseListSection from "../components/courses/CourseListSection";
import FooterCTASection from "../components/courses/FooterCTASection";

import { getCourses } from "../services/courseService";

export default function Courses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const data = await getCourses();

                setCourses(data);

            } catch (error) {

                console.error("Error fetching courses:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchCourses();

    }, []);

    return (
        <>
            <HeroSection />

            <CourseListSection
                courses={courses}
                loading={loading}
            />

            <FooterCTASection />
        </>
    );

}