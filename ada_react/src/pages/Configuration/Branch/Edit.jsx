import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import branchApi from "../../../services/branchApi";
import BranchForm from "../../../components/branch/BranchForm";
export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [formData, setFormData] = useState({
        branch_name: "",
        branch_code: "",
        status: 1,
    });
    useEffect(() => {
        fetchBranch();
    }, []);
    const fetchBranch = async () => {
        try {
            const response = await branchApi.getById(id);
            const branch = response.data.branch;
            setFormData({
                branch_name: branch.branch_name || "",
                branch_code: branch.branch_code || "",
                contact_no: branch.contact_no || "",
                email: branch.email || "",
                address: branch.address || "",
                status: branch.status ?? 1,
            });
        } catch (error) {
            console.error(error);
            alert("Branch not found.");
            navigate("/configuration/branches");
        } finally {
            setPageLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await branchApi.update(id, formData);
            navigate("/configuration/branches");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                alert(
                    Object.values(error.response.data.errors)
                        .flat()
                        .join("\n")
                );
            } else {
                alert(
                    error.response?.data?.message ||
                    "Unable to update branch."
                );
            }
        } finally {
            setLoading(false);
        }
    };
    if (pageLoading) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                Loading...
            </div>
        );
    }
    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Edit Branch
                </h1>
                <p className="text-gray-500 mt-1">
                    Update branch information.
                </p>
            </div>
            <BranchForm
                mode="edit"
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}