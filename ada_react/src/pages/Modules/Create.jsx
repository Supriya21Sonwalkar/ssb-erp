import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ModuleForm from "../../components/modules/ModuleForm";
import moduleApi from "../../services/moduleApi";

export default function Create() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        module_name: "",
        module_icon: "",
        description: "",
        display_order: "",
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

            const response = await moduleApi.create(formData);

            navigate("/configuration/modules");

        } catch (error) {

            console.error(error);

            if (error.response?.data?.errors) {

                const errors = Object.values(
                    error.response.data.errors
                )
                    .flat()
                    .join("\n");

                alert(errors);

            } else {

                alert(
                    error.response?.data?.message ||
                    "Unable to create module."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-6xl mx-auto p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#610e1e]">
                    Create Module
                </h1>

                <p className="text-gray-600 mt-2">
                    Fill the details below to create a new module.
                </p>

            </div>

            <ModuleForm
                mode="create"
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
            />

        </div>

    );

}