import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaIdBadge,
    FaUserShield,
    FaCalendarAlt,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";

import api from "../../../services/api";

export default function UserView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/user-management/users/${id}`
                );

                setUser(response.data?.data ?? null);
            } catch (err) {
                console.error("Failed to fetch user:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load user details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const isActive =
        user?.status === true ||
        user?.status === 1 ||
        user?.status === "1" ||
        user?.status === "active";

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

    if (error || !user) {
        return (
            <div className="mx-auto max-w-4xl">
                <button
                    type="button"
                    onClick={() => navigate("/user-management/users")}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#610e1e]"
                >
                    <FaArrowLeft />
                    Back to Users
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-red-700">
                        {error || "User not found."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/user-management/users")}
                        className="mt-4 rounded-lg bg-[#610e1e] px-4 py-2 text-sm font-semibold text-white"
                    >
                        Return to Users
                    </button>
                </div>
            </div>
        );
    }

    const roleName =
        user.role?.name || user.role_name || "Not assigned";

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/user-management/users")
                        }
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#610e1e]"
                    >
                        <FaArrowLeft />
                        Back to Users
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-md">
                            <FaUser size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                User Details
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                View account information and assigned role.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/user-management/users/${user.id}/edit`
                        )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#7a1a2e]"
                >
                    <FaEdit className="text-[#FFD963]" />
                    Edit User
                </button>
            </div>

            {/* User Profile Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Profile Header */}
                <div className="bg-gradient-to-r from-[#610e1e] to-[#7a1a2e] p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#FFD963] bg-white/10 text-3xl font-bold text-[#FFD963]">
                            {user.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white">
                                {user.name || "Unnamed User"}
                            </h2>

                            <p className="mt-1 text-sm text-white/80">
                                {user.email || "No email available"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                    <FaUserShield className="text-[#FFD963]" />
                                    {roleName}
                                </span>

                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                        isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {isActive ? (
                                        <FaCheckCircle />
                                    ) : (
                                        <FaTimesCircle />
                                    )}

                                    {isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="p-6 sm:p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800">
                            Basic Information
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Personal and account details.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <DetailItem
                            icon={<FaUser />}
                            label="Full Name"
                            value={user.name}
                        />

                        <DetailItem
                            icon={<FaEnvelope />}
                            label="Email Address"
                            value={user.email}
                        />

                        <DetailItem
                            icon={<FaIdBadge />}
                            label="Login ID"
                            value={user.login_id}
                        />

                        <DetailItem
                            icon={<FaUserShield />}
                            label="Assigned Role"
                            value={roleName}
                        />

                        <DetailItem
                            icon={<FaCalendarAlt />}
                            label="Account Created"
                            value={formatDate(user.created_at)}
                        />

                        <DetailItem
                            icon={<FaCalendarAlt />}
                            label="Last Updated"
                            value={formatDate(user.updated_at)}
                        />
                    </div>
                </div>

                {/* Account Information */}
                <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
                    <h3 className="mb-5 text-lg font-bold text-gray-800">
                        Account Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-sm text-gray-500">
                                User ID
                            </p>

                            <p className="mt-2 text-lg font-bold text-[#610e1e]">
                                #{user.id}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-sm text-gray-500">
                                Role ID
                            </p>

                            <p className="mt-2 text-lg font-bold text-[#610e1e]">
                                {user.role_id ?? user.role?.id ?? "—"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-sm text-gray-500">
                                Account Status
                            </p>

                            <p
                                className={`mt-2 text-lg font-bold ${
                                    isActive
                                        ? "text-green-700"
                                        : "text-red-700"
                                }`}
                            >
                                {isActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/user-management/users")
                    }
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    Back to Users
                </button>
            </div>
        </div>
    );
}

// Reusable detail component
function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#610e1e]/10 text-[#610e1e]">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-sm text-gray-500">
                    {label}
                </p>

                <p className="mt-1 break-words font-semibold text-gray-800">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}