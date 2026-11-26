import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import subjectApi from "../../../services/subjectApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Inactive() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await subjectApi.getInactive();
            setSubjects(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm("Restore this subject?")) return;

        try {
            await subjectApi.restore(id);
            fetchSubjects();
        } catch (error) {
            console.error(error);
            alert("Unable to restore subject.");
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
    //             Loading Inactive Subjects...
    //         </div>
    //     );
    // }

    return (
         
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Inactive Subjects
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Restore inactive subjects.
                    </p>
                </div>

                <Link
                    to="/academic-management/subjects"
                    className="bg-[#610e1e] hover:bg-[#4b0b17] text-white px-4 py-2 rounded-lg"
                >
                    Back to Subjects
                </Link>
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
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-[#610e1e] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Display Order</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSubjects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No inactive subjects found.
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
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                            Inactive
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                handleRestore(subject.id)
                                            }
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