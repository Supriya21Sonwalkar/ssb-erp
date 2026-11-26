import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaBan,
    FaArchive,
    FaSearch,
    FaSitemap,
    FaEye,
} from "react-icons/fa";
import assetSubcategoryApi from "../../../services/assetSubcategoryApi";

const Index = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState(
        location.state?.message || ""
    );

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadSubcategories();

        if (location.state?.message) {
            window.history.replaceState({}, document.title);
        }
    }, []);

    const loadSubcategories = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await assetSubcategoryApi.getAll();

            setSubcategories(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load asset subcategories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to move this Asset Subcategory to inactive?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await assetSubcategoryApi.delete(id);

            setMessage(
                response.data?.message ||
                "Asset subcategory moved to inactive successfully."
            );

            loadSubcategories();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to move asset subcategory to inactive."
            );
        }
    };

    const filteredSubcategories = subcategories.filter((subcategory) => {
        const searchText = search.toLowerCase();

        return (
            subcategory.subcategory_name
                ?.toLowerCase()
                .includes(searchText) ||
            subcategory.subcategory_code
                ?.toLowerCase()
                .includes(searchText) ||
            subcategory.category?.category_name
                ?.toLowerCase()
                .includes(searchText) ||
            subcategory.description
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    return (
        <div className="min-h-full p-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-11 h-11
                            rounded-xl
                            bg-[#610e1e]/10
                            flex items-center justify-center
                        "
                    >
                        <FaSitemap className="text-[#610e1e] text-lg" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Asset Subcategories
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage active asset subcategories
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-3">

                    {/* Inactive */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/configuration/asset-subcategories/inactive"
                            )
                        }
                        className="
                            flex items-center gap-2
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
                        <FaArchive />
                        Inactive
                    </button>

                    {/* Add */}
                    <Link
                        to="/configuration/asset-subcategories/create"
                        className="
                            flex items-center gap-2
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
                        <FaPlus />
                        Add Subcategory
                    </Link>

                </div>

            </div>

            {/* Success */}
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

            {/* Error */}
            {error && (
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
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
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
                        border-b border-gray-200
                        bg-gradient-to-r
                        from-[#610e1e]
                        to-[#8a1a2e]
                    "
                >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Active Asset Subcategories
                            </h2>

                            <p className="text-sm text-white/70 mt-1">
                                Total active subcategories:{" "}
                                {subcategories.length}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">

                            <FaSearch
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search subcategories..."
                                className="
                                    w-full
                                    pl-10 pr-4 py-2.5
                                    rounded-lg
                                    bg-white
                                    text-gray-800
                                    text-sm
                                    border border-white/20
                                    outline-none
                                    focus:ring-4
                                    focus:ring-[#FFD963]/30
                                "
                            />

                        </div>

                    </div>

                </div>

                {/* Content */}
                <div className="p-6">

                    {loading ? (

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
                                Loading asset subcategories...
                            </p>

                        </div>

                    ) : filteredSubcategories.length === 0 ? (

                        <div className="text-center py-16">

                            <div
                                className="
                                    mx-auto
                                    w-16 h-16
                                    rounded-full
                                    bg-[#610e1e]/10
                                    flex items-center justify-center
                                "
                            >
                                <FaSitemap
                                    className="text-2xl text-[#610e1e]"
                                />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-700">
                                No Asset Subcategories Found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {search
                                    ? "No subcategories match your search."
                                    : "Create your first asset subcategory."}
                            </p>

                            {!search && (
                                <Link
                                    to="/configuration/asset-subcategories/create"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        mt-5
                                        px-4 py-2.5
                                        rounded-lg
                                        bg-[#610e1e]
                                        text-white
                                        text-sm font-semibold
                                        hover:bg-[#7a1a2e]
                                        transition
                                    "
                                >
                                    <FaPlus />
                                    Add Subcategory
                                </Link>
                            )}

                        </div>

                    ) : (

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
                                            Category
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
                                            Subcategory Name
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
                                            Code
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

                                    {filteredSubcategories.map(
                                        (subcategory, index) => (

                                            <tr
                                                key={subcategory.id}
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                {/* # */}
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {index + 1}
                                                </td>

                                                {/* Category */}
                                                <td className="px-4 py-4">

                                                    <div className="font-semibold text-[#610e1e]">
                                                        {
                                                            subcategory
                                                                .category
                                                                ?.category_name ||
                                                            "-"
                                                        }
                                                    </div>

                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {
                                                            subcategory
                                                                .category
                                                                ?.category_code ||
                                                            "-"
                                                        }
                                                    </div>

                                                </td>

                                                {/* Subcategory */}
                                                <td className="px-4 py-4">

                                                    <div className="font-semibold text-gray-800">
                                                        {
                                                            subcategory.subcategory_name
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
                                                            subcategory.subcategory_code
                                                        }
                                                    </span>

                                                </td>

                                                {/* Description */}
                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-gray-600">
                                                        {
                                                            subcategory.description ||
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
                                                            bg-green-100
                                                            text-green-700
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                w-1.5 h-1.5
                                                                rounded-full
                                                                bg-green-500
                                                            "
                                                        ></span>

                                                        Active
                                                    </span>

                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4">

                                                    <div className="flex items-center justify-center gap-2">

                                                        {/* View */}
                                                        <Link
                                                            to={`/configuration/asset-subcategories/show/${subcategory.id}`}
                                                            className="
                                                                flex items-center gap-1.5
                                                                px-3 py-2
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-700
                                                                text-xs
                                                                font-semibold
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                        >
                                                            <FaEye />
                                                            View
                                                        </Link>

                                                        {/* Edit */}
                                                        <Link
                                                            to={`/configuration/asset-subcategories/edit/${subcategory.id}`}
                                                            className="
                                                                flex items-center gap-1.5
                                                                px-3 py-2
                                                                rounded-lg
                                                                bg-amber-50
                                                                text-amber-700
                                                                text-xs
                                                                font-semibold
                                                                hover:bg-amber-100
                                                                transition
                                                            "
                                                        >
                                                            <FaEdit />
                                                            Edit
                                                        </Link>

                                                        {/* Inactive */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    subcategory.id
                                                                )
                                                            }
                                                            className="
                                                                flex items-center gap-1.5
                                                                px-3 py-2
                                                                rounded-lg
                                                                bg-red-50
                                                                text-red-700
                                                                text-xs
                                                                font-semibold
                                                                hover:bg-red-100
                                                                transition
                                                            "
                                                        >
                                                            <FaBan />
                                                            Inactive
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

export default Index;