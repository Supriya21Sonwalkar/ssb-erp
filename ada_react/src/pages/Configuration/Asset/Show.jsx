import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaBoxOpen,
} from "react-icons/fa";

import assetApi from "../../../services/assetApi";

const Show = () => {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAsset();
    }, [id]);

    const loadAsset = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await assetApi.getById(id);

            setAsset(response.data?.data || null);
        } catch (err) {
            console.error("Error loading asset:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load asset."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
                    Loading asset...
                </div>
            </div>
        );
    }

    if (error || !asset) {
        return (
            <div className="p-6">
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    {error || "Asset not found."}
                </div>

                <Link
                    to="/configuration/assets"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                    <FaArrowLeft />
                    Back to Assets
                </Link>
            </div>
        );
    }

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
                            Asset Details
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            View asset information
                        </p>
                    </div>

                </div>

                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/configuration/assets"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                    >
                        <FaArrowLeft />
                        Back
                    </Link>

                    <Link
                        to={`/configuration/assets/edit/${asset.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#610e1e] text-[#FFD963] hover:bg-[#7a1527] transition"
                    >
                        <FaEdit />
                        Edit Asset
                    </Link>

                </div>

            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Card Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {asset.asset_name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {asset.asset_code}
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                Number(asset.status) === 1
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {Number(asset.status) === 1
                                ? "Active"
                                : "Inactive"}
                        </span>

                    </div>
                </div>

                {/* Details */}
                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Asset Name */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Asset Name
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-800">
                                {asset.asset_name || "-"}
                            </p>
                        </div>

                        {/* Asset Code */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Asset Code
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-800">
                                {asset.asset_code || "-"}
                            </p>
                        </div>

                        {/* Category */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Category
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-800">
                                {asset.category?.category_name || "-"}
                            </p>

                            {asset.category?.category_code && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Code: {asset.category.category_code}
                                </p>
                            )}
                        </div>

                        {/* Subcategory */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Subcategory
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-800">
                                {asset.subcategory?.subcategory_name || "-"}
                            </p>

                            {asset.subcategory?.subcategory_code && (
                                <p className="mt-1 text-sm text-gray-500">
                                    Code:{" "}
                                    {asset.subcategory.subcategory_code}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                            </p>

                            <div className="mt-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        Number(asset.status) === 1
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {Number(asset.status) === 1
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Created At
                            </p>

                            <p className="mt-2 text-base font-medium text-gray-800">
                                {asset.created_at
                                    ? new Date(
                                          asset.created_at
                                      ).toLocaleString()
                                    : "-"}
                            </p>
                        </div>

                        {/* Updated Date */}
                        <div className="rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Updated At
                            </p>

                            <p className="mt-2 text-base font-medium text-gray-800">
                                {asset.updated_at
                                    ? new Date(
                                          asset.updated_at
                                      ).toLocaleString()
                                    : "-"}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 rounded-xl border border-gray-200 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Description
                            </p>

                            <p className="mt-2 text-base text-gray-700 whitespace-pre-wrap">
                                {asset.description || "No description provided."}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Show;