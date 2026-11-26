import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaShieldAlt,
    FaExclamationCircle,
} from "react-icons/fa";
import api from "../../../services/api";

export default function CreateRole() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        guard_name: "admin",
        status: "1",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Role name is required.";
        } else if (form.name.trim().length > 255) {
            newErrors.name = "Role name cannot exceed 255 characters.";
        }

        if (form.description.length > 1000) {
            newErrors.description =
                "Description cannot exceed 1000 characters.";
        }

        if (!form.guard_name.trim()) {
            newErrors.guard_name = "Guard name is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setServerError("");

        try {
            await api.post("/user-management/roles", {
                name: form.name.trim(),
                description: form.description.trim() || null,
                guard_name: form.guard_name,
                status: form.status === "1" ? 1 : 0,
                permissions: [],
            });

            alert("Role created successfully.");

            navigate("/user-management/roles");
        } catch (error) {
            console.error("Create role error:", error);

            if (error.response?.status === 422) {
                const responseErrors = error.response.data.errors;

                if (responseErrors) {
                    const formattedErrors = {};

                    Object.keys(responseErrors).forEach((key) => {
                        formattedErrors[key] = responseErrors[key][0];
                    });

                    setErrors(formattedErrors);
                } else {
                    setServerError(
                        error.response.data.message ||
                            "Please check the entered information."
                    );
                }
            } else {
                setServerError(
                    error.response?.data?.message ||
                        "Unable to create role. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = (field) =>
        `mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
        ${
            errors[field]
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
        }`;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-md">
                        <FaShieldAlt size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Role
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Add a new role to User Management.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/user-management/roles")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    <FaArrowLeft />
                    Back to Roles
                </button>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                noValidate
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                    <h2 className="text-lg font-bold text-gray-800">
                        Role Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the details for the new role.
                    </p>
                </div>

                <div className="space-y-6 p-6">
                    {serverError && (
                        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                            <FaExclamationCircle className="mt-0.5 text-red-600" />

                            <p className="text-sm text-red-700">
                                {serverError}
                            </p>
                        </div>
                    )}

                    {/* Role Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Role Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Accountant"
                            maxLength={255}
                            className={inputClass("name")}
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the responsibilities of this role"
                            rows={4}
                            maxLength={1000}
                            className={inputClass("description")}
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                            {form.description.length}/1000 characters
                        </p>

                        {errors.description && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Guard and Status */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="guard_name"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Guard Name{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="guard_name"
                                name="guard_name"
                                value={form.guard_name}
                                onChange={handleChange}
                                className={inputClass("guard_name")}
                            >
                                <option value="admin">admin</option>
                                <option value="web">web</option>
                            </select>

                            {errors.guard_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.guard_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={inputClass("status")}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Information */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-800">
                            Important
                        </p>

                        <p className="mt-1 text-sm text-amber-700">
                            This creates a custom role. You can configure its
                            permissions separately after creating it.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => navigate("/user-management/roles")}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#7a1a2e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FaSave className="text-[#FFD963]" />

                        {submitting ? "Saving..." : "Save Role"}
                    </button>
                </div>
            </form>
        </div>
    );
}