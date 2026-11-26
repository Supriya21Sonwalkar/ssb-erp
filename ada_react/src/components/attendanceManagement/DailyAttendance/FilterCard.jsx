import { FaSearch, FaSync } from "react-icons/fa";

export default function FilterCard({

    filters,

    setFilters,

    academicYears,

    classes,

    sections,

    onLoadStudents,

    loading,

}) {

    const canLoad = !!filters.academic_year_id;

    const handleAcademicYearChange = (e) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            academic_year_id: value,
            class_id: "",
            section_id: "",
        });
    };

    const handleClassChange = (e) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            class_id: value,
            section_id: "",
        });
    };

    const handleSectionChange = (e) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            section_id: value,
        });
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            attendance_date: value,
        });
    };

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#610e1e]">
                    Attendance Filters
                </h2>
                {canLoad && (
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        Students auto-load as you apply filters
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Academic Year */}

                <div>

                    <label className="block text-sm font-semibold mb-2">

                        Academic Year <span className="text-red-500">*</span>

                    </label>

                    <select
                        value={filters.academic_year_id}
                        onChange={handleAcademicYearChange}
                        className="w-full border rounded-lg p-2"
                    >

                        <option value="">

                            Select

                        </option>

                        {academicYears.map(year => (
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
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>

                    </label>

                    <select
                        value={filters.class_id}
                        onChange={handleClassChange}
                        disabled={!filters.academic_year_id}
                        className="w-full border rounded-lg p-2 disabled:bg-gray-100 disabled:text-gray-400"
                    >

                        <option value="">

                            All Classes

                        </option>

                        {classes.map(item => (
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
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>

                    </label>

                    <select
                        value={filters.section_id}
                        onChange={handleSectionChange}
                        disabled={!filters.class_id}
                        className="w-full border rounded-lg p-2 disabled:bg-gray-100 disabled:text-gray-400"
                    >

                        <option value="">

                            All Sections

                        </option>

                        {sections.map(section => (
                            <option
                                key={section.id}
                                value={section.id}
                            >
                                {section.section_name}
                            </option>
                        ))}

                    </select>

                </div>

                {/* Attendance Date */}

                <div>

                    <label className="block text-sm font-semibold mb-2">

                        Attendance Date <span className="text-red-500">*</span>

                    </label>

                    <input
                        type="date"
                        value={filters.attendance_date}
                        onChange={handleDateChange}
                        className="w-full border rounded-lg p-2"
                    />

                </div>

                {/* Button */}

                <div className="flex items-end gap-2">

                    <button

                        onClick={onLoadStudents}
                        disabled={!canLoad || loading}

                        className="
                            flex-1
                            bg-[#610e1e]
                            hover:bg-[#4b0b18]
                            disabled:bg-gray-300
                            disabled:cursor-not-allowed
                            text-white
                            rounded-lg
                            py-2.5
                            flex
                            justify-center
                            items-center
                            gap-2
                            transition
                        "

                    >

                        {loading ? (
                            <FaSync className="animate-spin" />
                        ) : (
                            <FaSearch />
                        )}

                        {loading ? "Loading..." : "Load Students"}

                    </button>

                </div>

            </div>

        </div>

    );

}