import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import classSubjectApi from "../../../services/classSubjectApi";

export default function Index() {

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {

        const filtered = records.filter(item =>
            item.class_name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredRecords(filtered);

    }, [search, records]);

    const fetchRecords = async () => {

        try {

            const res = await classSubjectApi.getAll();

            setRecords(res.data.data);
            setFilteredRecords(res.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

         

            <div className="max-w-7xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow">

                    <div className="flex justify-between items-center p-6 border-b">

                        <div>

                            <h2 className="text-2xl font-bold text-[#610e1e]">

                                Class Subject Mapping

                            </h2>

                            <p className="text-gray-500">

                                Manage class wise subjects

                            </p>

                        </div>

                        <Link
                            to="/academic-management/class-subjects/create"
                            className="bg-[#610e1e] text-white px-5 py-2 rounded-lg"
                        >
                            + Assign Subjects
                        </Link>

                    </div>

                    <div className="p-6">

                        <div className="mb-5">

                            <input
                                type="text"
                                placeholder="Search Class..."
                                className="border rounded-lg w-full md:w-80 p-3"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-[#610e1e] text-white">

                                    <tr>

                                        <th className="p-3 text-left">#</th>

                                        <th className="p-3 text-left">

                                            Class

                                        </th>

                                        <th className="p-3 text-left">

                                            Subjects

                                        </th>

                                        <th className="p-3 text-center">

                                            Total

                                        </th>

                                        <th className="p-3 text-center">

                                            Action

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

                                                No Records Found

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

                                                <td className="p-3 font-medium">

                                                    {item.class_name}

                                                </td>

                                                <td className="p-3">

                                                    <div className="flex flex-wrap gap-2">

                                                        {item.class_subjects?.map(subject => (

                                                            <span
                                                                key={subject.id}
                                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                            >
                                                                {subject.subject.subject_name}
                                                            </span>

                                                        ))}

                                                    </div>

                                                </td>

                                                <td className="text-center">

                                                    {item.class_subjects?.length}

                                                </td>

                                                <td className="text-center">

                                                    <div className="flex justify-center gap-2">

                                                        <Link
                                                            to={`/academic-management/class-subjects/show/${item.id}`}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            to={`/academic-management/class-subjects/edit/${item.id}`}
                                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Edit
                                                        </Link>

                                                    </div>

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