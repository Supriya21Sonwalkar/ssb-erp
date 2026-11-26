import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaBoxes,
    FaCode,
    FaAlignLeft,
    FaCircle,
} from "react-icons/fa";
import assetCategoryApi from "../../../services/assetCategoryApi";

const Show = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadCategory();
    }, [id]);

    const loadCategory = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await assetCategoryApi.getById(id);

            const data = response.data?.data;

            if (!data) {
                setErrorMessage("Asset category not found.");
                return;
            }

            setCategory(data);
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

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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

    if (!category) {
        return (
            <div className="min-h-full p-6">

                <div
                    className="
                        max-w-3xl
                        mx-auto
                        bg-white
                        rounded-2xl
                        border border-gray-200
                        shadow-sm
                        p-8
                        text-center
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-16 h-16
                            rounded-full
                            bg-red-50
                            flex items-center justify-center
                        "
                    >
                        <FaBoxes className="text-2xl text-red-500" />
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        Asset Category Not Found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {errorMessage ||
                            "The requested asset category could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/configuration/asset-categories")
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            px-5 py-2.5
                            rounded-lg
                            bg-[#610e1e]
                            text-white
                            text-sm font-semibold
                            hover:bg-[#7a1a2e]
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Back to Categories
                    </button>
                </div>

            </div>
        );
    }

    const isActive = Number(category.status) === 1;

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
                        <FaBoxes className="text-[#610e1e] text-lg" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Asset Category Details
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            View asset category information
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/configuration/asset-categories")
                        }
                        className="
                            inline-flex
                            items-center
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
                        Back
                    </button>

                    {isActive && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/configuration/asset-categories/edit/${category.id}`
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4 py-2.5
                                rounded-lg
                                bg-gradient-to-r
                                from-[#610e1e]
                                to-[#8a1a2e]
                                text-white
                                text-sm font-semibold
                                shadow-md
                                hover:from-[#7a1a2e]
                                hover:to-[#9a2a3e]
                                transition
                            "
                        >
                            <FaEdit />
                            Edit
                        </button>
                    )}

                </div>

            </div>

            {/* Error */}
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

            {/* Main Card */}
            <div
                className="
                    max-w-5xl
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
                        px-6 py-6
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                    "
                >
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-white/70">
                                Category
                            </p>

                            <h2 className="text-2xl font-bold text-white mt-1">
                                {category.category_name}
                            </h2>
                        </div>

                        <div
                            className="
                                w-14 h-14
                                rounded-2xl
                                bg-[#FFD963]/20
                                flex items-center justify-center
                            "
                        >
                            <FaBoxes className="text-[#FFD963] text-2xl" />
                        </div>

                    </div>
                </div>

                {/* Information */}
                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Category Name */}
                        <div
                            className="
                                rounded-xl
                                border border-gray-200
                                bg-gray-50
                                p-5
                            "
                        >
                            <div className="flex items-center gap-3 mb-3">

                                <div
                                    className="
                                        w-9 h-9
                                        rounded-lg
                                        bg-[#610e1e]/10
                                        flex items-center justify-center
                                    "
                                >
                                    <FaBoxes className="text-[#610e1e]" />
                                </div>

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Category Name
                                </p>

                            </div>

                            <p className="text-lg font-semibold text-gray-800">
                                {category.category_name || "-"}
                            </p>
                        </div>

                        {/* Category Code */}
                        <div
                            className="
                                rounded-xl
                                border border-gray-200
                                bg-gray-50
                                p-5
                            "
                        >
                            <div className="flex items-center gap-3 mb-3">

                                <div
                                    className="
                                        w-9 h-9
                                        rounded-lg
                                        bg-[#FFD963]/30
                                        flex items-center justify-center
                                    "
                                >
                                    <FaCode className="text-[#610e1e]" />
                                </div>

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Category Code
                                </p>

                            </div>

                            <span
                                className="
                                    inline-flex
                                    px-3 py-1.5
                                    rounded-lg
                                    bg-[#FFD963]/25
                                    text-[#610e1e]
                                    text-sm
                                    font-bold
                                "
                            >
                                {category.category_code || "-"}
                            </span>
                        </div>

                        {/* Status */}
                        <div
                            className="
                                rounded-xl
                                border border-gray-200
                                bg-gray-50
                                p-5
                            "
                        >
                            <div className="flex items-center gap-3 mb-3">

                                <div
                                    className="
                                        w-9 h-9
                                        rounded-lg
                                        bg-gray-100
                                        flex items-center justify-center
                                    "
                                >
                                    <FaCircle className="text-[#610e1e] text-sm" />
                                </div>

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Status
                                </p>

                            </div>

                            {isActive ? (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-3 py-1.5
                                        rounded-full
                                        bg-green-100
                                        text-green-700
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    <span
                                        className="
                                            w-2 h-2
                                            rounded-full
                                            bg-green-500
                                        "
                                    ></span>

                                    Active
                                </span>
                            ) : (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-3 py-1.5
                                        rounded-full
                                        bg-gray-200
                                        text-gray-600
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    <span
                                        className="
                                            w-2 h-2
                                            rounded-full
                                            bg-gray-500
                                        "
                                    ></span>

                                    Inactive
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div
                            className="
                                md:col-span-2
                                rounded-xl
                                border border-gray-200
                                bg-gray-50
                                p-5
                            "
                        >
                            <div className="flex items-center gap-3 mb-3">

                                <div
                                    className="
                                        w-9 h-9
                                        rounded-lg
                                        bg-[#610e1e]/10
                                        flex items-center justify-center
                                    "
                                >
                                    <FaAlignLeft className="text-[#610e1e]" />
                                </div>

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Description
                                </p>

                            </div>

                            <p className="text-sm leading-6 text-gray-700">
                                {category.description ||
                                    "No description available."}
                            </p>
                        </div>

                    </div>

                    {/* Dates */}
                    <div className="mt-6 pt-6 border-t border-gray-200">

                        <h3 className="text-sm font-bold text-gray-700 mb-4">
                            Record Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <p className="text-xs text-gray-500">
                                    Created At
                                </p>

                                <p className="text-sm font-medium text-gray-800 mt-1">
                                    {formatDate(category.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Last Updated
                                </p>

                                <p className="text-sm font-medium text-gray-800 mt-1">
                                    {formatDate(category.updated_at)}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Show;