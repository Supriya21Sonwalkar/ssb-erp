import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaEdit,
} from "react-icons/fa";
import assetCategoryApi from "../../../services/assetCategoryApi";

const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        category_name: "",
        category_code: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadCategory();
    }, [id]);

    const loadCategory = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await assetCategoryApi.getById(id);

            const category = response.data?.data;

            if (!category) {
                setErrorMessage("Asset category not found.");
                return;
            }

            setFormData({
                category_name: category.category_name || "",
                category_code: category.category_code || "",
                description: category.description || "",
            });
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to load asset category."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});
        setErrorMessage("");

        try {
            const response = await assetCategoryApi.update(
                id,
                formData
            );

            if (response.data?.status) {
                navigate("/configuration/asset-categories", {
                    state: {
                        message:
                            response.data?.message ||
                            "Asset category updated successfully.",
                    },
                });
            }
        } catch (error) {
            console.error(error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    /* Loading */
    if (loading) {
        return (
            <div className="min-h-full p-6">

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border border-gray-200
                        shadow-sm
                        flex flex-col
                        items-center
                        justify-center
                        py-20
                    "
                >
                    <div
                        className="
                            w-11 h-11
                            border-4
                            border-gray-200
                            border-t-[#610e1e]
                            rounded-full
                            animate-spin
                        "
                    ></div>

                    <p className="mt-4 text-sm text-gray-500">
                        Loading asset category...
                    </p>
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-full p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-11 h-11
                            rounded-xl
                            bg-[#610e1e]/10
                            flex items-center justify-center
                        "
                    >
                        <FaEdit className="text-[#610e1e] text-lg" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Edit Asset Category
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Update asset category details
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/configuration/asset-categories")
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4 py-2.5
                        rounded-lg
                        border border-gray-300
                        bg-white
                        text-gray-700
                        text-sm font-semibold
                        hover:bg-gray-100
                        transition
                    "
                >
                    <FaArrowLeft />
                    Back to Categories
                </button>

            </div>

            {/* Error */}
            {errorMessage && (
                <div
                    className="
                        mb-5
                        flex items-center justify-between
                        gap-4
                        px-4 py-3
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        text-red-700
                        text-sm
                    "
                >
                    <span>{errorMessage}</span>

                    <button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        className="
                            text-red-600
                            hover:text-red-900
                            text-xl
                            leading-none
                        "
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Main Card */}
            <div
                className="
                    bg-white
                    rounded-2xl
                    border border-gray-200
                    shadow-sm
                    overflow-hidden
                "
            >

                {/* Card Header */}
                <div
                    className="
                        px-6 py-5
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                        border-b border-[#FFD963]/20
                    "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-10 h-10
                                rounded-xl
                                bg-[#FFD963]/20
                                flex items-center justify-center
                            "
                        >
                            <FaEdit className="text-[#FFD963]" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Category Information
                            </h2>

                            <p className="text-sm text-white/70 mt-1">
                                Modify the details below and save your changes
                            </p>
                        </div>

                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Category Name */}
                            <div>
                                <label
                                    htmlFor="category_name"
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Category Name
                                    <span className="text-red-500 ml-1">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="category_name"
                                    type="text"
                                    name="category_name"
                                    value={formData.category_name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    className={`
                                        w-full
                                        px-4 py-3
                                        rounded-lg
                                        border
                                        ${
                                            errors.category_name
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300 focus:border-[#610e1e] focus:ring-[#610e1e]/20"
                                        }
                                        bg-white
                                        text-gray-800
                                        outline-none
                                        focus:ring-4
                                        transition
                                    `}
                                />

                                {errors.category_name && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.category_name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Category Code */}
                            <div>
                                <label
                                    htmlFor="category_code"
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Category Code
                                    <span className="text-red-500 ml-1">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="category_code"
                                    type="text"
                                    name="category_code"
                                    value={formData.category_code}
                                    onChange={handleChange}
                                    placeholder="Enter category code"
                                    className={`
                                        w-full
                                        px-4 py-3
                                        rounded-lg
                                        border
                                        ${
                                            errors.category_code
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300 focus:border-[#610e1e] focus:ring-[#610e1e]/20"
                                        }
                                        bg-white
                                        text-gray-800
                                        outline-none
                                        focus:ring-4
                                        transition
                                    `}
                                />

                                {errors.category_code && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.category_code[0]}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">

                                <label
                                    htmlFor="description"
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter description"
                                    className={`
                                        w-full
                                        px-4 py-3
                                        rounded-lg
                                        border
                                        ${
                                            errors.description
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-300 focus:border-[#610e1e] focus:ring-[#610e1e]/20"
                                        }
                                        bg-white
                                        text-gray-800
                                        outline-none
                                        focus:ring-4
                                        transition
                                        resize-none
                                    `}
                                ></textarea>

                                {errors.description && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.description[0]}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Footer */}
                    <div
                        className="
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:items-center
                            sm:justify-end
                            gap-3
                            px-6 py-4
                            bg-gray-50
                            border-t border-gray-200
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/configuration/asset-categories"
                                )
                            }
                            className="
                                px-5 py-2.5
                                rounded-lg
                                border border-gray-300
                                bg-white
                                text-gray-700
                                text-sm font-semibold
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5 py-2.5
                                rounded-lg
                                bg-gradient-to-r
                                from-[#610e1e]
                                to-[#8a1a2e]
                                text-white
                                text-sm font-semibold
                                shadow-md
                                hover:from-[#7a1a2e]
                                hover:to-[#9a2a3e]
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition
                            "
                        >
                            {saving ? (
                                <>
                                    <span
                                        className="
                                            w-4 h-4
                                            border-2
                                            border-white/30
                                            border-t-white
                                            rounded-full
                                            animate-spin
                                        "
                                    ></span>

                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Update Category
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Edit;