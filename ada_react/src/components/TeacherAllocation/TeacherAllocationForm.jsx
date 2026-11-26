import React from "react";

/* ==========================================================
   Reusable Components
========================================================== */

const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="bg-[#610e1e] text-white px-5 py-3">
            <h2 className="font-semibold text-lg">{title}</h2>
        </div>

        <div className="p-5">
            {children}
        </div>
    </div>
);

const Label = ({ children, required = false }) => (
    <label className="block mb-1 text-sm font-semibold text-gray-700">
        {children}
        {required && (
            <span className="text-red-500 ml-1">*</span>
        )}
    </label>
);

const Select = ({
    children,
    handleChange,
    className = "",
    ...props
}) => (

    <select
        {...props}
        onChange={handleChange}
        className={`w-full h-10 px-3 border rounded-lg border-gray-300 bg-white focus:ring-2 focus:ring-[#610e1e] focus:border-[#610e1e] outline-none ${className}`}
    >

        {children}

    </select>

);

/* ==========================================================
   Teacher Allocation Form
========================================================== */

export default function TeacherAllocationForm({

    formData,

    handleChange,

    handleSubjectChange,

    handleSubmit,

    loading,

    academicYears = [],

    classes = [],

    teachers = [],

    subjects = [],

    mode = "create",

}) {

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <Section title="Teacher Allocation">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Academic Year */}

                    <div>

                        <Label required>
                            Academic Year
                        </Label>

                        <Select
                            name="academic_year_id"
                            value={formData.academic_year_id}
                            handleChange={handleChange}
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

                        </Select>

                    </div>

                    {/* Class */}

                    <div>

                        <Label required>
                            Class
                        </Label>

                        <Select
                            name="class_id"
                            value={formData.class_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((cls) => (

                                <option
                                    key={cls.id}
                                    value={cls.id}
                                >
                                    {cls.class_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                    {/* Teacher */}

                    <div>

                        <Label required>
                            Teacher
                        </Label>

                        <Select
                            name="employee_id"
                            value={formData.employee_id}
                            handleChange={handleChange}
                        >

                            <option value="">
                                Select Teacher
                            </option>

                            {teachers.map((teacher) => (

                                <option
                                    key={teacher.id}
                                    value={teacher.id}
                                >
                                    {teacher.full_name}
                                </option>

                            ))}

                        </Select>

                    </div>

                </div>

            </Section>

            {/* =======================================
                    Subject Selection
            ======================================= */}

            <Section title="Assign Subjects">

                {subjects.length === 0 ? (

                    <div className="text-center text-gray-500 py-10">

                        Select a class to load subjects.

                    </div>

                ) : (

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                        {subjects.filter(s => s && s.id).map((subject) => (

                            <label
                                key={subject.id}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-[#f9f4f5] cursor-pointer"
                            >

                                <input
                                    type="checkbox"
                                    checked={formData.subjects.includes(subject.id)}
                                    onChange={() =>
                                        handleSubjectChange(subject.id)
                                    }
                                    className="w-4 h-4 accent-[#610e1e]"
                                />

                                <span className="font-medium">

                                    {subject.subject_name}

                                </span>

                            </label>

                        ))}

                    </div>

                )}

            </Section>

            {/* =======================================
                    Buttons
            ======================================= */}

            <div className="sticky bottom-0 bg-white border rounded-xl shadow-lg px-6 py-4">

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-medium"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 rounded-lg bg-[#610e1e] text-white hover:bg-[#7a1225] disabled:opacity-60 font-semibold"
                    >

                        {loading
                            ? "Saving..."
                            : mode === "edit"
                                ? "Update Allocation"
                                : "Save Allocation"}

                    </button>

                </div>

            </div>

        </form>

    );

}