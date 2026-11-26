import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaUndo,
    FaSearch,
} from "react-icons/fa";

import assetApi from "../../../services/assetApi";

const Inactive = () => {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadInactiveAssets();
    }, []);

    const loadInactiveAssets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await assetApi.getInactive();

            console.log(
                "Inactive Asset Response:",
                response.data
            );

            setAssets(response.data?.data || []);
        } catch (err) {
            console.error(
                "Error loading inactive assets:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to load inactive assets."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to restore this asset?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await assetApi.restore(id);

            alert("Asset restored successfully.");

            loadInactiveAssets();
        } catch (err) {
            console.error(
                "Error restoring asset:",
                err
            );

            alert(
                err.response?.data?.message ||
                    "Failed to restore asset."
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

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-[#610e1e] text-[#FFD963] flex items-center justify-center">
                        <FaBoxOpen />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Inactive Assets
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage inactive assets and restore them
                        </p>
                    </div>

                </div>

                <Link
                    to="/configuration/assets"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                    <FaArrowLeft />
                    Back to Assets
                </Link>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">

                <div className="relative max-w-md">

                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search inactive asset..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]"
                    />

                </div>

            </div>

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
                                    Action
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
                                        Loading inactive assets...
                                    </td>
                                </tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        {search
                                            ? "No inactive assets found for your search."
                                            : "No inactive assets found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredAssets.map(
                                    (asset, index) => (
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
                                                    {asset.category
                                                        ?.category_name ||
                                                        "-"}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {asset.category
                                                        ?.category_code ||
                                                        ""}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="text-sm font-medium text-gray-800">
                                                    {asset.subcategory
                                                        ?.subcategory_name ||
                                                        "-"}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {asset.subcategory
                                                        ?.subcategory_code ||
                                                        ""}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-center">

                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    Inactive
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-center">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRestore(
                                                                asset.id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition text-sm font-medium"
                                                    >
                                                        <FaUndo />
                                                        Restore
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {!loading && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                        {filteredAssets.length}
                    </span>{" "}
                    inactive assets
                </div>
            )}

        </div>
    );
};

export default Inactive;