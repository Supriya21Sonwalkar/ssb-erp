export default function BranchForm({

    formData,

    handleChange,

    handleSubmit,

    loading,

    mode = "create",

}) {

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div className="bg-white rounded-xl shadow border">

                <div className="px-5 py-3 border-b">

                    <h2 className="text-lg font-semibold text-[#610e1e]">

                        Branch Information

                    </h2>

                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Branch Name */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Branch Name <span className="text-red-500">*</span>

                        </label>

                        <input
                            type="text"
                            name="branch_name"
                            value={formData.branch_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    {/* Branch Code */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Branch Code <span className="text-red-500">*</span>

                        </label>

                        <input
                            type="text"
                            name="branch_code"
                            value={formData.branch_code}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                    </div>

                    {/* Status */}

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Status

                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >

                            <option value={1}>
                                Active
                            </option>

                            <option value={0}>
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-[#610e1e] text-white hover:bg-[#4d0b18]"
                >
                    {loading
                        ? "Saving..."
                        : mode === "create"
                            ? "Save Branch"
                            : "Update Branch"}
                </button>

            </div>

        </form>

    );

}