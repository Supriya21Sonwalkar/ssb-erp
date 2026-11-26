import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import assetCategoryApi from "../../../services/assetCategoryApi";

const Create = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category_name: "",
        category_code: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

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

        setLoading(true);
        setErrors({});
        setErrorMessage("");

        try {
            const response = await assetCategoryApi.create(formData);

            if (response.data?.status) {
                navigate("/configuration/asset-categories", {
                    state: {
                        message:
                            response.data?.message ||
                            "Asset category created successfully.",
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
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Create Asset Category
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Add a new asset category
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/configuration/asset-categories")
                    }
                    className="
                        flex items-center gap-2
                        px-4 py-2.5
                        rounded-lg
                        border border-gray-300
                        bg-white
                        text-gray-700
                        text-sm font-medium
                        hover:bg-gray-100
                        transition
                    "
                >
                    <FaArrowLeft />
                    Back
                </button>

            </div>

            {/* Error Message */}
            {errorMessage && (
                <div
                    className="
                        mb-5
                        px-4 py-3
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        text-red-700
                        text-sm
                    "
                >
                    {errorMessage}
                </div>
            )}

            {/* Form Card */}
            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border border-gray-200
                    overflow-hidden
                "
            >

                {/* Card Header */}
                <div
                    className="
                        px-6 py-4
                        border-b border-gray-200
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                    "
                >
                    <h2 className="text-lg font-semibold text-white">
                        Asset Category Details
                    </h2>

                    <p className="text-sm text-white/70 mt-1">
                        Enter the category information below
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Category Name */}
                            <div>
                                <label
                                    htmlFor="category_name"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                                        ${errors.category_name
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
                                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                                        ${errors.category_code
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
                                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                                        ${errors.description
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
                            items-center
                            justify-end
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
                            disabled={loading}
                            className="
                                flex
                                items-center
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

                            {loading ? (
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

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Save Category
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Create;