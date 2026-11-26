import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserShield,
} from "react-icons/fa";

import api from "../../../services/api";

export default function UserCreate() {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_id: "",
        status: "1",
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch available roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoadingRoles(true);
                setErrorMessage("");

                const response = await api.get(
                    "/user-management/roles"
                );

                const responseData =
                    response.data?.data ?? response.data;

                if (!Array.isArray(responseData)) {
                    throw new Error(
                        "The server returned an invalid roles response."
                    );
                }

                // Only allow active roles to be assigned.
                const activeRoles = responseData.filter(
                    (role) =>
                        Number(role.status) === 1 ||
                        role.status === true
                );

                setRoles(activeRoles);
            } catch (error) {
                console.error("Failed to load roles:", error);

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load roles. Please try again."
                );
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    // Handle input changes
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

    // Validate form
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.name.trim()) {
            validationErrors.name = "Full name is required.";
        } else if (formData.name.trim().length > 255) {
            validationErrors.name =
                "Name cannot exceed 255 characters.";
        }

        if (!formData.email.trim()) {
            validationErrors.email = "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            validationErrors.email =
                "Enter a valid email address.";
        }

        if (!formData.password) {
            validationErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            validationErrors.password =
                "Password must contain at least 8 characters.";
        }

        if (!formData.password_confirmation) {
            validationErrors.password_confirmation =
                "Please confirm your password.";
        } else if (
            formData.password !== formData.password_confirmation
        ) {
            validationErrors.password_confirmation =
                "Passwords do not match.";
        }

        if (!formData.role_id) {
            validationErrors.role_id =
                "Please select a role.";
        }

        return validationErrors;
    };

    // Create user
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
                password: formData.password,
                password_confirmation:
                    formData.password_confirmation,
                role_id: Number(formData.role_id),
                status: Number(formData.status),
            };

            const response = await api.post(
                "/user-management/users",
                payload
            );

            alert(
                response.data?.message ||
                "User created successfully!"
            );

            navigate("/user-management/users");
        } catch (error) {
            console.error("Failed to create user:", error);

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

                setErrorMessage(
                    "Please correct the highlighted fields."
                );
            } else {
                setErrorMessage(
                    responseData?.message ||
                    "Unable to create user. Please try again."
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

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/user-management/users")
                    }
                    className="rounded-lg border border-gray-300 bg-white p-3 text-gray-600 transition hover:bg-gray-100"
                    title="Back to Users"
                >
                    <FaArrowLeft />
                </button>

                <div>
                    <p className="mb-1 text-sm text-gray-500">
                        User Management / Users / Add User
                    </p>

                    <h1 className="text-2xl font-bold text-[#610e1e] md:text-3xl">
                        Create User
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Create a new account and assign its role.
                    </p>
                </div>
            </div>

            {/* General Error */}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {errorMessage}
                    </p>
                </div>
            )}

            {/* Form */}
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
                                Enter the user's personal and account information.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className={labelClass}
                            >
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={255}
                                placeholder="Enter full name"
                                className={inputClass}
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className={labelClass}
                            >
                                Email Address{" "}
                                <span className="text-red-500">*</span>
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
                                    placeholder="Enter email address"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className={labelClass}
                            >
                                Password{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    placeholder="Enter password"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className={labelClass}
                            >
                                Confirm Password{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm password"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>

                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Access Information */}
                <div className="border-b border-gray-200 p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-[#FFD963]/30 p-3 text-[#610e1e]">
                            <FaUserShield size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Access Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Configure the user's role and account status.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role_id"
                                className={labelClass}
                            >
                                Role{" "}
                                <span className="text-red-500">*</span>
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
                                    {loadingRoles
                                        ? "Loading roles..."
                                        : "Select a role"}
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.id}
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

                            {!loadingRoles && roles.length === 0 && (
                                <p className="mt-1 text-sm text-red-600">
                                    No active roles available. Create or activate a role first.
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className={labelClass}
                            >
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
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse justify-end gap-3 bg-gray-50 p-6 sm:flex-row">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/user-management/users")
                        }
                        disabled={saving}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            loadingRoles ||
                            roles.length === 0
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4b0a16] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FaSave />

                        {saving ? "Creating User..." : "Create User"}
                    </button>
                </div>
            </form>
        </div>
    );
}