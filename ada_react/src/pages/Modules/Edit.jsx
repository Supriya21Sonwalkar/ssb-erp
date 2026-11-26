import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import moduleApi from "../../services/moduleApi";
import ModuleForm from "../../components/modules/ModuleForm";

export default function Edit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        module_name: "",
        module_code: "",
        module_icon: "",
        route: "",
        description: "",
        display_order: 1,
        status: 1,
    });

    useEffect(() => {
        loadModule();
    }, []);

    const loadModule = async () => {

        try {

            const response = await moduleApi.getById(id);

            setFormData({
                module_name: response.data.data.module_name || "",
                module_code: response.data.data.module_code || "",
                module_icon: response.data.data.module_icon || "",
                route: response.data.data.route || "",
                description: response.data.data.description || "",
                display_order: response.data.data.display_order || 1,
                status: response.data.data.status ? 1 : 0,
            });

        } catch (error) {

            console.error(error);

            alert("Unable to load module.");

            navigate("/configuration/modules");

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

            const response = await moduleApi.update(id, formData);

            navigate("/configuration/modules");

        } catch (error) {

            console.error(error);

            if (error.response?.data?.errors) {

                const errors = Object.values(error.response.data.errors)
                    .flat()
                    .join("\n");

                alert(errors);

            } else {

                alert(
                    error.response?.data?.message ||
                    "Unable to update module."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    if (pageLoading) {

        return (
            <div className="p-6">
                Loading...
            </div>
        );

    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">
                    Edit Module
                </h1>

                <p className="text-gray-600 mt-2">
                    Update module details.
                </p>

            </div>

            <ModuleForm
                mode="edit"
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
            />

        </div>

    );

}