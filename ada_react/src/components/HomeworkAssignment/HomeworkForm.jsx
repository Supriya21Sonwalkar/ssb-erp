import { useState } from "react";

export default function HomeworkForm({
    formData,
    setFormData,
    academicYears,
    classes,
    sections,
    subjects,
    attachments,
    setAttachments,
    onSubmit,
    loading = false,
    isEdit = false,
}) {

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleFileChange = (e) => {

        const files = Array.from(e.target.files || []);

        setAttachments(files);
    };


    return (

        <form
            onSubmit={onSubmit}
            className="space-y-6"
        >

            {/* ---------------------------------------------------------
                Academic Year / Class / Section
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Academic Year */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Academic Year
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                        name="academic_year_id"
                        value={formData.academic_year_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
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

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Class
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                        name="class_id"
                        value={formData.class_id}
                        onChange={(e) => {

                            setFormData((prev) => ({
                                ...prev,
                                class_id: e.target.value,
                                section_id: "",
                            }));

                        }}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
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

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Section
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                        name="section_id"
                        value={formData.section_id}
                        onChange={handleChange}
                        disabled={!formData.class_id}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e] disabled:bg-gray-100"
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

            </div>


            {/* ---------------------------------------------------------
                Subject / Homework Type
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Subject */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >

                        <option value="">
                            Select Subject
                        </option>

                        {subjects.map((subject) => (

                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.subject_name || subject.name}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Homework Type */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Homework Type
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                        name="homework_type"
                        value={formData.homework_type}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >

                        <option value="">
                            Select Type
                        </option>

                        <option value="Homework">
                            Homework
                        </option>

                        <option value="Assignment">
                            Assignment
                        </option>

                        <option value="Project">
                            Project
                        </option>

                        <option value="Worksheet">
                            Worksheet
                        </option>

                    </select>

                </div>

            </div>


            {/* ---------------------------------------------------------
                Title
            --------------------------------------------------------- */}

            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Homework Title
                    <span className="text-red-500 ml-1">*</span>
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter homework title"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                />

            </div>


            {/* ---------------------------------------------------------
                Description
            --------------------------------------------------------- */}

            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description / Instructions
                    <span className="text-red-500 ml-1">*</span>
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter homework instructions..."
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                />

            </div>


            {/* ---------------------------------------------------------
                Dates
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Assigned Date */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assigned Date
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                        type="date"
                        name="assigned_date"
                        value={formData.assigned_date}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    />

                </div>


                {/* Due Date */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    />

                </div>

            </div>


            {/* ---------------------------------------------------------
                Marks / Late Submission
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Total Marks */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Marks
                    </label>

                    <input
                        type="number"
                        name="total_marks"
                        value={formData.total_marks}
                        onChange={handleChange}
                        min="0"
                        placeholder="Optional"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    />

                </div>


                {/* Late Submission */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Late Submission
                    </label>

                    <select
                        name="allow_late_submission"
                        value={formData.allow_late_submission}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                    >

                        <option value="0">
                            Not Allowed
                        </option>

                        <option value="1">
                            Allowed
                        </option>

                    </select>

                </div>

            </div>


            {/* ---------------------------------------------------------
                Attachment
            --------------------------------------------------------- */}

            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attach Homework Files
                </label>

                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white"
                />

                <p className="text-xs text-gray-500 mt-2">
                    Allowed: PDF, Word, Excel, PowerPoint, Images and ZIP.
                    Maximum 10 MB per file.
                </p>

                {attachments.length > 0 && (

                    <div className="mt-3 space-y-2">

                        {attachments.map((file, index) => (

                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2"
                            >

                                <span className="text-sm text-gray-700 truncate">
                                    {file.name}
                                </span>

                                <span className="text-xs text-gray-500 ml-3">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* ---------------------------------------------------------
                Status
            --------------------------------------------------------- */}

            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                </label>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                >

                    <option value="Draft">
                        Save as Draft
                    </option>

                    <option value="Published">
                        Publish
                    </option>

                </select>

            </div>


            {/* ---------------------------------------------------------
                Submit
            --------------------------------------------------------- */}

            <div className="flex justify-end pt-4 border-t">

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-lg bg-[#610e1e] hover:bg-[#4b0b18] text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >

                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Homework"
                            : "Save Homework"
                    }

                </button>

            </div>

        </form>

    );
}