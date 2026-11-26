import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaSave } from "react-icons/fa";
import api from "../../../services/api";

export default function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        guard_name: "admin",
        status: 1,
    });

    // Fetch existing role details
    useEffect(() => {
        const fetchRole = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const response = await api.get(
                    `/user-management/roles/${id}`
                );

                const role = response.data?.data;

                if (!role) {
                    throw new Error("Role details were not returned by the API.");
                }

                setFormData({
                    name: role.name || "",
                    description: role.description || "",
                    guard_name: role.guard_name || "admin",
                    status: Number(role.status ?? 1),
                });
            } catch (error) {
                console.error("Error loading role:", error);

                setErrorMessage(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load role details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [id]);

    // Handle form inputs
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "status" ? Number(value) : value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    };

    // Update role
    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setErrors({});
        setErrorMessage("");

        try {
            await api.put(`/user-management/roles/${id}`, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                guard_name: formData.guard_name,
                status: Number(formData.status),
            });

            alert("Role updated successfully!");

            navigate("/user-management/roles");
        } catch (error) {
            console.error("Error updating role:", error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to update role. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#610e1e]" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading role details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Page Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/user-management/roles")}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#610e1e]"
                >
                    <FaArrowLeft />
                    Back to User Roles
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-md">
                        <FaShieldAlt size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Role
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the role information and status.
                        </p>
                    </div>
                </div>
            </div>

            {/* General Error */}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {errorMessage}
                    </p>

                    {!formData.name && (
                        <button
                            type="button"
                            onClick={() => navigate("/user-management/roles")}
                            className="mt-3 text-sm font-semibold text-red-700 underline"
                        >
                            Return to User Roles
                        </button>
                    )}
                </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    {/* Section Header */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Role Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the basic details of this role.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                        {/* Role Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Role Name
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Enter role name"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        {/* Guard Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Guard Name
                            </label>

                            <select
                                name="guard_name"
                                value={formData.guard_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
                            >
                                <option value="admin">Admin</option>
                                <option value="web">Web</option>
                            </select>

                            {errors.guard_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.guard_name[0]}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status[0]}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                maxLength={500}
                                placeholder="Enter role description"
                                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate("/user-management/roles")}
                        disabled={saving}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving || !formData.name.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#4b0b17] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FaSave className="text-[#FFD963]" />

                        {saving ? "Updating..." : "Update Role"}
                    </button>
                </div>
            </form>
        </div>
    );
}