import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaShieldAlt,
    FaSyncAlt,
    FaBan,
    FaCheckCircle,
} from "react-icons/fa";

import api from "../../../services/api";

export default function UserRolesIndex() {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");

    // Fetch roles
    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/user-management/roles");

            const responseData = response.data?.data ?? response.data;

            setRoles(Array.isArray(responseData) ? responseData : []);
        } catch (err) {
            console.error("Failed to fetch roles:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load roles. Please check your login session and API configuration."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // Check whether a role is active
    const isActive = (role) =>
        role.status === true ||
        role.status === 1 ||
        role.status === "1";

    // Check whether a role is a system role
    const isSystemRole = (role) =>
        role.is_system === true ||
        role.is_system === 1 ||
        role.is_system === "1";

    // Search and status filters
    const filteredRoles = useMemo(() => {
        return roles.filter((role) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                role.name?.toLowerCase().includes(searchText) ||
                role.description?.toLowerCase().includes(searchText) ||
                role.guard_name?.toLowerCase().includes(searchText);

            const active = isActive(role);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && active) ||
                (statusFilter === "inactive" && !active);

            return matchesSearch && matchesStatus;
        });
    }, [roles, search, statusFilter]);

    // Deactivate role
    const handleDeactivate = async (role) => {
        if (isSystemRole(role)) {
            alert("System roles cannot be deactivated.");
            return;
        }

        if (!isActive(role)) {
            alert("This role is already inactive.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to deactivate the "${role.name}" role?`
        );

        if (!confirmed) return;

        try {
            await api.put(`/user-management/roles/${role.id}`, {
                name: role.name,
                description: role.description || "",
                guard_name: role.guard_name || "admin",
                status: 0,
            });

            alert("Role deactivated successfully.");

            await fetchRoles();
        } catch (err) {
            console.error("Failed to deactivate role:", err);

            alert(
                err.response?.data?.message ||
                "Unable to deactivate this role."
            );
        }
    };

    // Reactivate role
    const handleReactivate = async (role) => {
        if (isSystemRole(role)) {
            alert("System roles cannot be reactivated through this action.");
            return;
        }

        if (isActive(role)) {
            alert("This role is already active.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to reactivate the "${role.name}" role?`
        );

        if (!confirmed) return;

        try {
            await api.put(`/user-management/roles/${role.id}`, {
                name: role.name,
                description: role.description || "",
                guard_name: role.guard_name || "admin",
                status: 1,
            });

            alert("Role reactivated successfully.");

            await fetchRoles();
        } catch (err) {
            console.error("Failed to reactivate role:", err);

            alert(
                err.response?.data?.message ||
                "Unable to reactivate this role."
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-md">
                            <FaShieldAlt size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                User Roles
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Create and manage system roles.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={fetchRoles}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        <FaSyncAlt className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/user-management/roles/create")
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#7a1a2e]"
                    >
                        <FaPlus className="text-[#FFD963]" />
                        Add Role
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard
                    title="Total Roles"
                    value={roles.length}
                    description="All configured roles"
                />

                <SummaryCard
                    title="Active Roles"
                    value={roles.filter(isActive).length}
                    description="Roles currently active"
                />

                <SummaryCard
                    title="Inactive Roles"
                    value={roles.filter((role) => !isActive(role)).length}
                    description="Roles currently inactive"
                />
            </div>

            {/* Roles Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Search and Filter */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            All Roles
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {filteredRoles.length} role(s) found
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search roles..."
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10 sm:w-64"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#610e1e]"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Loading, Error, Empty State or Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#610e1e]" />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading roles...
                        </p>
                    </div>
                ) : error ? (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>

                        <button
                            type="button"
                            onClick={fetchRoles}
                            className="mt-3 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="py-16 text-center">
                        <FaShieldAlt className="mx-auto text-4xl text-gray-300" />

                        <h3 className="mt-4 font-semibold text-gray-700">
                            No roles found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or status filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Guard
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Permissions
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredRoles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">
                                                {role.name}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {role.description || "No description"}
                                            </div>
                                        </td>

                                        {/* Guard */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {role.guard_name}
                                            </span>
                                        </td>

                                        {/* Permissions */}
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-700">
                                                {role.permissions?.length ?? 0}
                                            </span>

                                            <span className="ml-1 text-xs text-gray-500">
                                                assigned
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    isActive(role)
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isActive(role) ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Role Type */}
                                        <td className="px-5 py-4">
                                            {isSystemRole(role) ? (
                                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                                    System
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    Custom
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions: View, Edit, Inactivate/Reactivate */}
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <ActionButton
                                                    title="View Role"
                                                    onClick={() =>
                                                        navigate(
                                                            `/user-management/roles/${role.id}`
                                                        )
                                                    }
                                                >
                                                    <FaEye />
                                                </ActionButton>

                                                <ActionButton
                                                    title="Edit Role"
                                                    onClick={() =>
                                                        navigate(
                                                            `/user-management/roles/${role.id}/edit`
                                                        )
                                                    }
                                                >
                                                    <FaEdit />
                                                </ActionButton>

                                                {!isSystemRole(role) && (
                                                    <ActionButton
                                                        title={
                                                            isActive(role)
                                                                ? "Deactivate Role"
                                                                : "Reactivate Role"
                                                        }
                                                        onClick={() =>
                                                            isActive(role)
                                                                ? handleDeactivate(role)
                                                                : handleReactivate(role)
                                                        }
                                                        danger={isActive(role)}
                                                    >
                                                        {isActive(role) ? (
                                                            <FaBan />
                                                        ) : (
                                                            <FaCheckCircle />
                                                        )}
                                                    </ActionButton>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Summary Card
function SummaryCard({ title, value, description }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{title}</p>

            <p className="mt-2 text-3xl font-bold text-[#610e1e]">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                {description}
            </p>
        </div>
    );
}

// Action Button
function ActionButton({
    children,
    title,
    onClick,
    disabled = false,
    danger = false,
}) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={onClick}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
                danger
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-gray-200 text-gray-600 hover:border-[#610e1e] hover:bg-[#610e1e] hover:text-white"
            }`}
        >
            {children}
        </button>
    );
}