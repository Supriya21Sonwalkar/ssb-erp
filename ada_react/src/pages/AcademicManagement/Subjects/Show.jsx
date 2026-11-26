import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import subjectApi from "../../../services/subjectApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubject();
    }, []);

    const fetchSubject = async () => {
        try {
            const res = await subjectApi.getById(id);
            setSubject(res.data);
        } catch (error) {
            alert("Subject not found.");
            navigate("/academic-management/subjects");
        } finally {
            setLoading(false);
        }
    };

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-64 text-lg font-semibold">
    //             Loading...
    //         </div>
    //     );
    // }

    return (
         
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Subject Details
                    </h1>
                    <p className="text-gray-500">
                        View complete subject information.
                    </p>
                </div>

                <Link
                    to="/academic-management/subjects"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    Back
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                <div className="bg-[#610e1e] text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">
                        {subject.subject_name}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                    <div>
                        <label className="text-gray-500 text-sm">
                            Subject Name
                        </label>

                        <p className="font-semibold text-lg">
                            {subject.subject_name}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Subject Code
                        </label>

                        <p className="font-semibold text-lg">
                            {subject.subject_code}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Subject Type
                        </label>

                        <p className="font-semibold">
                            {subject.subject_type}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Display Order
                        </label>

                        <p className="font-semibold">
                            {subject.display_order}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Status
                        </label>

                        <p>
                            {subject.status ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                    Active
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                    Inactive
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-gray-500 text-sm">
                            Description
                        </label>

                        <div className="mt-2 p-4 border rounded-lg bg-gray-50 min-h-[120px]">
                            {subject.description ? (
                                subject.description
                            ) : (
                                <span className="text-gray-400">
                                    No description available.
                                </span>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
          
    );
}