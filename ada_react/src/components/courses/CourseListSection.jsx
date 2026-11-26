import { motion } from "framer-motion";
import CourseCard from "./CourseCard";

export default function CourseListSection({ courses, loading }) {
    if (loading) {
        return (
            <section className="py-24 bg-[#faf7f2]">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="flex flex-col items-center justify-center py-24">

                        <div className="w-16 h-16 border-4 border-[#FFD963] border-t-[#610e1e] rounded-full animate-spin"></div>

                        <p className="mt-6 text-lg font-medium text-[#610e1e]">
                            Loading Courses...
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <section className="py-24 bg-[#faf7f2]">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

                        <h2 className="text-3xl font-heading font-bold text-[#610e1e] mb-4">
                            No Courses Available
                        </h2>

                        <p className="text-gray-600">
                            Please check back later. New courses will be added soon.
                        </p>

                    </div>

                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[#faf7f2]">

            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-14"
                >
                    {courses.map((course, index) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            index={index}
                        />
                    ))}
                </motion.div>

            </div>

        </section>
    );
}