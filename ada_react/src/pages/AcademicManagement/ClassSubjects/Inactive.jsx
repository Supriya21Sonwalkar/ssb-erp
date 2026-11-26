import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import classSubjectApi from "../../../services/classSubjectApi";

export default function Inactive() {

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchRecords();

    }, []);

    useEffect(() => {

        const filtered = records.filter(item =>
            item.class?.class_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredRecords(filtered);

    }, [search, records]);

    const fetchRecords = async () => {

        try {

            const response = await classSubjectApi.getInactive();

            setRecords(response.data.data);
            setFilteredRecords(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleRestore = async (id) => {

        if (!window.confirm("Restore this record?")) return;

        try {

            await classSubjectApi.restore(id);

            fetchRecords();

        } catch (error) {

            console.log(error);

            alert("Unable to Restore.");

        }

    };

    return (

         

            <div className="max-w-7xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow">

                    <div className="border-b p-6 flex justify-between items-center">

                        <div>

                            <h2 className="text-2xl font-bold text-[#610e1e]">

                                Inactive Class Subject Mapping

                            </h2>

                            <p className="text-gray-500">

                                Restore inactive mappings

                            </p>

                        </div>

                        <Link
                            to="/academic-management/class-subjects"
                            className="bg-[#610e1e] text-white px-5 py-2 rounded-lg"
                        >
                            Back
                        </Link>

                    </div>

                    <div className="p-6">

                        <input
                            type="text"
                            placeholder="Search Class..."
                            className="border rounded-lg p-3 w-full md:w-80 mb-5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-[#610e1e] text-white">

                                    <tr>

                                        <th className="p-3">#</th>

                                        <th className="p-3 text-left">

                                            Class

                                        </th>

                                        <th className="p-3 text-left">

                                            Subject

                                        </th>

                                        <th className="p-3 text-center">

                                            Type

                                        </th>

                                        <th className="p-3 text-center">

                                            Restore

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredRecords.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-8"
                                            >

                                                No Inactive Records Found

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredRecords.map((item, index) => (

                                            <tr
                                                key={item.id}
                                                className="border-b"
                                            >

                                                <td className="p-3">

                                                    {index + 1}

                                                </td>

                                                <td className="p-3">

                                                    {item.class?.class_name}

                                                </td>

                                                <td className="p-3">

                                                    {item.subject?.subject_name}

                                                </td>

                                                <td className="p-3 text-center">

                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">

                                                        {item.is_compulsory
                                                            ? "Compulsory"
                                                            : "Optional"}

                                                    </span>

                                                </td>

                                                <td className="p-3 text-center">

                                                    <button

                                                        onClick={() =>
                                                            handleRestore(item.id)
                                                        }

                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg"

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

                </div>

            </div>

          

    );

}