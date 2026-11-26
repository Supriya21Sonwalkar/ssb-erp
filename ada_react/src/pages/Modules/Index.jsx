import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaEye,
    FaEdit,
    FaTrash,
    FaArchive,
    FaThLarge,
} from "react-icons/fa";

import moduleApi from "../../services/moduleApi";

export default function Index() {

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {

        try {

            const response = await moduleApi.getAll();

            setModules(response.data.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load modules.");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to deactivate this module?")) {
            return;
        }

        try {

            await moduleApi.delete(id);

            loadModules();

        } catch (error) {

            console.error(error);

            alert("Unable to delete module.");

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Modules
                    </h1>

                    <p className="text-gray-600">
                        Manage ERP Modules
                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        to="/modules/dashboard"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaThLarge />
                        Dashboard View
                    </Link>

                    <Link
                        to="/configuration/modules/inactive"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaArchive />
                        Inactive
                    </Link>

                    <Link
                        to="/configuration/modules/create"
                        className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaPlus />
                        Create Module
                    </Link>

                </div>

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-[#610e1e] text-white">

                        <tr>

                            <th className="p-3 text-left">#</th>

                            <th className="p-3 text-left">
                                Module Name
                            </th>

                            <th className="p-3 text-left">
                                Icon
                            </th>

                            <th className="p-3 text-left">
                                Order
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-8"
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : modules.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-8"
                                >
                                    No Modules Found.
                                </td>

                            </tr>

                        ) : (

                            modules.map((module, index) => (

                                <tr
                                    key={module.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-3">
                                        {index + 1}
                                    </td>

                                    <td className="p-3">
                                        {module.module_name}
                                    </td>

                                    <td className="p-3">
                                        {module.module_icon}
                                    </td>

                                    <td className="p-3">
                                        {module.display_order}
                                    </td>

                                    <td className="p-3">

                                        {module.status ? (

                                            <span className="text-green-600 font-semibold">
                                                Active
                                            </span>

                                        ) : (

                                            <span className="text-red-600 font-semibold">
                                                Inactive
                                            </span>

                                        )}

                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center gap-2">

                                            <Link
                                                to={`/configuration/modules/show/${module.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                            >
                                                <FaEye />
                                            </Link>

                                            <Link
                                                to={`/configuration/modules/edit/${module.id}`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                            >
                                                <FaEdit />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(module.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                            >
                                                <FaTrash />
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