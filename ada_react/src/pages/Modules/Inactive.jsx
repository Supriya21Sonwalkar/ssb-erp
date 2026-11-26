import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import moduleApi from "../../services/moduleApi";

export default function Inactive() {

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {

        try {

            const response = await moduleApi.getInactive();

            setModules(response.data.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load inactive modules.");

        } finally {

            setLoading(false);

        }

    };

    const handleRestore = async (id) => {

        if (!window.confirm("Restore this module?")) {
            return;
        }

        try {

            await moduleApi.restore(id);

            loadModules();

        } catch (error) {

            console.error(error);

            alert("Unable to restore module.");

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

        <div className="p-6">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Inactive Modules
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Restore inactive modules.
                    </p>

                </div>

                <Link
                    to="/configuration/modules"
                    className="bg-[#610e1e] text-white px-5 py-2 rounded-lg"
                >
                    Back
                </Link>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">Module</th>
                            <th className="text-left p-4">Code</th>
                            <th className="text-left p-4">Route</th>
                            <th className="text-center p-4">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {modules.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center py-8"
                                >
                                    No inactive modules found.
                                </td>

                            </tr>

                        ) : (

                            modules.map((module) => (

                                <tr
                                    key={module.id}
                                    className="border-t"
                                >

                                    <td className="p-4">
                                        {module.module_name}
                                    </td>

                                    <td className="p-4">
                                        {module.module_code}
                                    </td>

                                    <td className="p-4">
                                        {module.route}
                                    </td>

                                    <td className="p-4 text-center">

                                        <button
                                            onClick={() => handleRestore(module.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                        >
                                            Restore
                                        </button>

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