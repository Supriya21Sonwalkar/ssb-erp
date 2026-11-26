import { FaSearch } from "react-icons/fa";

export default function LectureFilterCard({
    filters,
    setFilters,
    academicYears,
    classes,
    sections,
    subjects,
    onLoadStudents,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            {/* Heading */}
            <h2 className="text-xl font-bold text-[#610e1e] mb-6">
                Lecture-wise Attendance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Academic Year */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Academic Year
                    </label>

                    <select
                        value={filters.academic_year_id}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                academic_year_id: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >
                        <option value="">
                            Select Academic Year
                        </option>

                        {academicYears.map((year) => (
                            <option
                                key={year.id}
                                value={year.id}
                            >
                                {year.academic_year}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Class */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Class
                    </label>

                    <select
                        value={filters.class_id}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                class_id: e.target.value,
                                section_id: "",
                            })
                        }
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >
                        <option value="">
                            Select Class
                        </option>

                        {classes.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.class_name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Section */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Section
                    </label>

                    <select
                        value={filters.section_id}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                section_id: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        disabled={!filters.class_id}
                    >
                        <option value="">
                            Select Section
                        </option>

                        {sections.map((section) => (
                            <option
                                key={section.id}
                                value={section.id}
                            >
                                {section.section_name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Subject */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Subject
                    </label>

                    <select
                        value={filters.subject_id}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                subject_id: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >
                        <option value="">
                            Select Subject
                        </option>

                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.subject_name ||
                                    subject.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Lecture Date */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Lecture Date
                    </label>

                    <input
                        type="date"
                        value={filters.lecture_date}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                lecture_date: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    />
                </div>


                {/* Lecture Number */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Lecture No.
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={filters.lecture_no}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                lecture_no: e.target.value,
                            })
                        }
                        placeholder="Enter lecture number"
                        className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    />
                </div>


                {/* Load Students Button */}
                <div className="flex items-end md:col-span-2">

                    <button
                        type="button"
                        onClick={onLoadStudents}
                        className="
                            w-full
                            bg-[#610e1e]
                            hover:bg-[#4b0b18]
                            text-white
                            rounded-lg
                            py-2.5
                            flex
                            justify-center
                            items-center
                            gap-2
                            transition
                            font-semibold
                        "
                    >
                        <FaSearch />

                        Load Students
                    </button>

                </div>

            </div>
        </div>
    );
}