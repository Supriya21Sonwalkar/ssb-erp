import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaBoxOpen,
} from "react-icons/fa";

import assetApi from "../../../services/assetApi";
import assetCategoryApi from "../../../services/assetCategoryApi";
import assetSubcategoryApi from "../../../services/assetSubcategoryApi";

const Create = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [formData, setFormData] = useState({
        category_id: "",
        subcategory_id: "",
        asset_name: "",
        asset_code: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);

            const response = await assetCategoryApi.getAll();

            setCategories(response.data?.data || []);
        } catch (err) {
            console.error("Error loading categories:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load asset categories."
            );
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadSubcategories = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }

        try {
            setLoadingSubcategories(true);

            const response = await assetSubcategoryApi.getAll();

            const allSubcategories = response.data?.data || [];

            const filtered = allSubcategories.filter(
                (subcategory) =>
                    Number(subcategory.category_id) === Number(categoryId)
            );

            setSubcategories(filtered);
        } catch (err) {
            console.error("Error loading subcategories:", err);

            setSubcategories([]);

            setError(
                err.response?.data?.message ||
                    "Failed to load asset subcategories."
            );
        } finally {
            setLoadingSubcategories(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");

        if (name === "category_id") {
            setFormData((previous) => ({
                ...previous,
                category_id: value,
                subcategory_id: "",
            }));

            loadSubcategories(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setErrors({});

        try {
            await assetApi.create(formData);

            alert("Asset created successfully.");

            navigate("/configuration/assets");
        } catch (err) {
            console.error("Error creating asset:", err);

            if (err.response?.status === 422) {
                setErrors(err.response?.data?.errors || {});

                setError(
                    err.response?.data?.message ||
                        "Please correct the highlighted fields."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        "Failed to create asset."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#610e1e] text-[#FFD963] flex items-center justify-center">
                            <FaBoxOpen className="text-lg" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#610e1e]">
                                Add Asset
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Create a new asset
                            </p>
                        </div>
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

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                <form onSubmit={handleSubmit}>

                    <div className="p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Asset Category{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    disabled={loadingCategories}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.category_id
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    } bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]`}
                                >
                                    <option value="">
                                        {loadingCategories
                                            ? "Loading categories..."
                                            : "Select Category"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.category_name}
                                            {category.category_code
                                                ? ` (${category.category_code})`
                                                : ""}
                                        </option>
                                    ))}
                                </select>

                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_id[0]}
                                    </p>
                                )}
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Asset Subcategory{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="subcategory_id"
                                    value={formData.subcategory_id}
                                    onChange={handleChange}
                                    disabled={
                                        !formData.category_id ||
                                        loadingSubcategories
                                    }
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.subcategory_id
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    } bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]`}
                                >
                                    <option value="">
                                        {!formData.category_id
                                            ? "Select Category First"
                                            : loadingSubcategories
                                            ? "Loading subcategories..."
                                            : subcategories.length === 0
                                            ? "No subcategories found"
                                            : "Select Subcategory"}
                                    </option>

                                    {subcategories.map((subcategory) => (
                                        <option
                                            key={subcategory.id}
                                            value={subcategory.id}
                                        >
                                            {subcategory.subcategory_name}
                                            {subcategory.subcategory_code
                                                ? ` (${subcategory.subcategory_code})`
                                                : ""}
                                        </option>
                                    ))}
                                </select>

                                {errors.subcategory_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subcategory_id[0]}
                                    </p>
                                )}
                            </div>

                            {/* Asset Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Asset Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="asset_name"
                                    value={formData.asset_name}
                                    onChange={handleChange}
                                    placeholder="Enter asset name"
                                    maxLength="200"
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.asset_name
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]`}
                                />

                                {errors.asset_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.asset_name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Asset Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Asset Code{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="asset_code"
                                    value={formData.asset_code}
                                    onChange={handleChange}
                                    placeholder="Enter unique asset code"
                                    maxLength="100"
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.asset_code
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]`}
                                />

                                {errors.asset_code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.asset_code[0]}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Enter asset description"
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.description
                                            ? "border-red-400"
                                            : "border-gray-300"
                                    } resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD963] focus:border-[#610e1e]`}
                                />

                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description[0]}
                                    </p>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                        <Link
                            to="/configuration/assets"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#610e1e] text-[#FFD963] hover:bg-[#7a1527] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Asset"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Create;