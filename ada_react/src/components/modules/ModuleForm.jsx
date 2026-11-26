import { useNavigate } from "react-router-dom";

export default function ModuleForm({
    formData,
    handleChange,
    handleSubmit,
    loading,
    mode = "create",
}) {

    const navigate = useNavigate();

    return (

        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Module Information */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold text-[#610e1e] border-b pb-3 mb-6">
                    Module Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Module Name */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Module Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            name="module_name"
                            value={formData.module_name}
                            onChange={handleChange}
                            placeholder="Employee Management"
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    {/* Module Icon */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Module Icon
                        </label>

                        <input
                            type="text"
                            name="module_icon"
                            value={formData.module_icon}
                            onChange={handleChange}
                            placeholder="FaUsers"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                    </div>

                    {/* Display Order */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Display Order <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    {/* Status */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>

                    </div>

                </div>

                {/* Description */}

                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Enter module description..."
                        className="w-full border rounded-lg px-3 py-2"
                    />

                </div>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-[#610e1e] text-white hover:bg-[#4d0b18] disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : mode === "create"
                        ? "Create Module"
                        : "Update Module"}
                </button>

            </div>

        </form>

    );

}