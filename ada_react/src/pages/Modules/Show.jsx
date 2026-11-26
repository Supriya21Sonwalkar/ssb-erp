import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import moduleApi from "../../services/moduleApi";

export default function Show() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState(null);

    useEffect(() => {
        loadModule();
    }, []);

    const loadModule = async () => {

        try {

            const response = await moduleApi.getById(id);

            setModule(response.data.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load module.");

            navigate("/configuration/modules");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="p-6">
                Loading...
            </div>
        );

    }

    return (

        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-white shadow rounded-xl">

                <div className="border-b px-6 py-4">

                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Module Details
                    </h1>

                </div>

                <div className="grid grid-cols-2 gap-6 p-6">

                    <div>
                        <label className="font-semibold text-gray-600">
                            Module Name
                        </label>

                        <p className="mt-1">
                            {module.module_name}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-600">
                            Module Code
                        </label>

                        <p className="mt-1">
                            {module.module_code}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-600">
                            Icon
                        </label>

                        <p className="mt-1">
                            {module.module_icon}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-600">
                            Route
                        </label>

                        <p className="mt-1">
                            {module.route}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-600">
                            Display Order
                        </label>

                        <p className="mt-1">
                            {module.display_order}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-600">
                            Status
                        </label>

                        <p className="mt-1">
                            {module.status ? "Active" : "Inactive"}
                        </p>
                    </div>

                    <div className="col-span-2">

                        <label className="font-semibold text-gray-600">
                            Description
                        </label>

                        <p className="mt-1 whitespace-pre-wrap">
                            {module.description || "-"}
                        </p>

                    </div>

                </div>

                <div className="border-t px-6 py-4 flex justify-end gap-3">

                    <Link
                        to={`/configuration/modules/edit/${module.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded"
                    >
                        Edit
                    </Link>

                    <Link
                        to="/configuration/modules"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                    >
                        Back
                    </Link>

                </div>

            </div>

        </div>

    );

}