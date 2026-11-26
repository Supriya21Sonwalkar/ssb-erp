import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserShield,
} from "react-icons/fa";

import api from "../../../services/api";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        login_id: "",
        role_id: "",
        status: "1",
        password: "",
        password_confirmation: "",
    });

    // Load user and roles
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [userResponse, rolesResponse] = await Promise.all([
                    api.get(`/user-management/users/${id}`),
                    api.get("/user-management/roles"),
                ]);

                const user = userResponse.data?.data;
                const rolesData =
                    rolesResponse.data?.data ?? rolesResponse.data;

                if (!user) {
                    throw new Error("User details were not returned.");
                }

                setRoles(Array.isArray(rolesData) ? rolesData : []);

                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    login_id: user.login_id || "",
                    role_id: String(user.role_id ?? user.role?.id ?? ""),
                    status: String(user.status ?? 1),
                    password: "",
                    password_confirmation: "",
                });
            } catch (error) {
                console.error("Unable to load user:", error);

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load user details."
                );
            } finally {
                setLoading(false);
                setLoadingRoles(false);
            }
        };

        fetchData();
    }, [id]);

    // Handle form fields
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            ...(name === "password"
                ? { password_confirmation: "" }
                : {}),
        }));

        setErrorMessage("");
    };

    // Validate fields
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "Name is required.";
        }

        if (!formData.email.trim()) {
            validationErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            validationErrors.email = "Enter a valid email address.";
        }

        if (!formData.role_id) {
            validationErrors.role_id = "Please select a role.";
        }

        if (formData.password) {
            if (formData.password.length < 8) {
                validationErrors.password =
                    "Password must contain at least 8 characters.";
            }

            if (
                formData.password !== formData.password_confirmation
            ) {
                validationErrors.password_confirmation =
                    "Passwords do not match.";
            }
        }

        return validationErrors;
    };

    // Submit update
    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);
        setErrors({});
        setErrorMessage("");

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                login_id: formData.login_id.trim() || null,
                role_id: Number(formData.role_id),
                status: Number(formData.status),
            };

            // Only send password if the user entered a new one.
            if (formData.password) {
                payload.password = formData.password;
                payload.password_confirmation =
                    formData.password_confirmation;
            }

            const response = await api.put(
                `/user-management/users/${id}`,
                payload
            );

            alert(
                response.data?.message ||
                "User updated successfully!"
            );

            navigate("/user-management/users");
        } catch (error) {
            console.error("Unable to update user:", error);

            const responseData = error.response?.data;

            if (responseData?.errors) {
                const backendErrors = {};

                Object.entries(responseData.errors).forEach(
                    ([field, messages]) => {
                        backendErrors[field] = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                    }
                );

                setErrors(backendErrors);
                setErrorMessage("Please correct the highlighted fields.");
            } else {
                setErrorMessage(
                    responseData?.message ||
                    "Unable to update user. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#610e1e]" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading user details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/user-management/users")}
                    className="rounded-lg border border-gray-300 bg-white p-3 text-gray-600 transition hover:bg-gray-100"
                    title="Back to Users"
                >
                    <FaArrowLeft />
                </button>

                <div>
                    <p className="mb-1 text-sm text-gray-500">
                        User Management / Users / Edit User
                    </p>

                    <h1 className="text-2xl font-bold text-[#610e1e] md:text-3xl">
                        Edit User
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update user details and account access.
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {errorMessage}
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                {/* Basic Information */}
                <div className="border-b border-gray-200 p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-[#610e1e]/10 p-3 text-[#610e1e]">
                            <FaUser size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Basic Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Update the user's personal information.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={255}
                                className={inputClass}
                                placeholder="Enter full name"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>
                                Email Address <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} pl-10`}
                                    placeholder="Enter email address"
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Login ID */}
                        <div>
                            <label htmlFor="login_id" className={labelClass}>
                                Login ID
                            </label>

                            <input
                                id="login_id"
                                name="login_id"
                                value={formData.login_id}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Enter login ID"
                            />

                            {errors.login_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.login_id}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className={labelClass}>
                                Account Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Information */}
                <div className="border-b border-gray-200 p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-[#FFD963]/30 p-3 text-[#610e1e]">
                            <FaUserShield size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Role Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Assign a role to this user.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role_id" className={labelClass}>
                            Role <span className="text-red-500">*</span>
                        </label>

                        <select
                            id="role_id"
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            required
                            disabled={loadingRoles}
                            className={inputClass}
                        >
                            <option value="">
                                {loadingRoles ? "Loading roles..." : "Select a role"}
                            </option>

                            {roles.map((role) => (
                                <option
                                    key={role.id}
                                    value={String(role.id)}
                                >
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        {errors.role_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.role_id}
                            </p>
                        )}
                    </div>
                </div>

                {/* Optional Password */}
                <div className="border-b border-gray-200 p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
                            <FaLock size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Change Password
                            </h2>

                            <p className="text-sm text-gray-500">
                                Leave these fields empty to keep the current password.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="password" className={labelClass}>
                                New Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                className={inputClass}
                                placeholder="Enter new password"
                            />

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className={labelClass}
                            >
                                Confirm New Password
                            </label>

                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Confirm new password"
                            />

                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse justify-end gap-3 bg-gray-50 p-6 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate("/user-management/users")}
                        disabled={saving}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving || loadingRoles}
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4b0a16] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FaSave />
                        {saving ? "Updating User..." : "Update User"}
                    </button>
                </div>
            </form>
        </div>
    );
}