import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import branchApi from "../../../services/branchApi";
export default function Index() {
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        fetchBranches();
    }, []);
    useEffect(() => {
        const keyword = search.toLowerCase();
        setFilteredBranches(
            branches.filter((branch) =>
                (branch.branch_name ?? "")
                    .toLowerCase()
                    .includes(keyword)
                ||
                (branch.branch_code ?? "")
                    .toLowerCase()
                    .includes(keyword)
            )
        );
    }, [search, branches]);
    const fetchBranches = async () => {
        try {
            const response = await branchApi.getAll();
            const data = response.data.data ?? [];
            setBranches(data);
            setFilteredBranches(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Move branch to inactive?")) {
            return;
        }
        try {
            await branchApi.delete(id);
            fetchBranches();
        } catch (error) {
            console.log(error);
            alert("Unable to inactive branch.");
        }
    };
    return (
        <div className="max-w-full mx-auto px-3 py-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Branch Master
                </h1>
                <div className="flex gap-2">
                    <Link
                        to="/configuration/branches/inactive"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Inactive
                    </Link>
                    <Link
                        to="/configuration/branches/create"
                        className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded text-sm"
                    >
                        + Add Branch
                    </Link>
                </div>
            </div>
            {/* Search */}
            <div className="bg-white rounded-lg shadow border p-3 mb-3">
                <input
                    type="text"
                    placeholder="Search Branch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#610e1e] text-white">
                        <tr>
                            <th className="px-3 py-2 text-left">
                                Branch Code
                            </th>
                            <th className="px-3 py-2 text-left">
                                Branch Name
                            </th>
                            <th className="px-3 py-2 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No Branch Found.
                                </td>
                            </tr>
                        ) : (
                            filteredBranches.map((branch) => (
                                <tr
                                    key={branch.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-3 py-2 font-medium">
                                        {branch.branch_code}
                                    </td>
                                    <td className="px-3 py-2">
                                        {branch.branch_name}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-center gap-1">
                                            <Link
                                                to={`/configuration/branches/show/${branch.id}`}
                                                className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/configuration/branches/edit/${branch.id}`}
                                                className="px-2 py-1 text-sm rounded bg-amber-500 text-white hover:bg-amber-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(branch.id)}
                                                className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                            >
                                                Inactive
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
    );
}