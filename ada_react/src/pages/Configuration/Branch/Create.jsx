import { useState } from "react";
import { useNavigate } from "react-router-dom";
import branchApi from "../../../services/branchApi";
import BranchForm from "../../../components/branch/BranchForm";
export default function Create() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        branch_name: "",
        branch_code: "",
        status: 1,
    });
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
            const response = await branchApi.create(formData);
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
                    "Unable to create branch."
                );
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Create Branch
                </h1>
                <p className="text-gray-500 mt-1">
                    Fill branch information below.
                </p>
            </div>
            <BranchForm
                mode="create"
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}