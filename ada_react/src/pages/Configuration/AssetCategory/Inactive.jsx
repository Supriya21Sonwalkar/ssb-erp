import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaArchive,
    FaUndo,
} from "react-icons/fa";
import assetCategoryApi from "../../../services/assetCategoryApi";

const Inactive = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadInactiveCategories();
    }, []);

    const loadInactiveCategories = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await assetCategoryApi.getInactive();

            setCategories(response.data?.data || []);
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to load inactive asset categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to restore this Asset Category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await assetCategoryApi.restore(id);

            setMessage(
                response.data?.message ||
                "Asset category restored successfully."
            );

            loadInactiveCategories();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to restore asset category."
            );
        }
    };

    return (
        <div className="min-h-full p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Inactive Asset Categories
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and restore inactive asset categories
                    </p>
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

            {/* Success Message */}
            {message && (
                <div
                    className="
                        mb-5
                        flex items-center justify-between
                        gap-4
                        px-4 py-3
                        rounded-lg
                        border border-green-200
                        bg-green-50
                        text-green-700
                        text-sm
                    "
                >
                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        className="
                            text-green-600
                            hover:text-green-900
                            text-xl
                            leading-none
                        "
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Error Message */}
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

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-11 h-11
                                rounded-xl
                                bg-[#FFD963]/20
                                flex items-center justify-center
                            "
                        >
                            <FaArchive className="text-[#FFD963] text-lg" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Inactive Categories
                            </h2>

                            <p className="text-sm text-white/70 mt-1">
                                {categories.length} inactive{" "}
                                {categories.length === 1
                                    ? "category"
                                    : "categories"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Content */}
                <div className="p-6">

                    {loading ? (

                        /* Loading */
                        <div className="flex flex-col items-center justify-center py-16">

                            <div
                                className="
                                    w-10 h-10
                                    border-4
                                    border-gray-200
                                    border-t-[#610e1e]
                                    rounded-full
                                    animate-spin
                                "
                            ></div>

                            <p className="mt-4 text-sm text-gray-500">
                                Loading inactive categories...
                            </p>

                        </div>

                    ) : categories.length === 0 ? (

                        /* Empty State */
                        <div className="text-center py-16">

                            <div
                                className="
                                    mx-auto
                                    w-16 h-16
                                    rounded-full
                                    bg-gray-100
                                    flex items-center justify-center
                                "
                            >
                                <FaArchive
                                    className="text-2xl text-gray-400"
                                />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-700">
                                No Inactive Categories
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no inactive asset
                                categories.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/configuration/asset-categories"
                                    )
                                }
                                className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4 py-2.5
                                    rounded-lg
                                    bg-[#610e1e]
                                    text-white
                                    text-sm font-semibold
                                    hover:bg-[#7a1a2e]
                                    transition
                                "
                            >
                                <FaArrowLeft />
                                Back to Active Categories
                            </button>

                        </div>

                    ) : (

                        /* Table */
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>
                                    <tr className="border-b border-gray-200">

                                        <th
                                            className="
                                                px-4 py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                                w-16
                                            "
                                        >
                                            #
                                        </th>

                                        <th
                                            className="
                                                px-4 py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                            "
                                        >
                                            Category Name
                                        </th>

                                        <th
                                            className="
                                                px-4 py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                            "
                                        >
                                            Category Code
                                        </th>

                                        <th
                                            className="
                                                px-4 py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                            "
                                        >
                                            Description
                                        </th>

                                        <th
                                            className="
                                                px-4 py-4
                                                text-left
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                            "
                                        >
                                            Status
                                        </th>

                                        <th
                                            className="
                                                px-4 py-4
                                                text-center
                                                text-xs
                                                font-bold
                                                text-gray-500
                                                uppercase
                                                tracking-wider
                                            "
                                        >
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {categories.map(
                                        (category, index) => (

                                            <tr
                                                key={category.id}
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                {/* Number */}
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {index + 1}
                                                </td>

                                                {/* Name */}
                                                <td className="px-4 py-4">

                                                    <div className="font-semibold text-gray-800">
                                                        {
                                                            category.category_name
                                                        }
                                                    </div>

                                                </td>

                                                {/* Code */}
                                                <td className="px-4 py-4">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            px-2.5 py-1
                                                            rounded-md
                                                            bg-[#FFD963]/20
                                                            text-[#610e1e]
                                                            text-xs
                                                            font-bold
                                                        "
                                                    >
                                                        {
                                                            category.category_code
                                                        }
                                                    </span>

                                                </td>

                                                {/* Description */}
                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-gray-600">
                                                        {
                                                            category.description ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-3 py-1
                                                            rounded-full
                                                            bg-gray-100
                                                            text-gray-600
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                w-1.5 h-1.5
                                                                rounded-full
                                                                bg-gray-400
                                                            "
                                                        ></span>

                                                        Inactive
                                                    </span>

                                                </td>

                                                {/* Action */}
                                                <td className="px-4 py-4">

                                                    <div className="flex justify-center">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRestore(
                                                                    category.id
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3.5 py-2
                                                                rounded-lg
                                                                bg-green-50
                                                                text-green-700
                                                                text-xs
                                                                font-semibold
                                                                hover:bg-green-100
                                                                transition
                                                            "
                                                        >
                                                            <FaUndo />
                                                            Restore
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Inactive;