import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaEye,
    FaEdit,
    FaBan,
    FaSearch,
    FaTrashRestore,
} from "react-icons/fa";
import assetApi from "../../../services/assetApi";

const Index = () => {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await assetApi.getAll();

            console.log("Asset Response:", response.data);

            setAssets(response.data?.data || []);
        } catch (err) {
            console.error("Error loading assets:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load assets."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to move this asset to inactive?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await assetApi.delete(id);

            alert("Asset moved to inactive successfully.");

            loadAssets();
        } catch (err) {
            console.error("Error making asset inactive:", err);

            alert(
                err.response?.data?.message ||
                    "Failed to make asset inactive."
            );
        }
    };

    const filteredAssets = assets.filter((asset) => {
        const searchText = search.toLowerCase();

        return (
            asset.asset_name
                ?.toLowerCase()
                .includes(searchText) ||
            asset.asset_code
                ?.toLowerCase()
                .includes(searchText) ||
            asset.category?.category_name
                ?.toLowerCase()
                .includes(searchText) ||
            asset.subcategory?.subcategory_name
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Assets
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage all active assets
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/configuration/assets/inactive"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        <FaTrashRestore />
                        Inactive Assets
                    </Link>

                    <Link
                        to="/configuration/assets/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#610e1e] text-[#FFD963] hover:bg-[#7a1527] transition shadow-sm"
                    >
                        <FaPlus />
                        Add Asset
                    </Link>

                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">

                <div className="relative max-w-md">

                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search asset, code, category..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]"
                    />

                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead>
                            <tr className="bg-[#610e1e] text-white">

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    #
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Asset Name
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Asset Code
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Category
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Subcategory
                                </th>

                                <th className="px-5 py-4 text-center text-sm font-semibold">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-center text-sm font-semibold">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        Loading assets...
                                    </td>
                                </tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {search
                                            ? "No assets found for your search."
                                            : "No active assets found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredAssets.map((asset, index) => (
                                    <tr
                                        key={asset.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >

                                        <td className="px-5 py-4 text-sm text-gray-700">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">
                                                {asset.asset_name}
                                            </div>

                                            {asset.description && (
                                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                    {asset.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700">
                                            {asset.asset_code}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="text-sm font-medium text-gray-800">
                                                {asset.category?.category_name ||
                                                    "-"}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {asset.category?.category_code ||
                                                    ""}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="text-sm font-medium text-gray-800">
                                                {asset.subcategory
                                                    ?.subcategory_name || "-"}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {asset.subcategory
                                                    ?.subcategory_code || ""}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-center">

                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                Active
                                            </span>

                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex items-center justify-center gap-2">

                                                <Link
                                                    to={`/configuration/assets/show/${asset.id}`}
                                                    title="View"
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                >
                                                    <FaEye />
                                                </Link>

                                                <Link
                                                    to={`/configuration/assets/edit/${asset.id}`}
                                                    title="Edit"
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                                                >
                                                    <FaEdit />
                                                </Link>

                                                <button
                                                    type="button"
                                                    title="Inactive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            asset.id
                                                        )
                                                    }
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                >
                                                    <FaBan />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Footer count */}
            {!loading && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                        {filteredAssets.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                        {assets.length}
                    </span>{" "}
                    active assets
                </div>
            )}

        </div>
    );
};

export default Index;