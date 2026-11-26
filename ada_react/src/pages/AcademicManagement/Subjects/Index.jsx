import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import subjectApi from "../../../services/subjectApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Index() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await subjectApi.getAll();
            setSubjects(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Move this subject to inactive?")) return;

        try {
            await subjectApi.delete(id);
            fetchSubjects();
        } catch (error) {
            console.error(error);
            alert("Unable to delete subject.");
        }
    };

    const filteredSubjects = subjects.filter((subject) =>
        subject.subject_name.toLowerCase().includes(search.toLowerCase()) ||
        subject.subject_code.toLowerCase().includes(search.toLowerCase()) ||
        subject.subject_type.toLowerCase().includes(search.toLowerCase())
    );

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-64 text-lg font-semibold">
    //             Loading Subjects...
    //         </div>
    //     );
    // }

    return (
         
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Subjects
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage all academic subjects.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link
                        to="/academic-management/subjects/inactive"
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        Inactive Subjects
                    </Link>

                    <Link
                        to="/academic-management/subjects/create"
                        className="bg-[#610e1e] hover:bg-[#4c0b18] text-white px-4 py-2 rounded-lg"
                    >
                        + Add Subject
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="mb-5">
                <input
                    type="text"
                    placeholder="Search Subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                />
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-[#610e1e] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Display Order</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSubjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No subjects found.
                                </td>
                            </tr>
                        ) : (
                            filteredSubjects.map((subject, index) => (
                                <tr
                                    key={subject.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {subject.subject_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {subject.subject_code}
                                    </td>

                                    <td className="px-4 py-3">
                                        {subject.subject_type}
                                    </td>

                                    <td className="px-4 py-3">
                                        {subject.display_order}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                            Active
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/academic-management/subjects/show/${subject.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                to={`/academic-management/subjects/edit/${subject.id}`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(subject.id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                Inactive
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