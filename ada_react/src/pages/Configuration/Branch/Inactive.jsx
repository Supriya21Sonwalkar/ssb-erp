import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import branchApi from "../../../services/branchApi";
export default function Inactive() {
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
            const response = await branchApi.getInactive();
            const data = response.data.data ?? [];
            setBranches(data);
            setFilteredBranches(data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleRestore = async (id) => {
        if (!window.confirm("Restore this branch?")) {
            return;
        }
        try {
            await branchApi.restore(id);
            fetchBranches();
        } catch (error) {
            console.error(error);
            alert("Unable to restore branch.");
        }
    };
    return (
        <div className="max-w-full mx-auto px-3 py-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Inactive Branches
                </h1>
                <Link
                    to="/configuration/branches"
                    className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded text-sm"
                >
                    Active Branches
                </Link>
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
                                    No Inactive Branches Found.
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
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleRestore(branch.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Restore
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