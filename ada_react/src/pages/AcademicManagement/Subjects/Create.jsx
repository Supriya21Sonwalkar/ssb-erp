import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import subjectApi from "../../../services/subjectApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Create() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        subject_name: "",
        subject_code: "",
        subject_type: "Theory",
        description: "",
        display_order: 1,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});

        try {
            await subjectApi.create(form);

            navigate("/academic-management/subjects");
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(error.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
         
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Add Subject
                    </h1>
                    <p className="text-gray-500">
                        Create a new subject.
                    </p>
                </div>

                <Link
                    to="/academic-management/subjects"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    Back
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Subject Name */}
                    <div>
                        <label className="block font-medium mb-2">
                            Subject Name
                        </label>

                        <input
                            type="text"
                            name="subject_name"
                            value={form.subject_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#610e1e]"
                        />

                        {errors.subject_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subject_name[0]}
                            </p>
                        )}
                    </div>

                    {/* Subject Code */}
                    <div>
                        <label className="block font-medium mb-2">
                            Subject Code
                        </label>

                        <input
                            type="text"
                            name="subject_code"
                            value={form.subject_code}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#610e1e]"
                        />

                        {errors.subject_code && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subject_code[0]}
                            </p>
                        )}
                    </div>

                    {/* Subject Type */}
                    <div>
                        <label className="block font-medium mb-2">
                            Subject Type
                        </label>

                        <select
                            name="subject_type"
                            value={form.subject_type}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#610e1e]"
                        >
                            <option value="Theory">Theory</option>
                            <option value="Practical">Practical</option>
                            <option value="Both">Both</option>
                        </select>

                        {errors.subject_type && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subject_type[0]}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#610e1e]"
                        ></textarea>

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block font-medium mb-2">
                            Display Order
                        </label>

                        <input
                            type="number"
                            min="1"
                            name="display_order"
                            value={form.display_order}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#610e1e]"
                        />

                        {errors.display_order && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.display_order[0]}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#610e1e] hover:bg-[#4b0b17] text-white px-6 py-2 rounded-lg"
                        >
                            {loading ? "Saving..." : "Save Subject"}
                        </button>

                        <Link
                            to="/academic-management/subjects"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                        >
                            Cancel
                        </Link>
                    </div>

                </form>
            </div>
        </div>
          
    );
}