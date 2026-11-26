import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import branchApi from "../../../services/branchApi";
export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [branch, setBranch] = useState(null);
    useEffect(() => {
        fetchBranch();
    }, []);
    const fetchBranch = async () => {
        try {
            const response = await branchApi.getById(id);
            setBranch(response.data.branch);
        } catch (error) {
            console.error(error);
            alert("Branch not found.");
            navigate("/configuration/branches");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                Loading...
            </div>
        );
    }
    if (!branch) {
        return null;
    }
    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Branch Details
                    </h1>
                    <p className="text-gray-500 mt-1">
                        View branch information.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        to="/branches"
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Back
                    </Link>
                    <Link
                        to={`/branches/edit/${branch.id}`}
                        className="px-4 py-2 rounded-lg bg-[#610e1e] text-white hover:bg-[#4d0b18]"
                    >
                        Edit
                    </Link>
                </div>
            </div>
            {/* Details Card */}
            <div className="bg-white rounded-xl shadow border">
                <div className="px-5 py-3 border-b">
                    <h2 className="text-lg font-semibold text-[#610e1e]">
                        Branch Information
                    </h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-500">
                            Branch Name
                        </label>
                        <p className="mt-1 font-semibold">
                            {branch.branch_name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Branch Code
                        </label>
                        <p className="mt-1 font-semibold">
                            {branch.branch_code}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Status
                        </label>
                        <p className="mt-1">
                            {branch.status ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                    Active
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                    Inactive
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Created At
                        </label>
                        <p className="mt-1 font-semibold">
                            {branch.created_at ?? "-"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">
                            Updated At
                        </label>
                        <p className="mt-1 font-semibold">
                            {branch.updated_at ?? "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}