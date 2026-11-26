import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaSyncAlt,
    FaUserShield,
    FaUsers,
    FaUserCheck,
    FaUserSlash,
    FaBan,
    FaCheckCircle,
} from "react-icons/fa";

import api from "../../../services/api";

export default function UserIndex() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [error, setError] = useState("");

    // Fetch users and roles
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [usersResponse, rolesResponse] = await Promise.all([
                api.get("/user-management/users"),
                api.get("/user-management/roles"),
            ]);

            const usersData =
                usersResponse.data?.data ?? usersResponse.data;

            const rolesData =
                rolesResponse.data?.data ?? rolesResponse.data;

            setUsers(Array.isArray(usersData) ? usersData : []);
            setRoles(Array.isArray(rolesData) ? rolesData : []);
        } catch (err) {
            console.error("Failed to fetch users:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load users. Please check your API configuration."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Status helper
    const isActive = (user) =>
        user.status === true ||
        user.status === 1 ||
        user.status === "1" ||
        user.status === "active";

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                user.name?.toLowerCase().includes(searchText) ||
                user.email?.toLowerCase().includes(searchText) ||
                user.login_id?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive(user)) ||
                (statusFilter === "inactive" && !isActive(user));

            const matchesRole =
                roleFilter === "all" ||
                String(user.role_id ?? user.role?.id ?? "") === roleFilter;

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, search, statusFilter, roleFilter]);

    // Activate or deactivate user
    const handleStatusChange = async (user) => {
        const currentlyActive = isActive(user);
        const newStatus = currentlyActive ? 0 : 1;
        const action = currentlyActive ? "deactivate" : "activate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${user.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.put(`/user-management/users/${user.id}`, {
                status: newStatus,
            });

            alert(
                `User ${currentlyActive ? "deactivated" : "activated"} successfully.`
            );

            await fetchData();
        } catch (err) {
            console.error("Failed to update user status:", err);

            alert(
                err.response?.data?.message ||
                `Unable to ${action} this user.`
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-md">
                        <FaUsers size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Users
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage user accounts and their assigned roles.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={fetchData}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <FaSyncAlt className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/user-management/users/create")}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#7a1a2e]"
                    >
                        <FaPlus className="text-[#FFD963]" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard
                    title="Total Users"
                    value={users.length}
                    description="All registered users"
                    icon={<FaUsers />}
                />

                <SummaryCard
                    title="Active Users"
                    value={users.filter(isActive).length}
                    description="Currently active accounts"
                    icon={<FaUserCheck />}
                />

                <SummaryCard
                    title="Inactive Users"
                    value={users.filter((user) => !isActive(user)).length}
                    description="Currently inactive accounts"
                    icon={<FaUserSlash />}
                />
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            All Users
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {filteredUsers.length} user(s) found
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search users..."
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#610e1e] sm:w-56"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#610e1e]"
                        >
                            <option value="all">All Roles</option>

                            {roles.map((role) => (
                                <option key={role.id} value={String(role.id)}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#610e1e]"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#610e1e]" />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading users...
                        </p>
                    </div>
                ) : error ? (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>

                        <button
                            type="button"
                            onClick={fetchData}
                            className="mt-3 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-16 text-center">
                        <FaUsers className="mx-auto text-4xl text-gray-300" />

                        <h3 className="mt-4 font-semibold text-gray-700">
                            No users found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        User
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Login ID
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>

                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">
                                                {user.name || "—"}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {user.email || "—"}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700">
                                            {user.login_id || "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-2 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                                                <FaUserShield />
                                                {user.role?.name ||
                                                    roles.find(
                                                        (role) =>
                                                            String(role.id) ===
                                                            String(user.role_id)
                                                    )?.name ||
                                                    "Not assigned"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    isActive(user)
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isActive(user) ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <ActionButton
                                                    title="View User"
                                                    onClick={() =>
                                                        navigate(
                                                            `/user-management/users/${user.id}`
                                                        )
                                                    }
                                                >
                                                    <FaEye />
                                                </ActionButton>

                                                <ActionButton
                                                    title="Edit User"
                                                    onClick={() =>
                                                        navigate(
                                                            `/user-management/users/${user.id}/edit`
                                                        )
                                                    }
                                                >
                                                    <FaEdit />
                                                </ActionButton>

                                                <ActionButton
                                                    title={
                                                        isActive(user)
                                                            ? "Deactivate User"
                                                            : "Activate User"
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(user)
                                                    }
                                                    danger={isActive(user)}
                                                >
                                                    {isActive(user) ? (
                                                        <FaBan />
                                                    ) : (
                                                        <FaCheckCircle />
                                                    )}
                                                </ActionButton>
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
function SummaryCard({ title, value, description, icon }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#610e1e]">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-[#610e1e]">
                    {icon}
                </div>
            </div>
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
            onClick={onClick}
            disabled={disabled}
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