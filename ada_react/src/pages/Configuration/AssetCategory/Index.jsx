import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaBan,
    FaArchive,
    FaSearch,
    FaEye,
} from "react-icons/fa";
import assetCategoryApi from "../../../services/assetCategoryApi";

const Index = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState(
        location.state?.message || ""
    );

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadCategories();

        // Clear navigation state after reading message
        if (location.state?.message) {
            window.history.replaceState({}, document.title);
        }
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await assetCategoryApi.getAll();

            setCategories(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load asset categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to move this Asset Category to inactive?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await assetCategoryApi.delete(id);

            setMessage(
                response.data?.message ||
                "Asset category moved to inactive successfully."
            );

            loadCategories();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to move asset category to inactive."
            );
        }
    };

    const filteredCategories = categories.filter((category) => {
        const searchText = search.toLowerCase();

        return (
            category.category_name
                ?.toLowerCase()
                .includes(searchText) ||
            category.category_code
                ?.toLowerCase()
                .includes(searchText) ||
            category.description
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    return (
        <div className="min-h-full p-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Asset Categories
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage asset categories
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* Inactive */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/configuration/asset-categories/inactive"
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
                        Inactive Categories
                    </button>

                    {/* Add */}
                    <Link
                        to="/configuration/asset-categories/create"
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
                        Add Category
                    </Link>

                </div>

            </div>

            {/* Success Message */}
            {message && (
                <div
                    className="
                        mb-5
                        flex items-center justify-between
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
                        className="text-green-700 hover:text-green-900 text-lg"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div
                    className="
                        mb-5
                        flex items-center justify-between
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
                        className="text-red-700 hover:text-red-900 text-lg"
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
                                Active Asset Categories
                            </h2>

                            <p className="text-sm text-white/70 mt-1">
                                Total active categories: {categories.length}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-72">

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
                                placeholder="Search categories..."
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

                {/* Table */}
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
                                Loading asset categories...
                            </p>

                        </div>

                    ) : filteredCategories.length === 0 ? (

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
                                <FaArchive
                                    className="text-2xl text-[#610e1e]"
                                />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-700">
                                No Asset Categories Found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {search
                                    ? "No categories match your search."
                                    : "Create your first asset category."}
                            </p>

                            {!search && (
                                <Link
                                    to="/configuration/asset-categories/create"
                                    className="
                                        inline-flex
                                        items-center gap-2
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
                                    Add Category
                                </Link>
                            )}

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>
                                    <tr className="border-b border-gray-200">

                                        <th className="
                                            px-4 py-4
                                            text-left
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            #
                                        </th>

                                        <th className="
                                            px-4 py-4
                                            text-left
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            Category Name
                                        </th>

                                        <th className="
                                            px-4 py-4
                                            text-left
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            Category Code
                                        </th>

                                        <th className="
                                            px-4 py-4
                                            text-left
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            Description
                                        </th>

                                        <th className="
                                            px-4 py-4
                                            text-left
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            Status
                                        </th>

                                        <th className="
                                            px-4 py-4
                                            text-center
                                            text-xs
                                            font-bold
                                            text-gray-500
                                            uppercase
                                            tracking-wider
                                        ">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredCategories.map(
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

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-4">

                                                    <div className="font-semibold text-gray-800">
                                                        {
                                                            category.category_name
                                                        }
                                                    </div>

                                                </td>

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

                                                <td className="px-4 py-4">

                                                    <span className="text-sm text-gray-600">
                                                        {
                                                            category.description ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>

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

                                                <td className="px-4 py-4">

                                                    <div className="flex items-center justify-center gap-2">

                                                        {/* View */}
                                                        <Link to={`/configuration/asset-categories/show/${category.id}`} className=" flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition " > 
                                                            <FaEye />
                                                            View
                                                        </Link>
                                                        {/* Edit */}
                                                        <Link to={`/configuration/asset-categories/edit/${category.id}`} className=" flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition " > 
                                                            <FaEdit />
                                                            Edit
                                                        </Link>

                                                        {/* Inactive */}
                                                        <button type="button" onClick={() => handleDelete( category.id ) } 
                                                            className=" flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition ">
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