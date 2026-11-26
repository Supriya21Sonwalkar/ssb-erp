import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import teacherAllocationApi from "../../../services/teacherAllocationApi";

export default function Show() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [allocation, setAllocation] = useState(null);

    useEffect(() => {

        fetchAllocation();

    }, []);

    const fetchAllocation = async () => {

        try {

            const response = await teacherAllocationApi.get(id);

            setAllocation(response.data.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load Teacher Allocation.");

            navigate(-1);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-10">

                Loading...

            </div>

        );

    }

    if (!allocation) {

        return (

            <div className="text-center py-10">

                No Record Found.

            </div>

        );

    }

    return (

        <div className="max-w-5xl mx-auto p-6">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">

                        Teacher Allocation Details

                    </h1>

                    <p className="text-gray-500 mt-1">

                        View Teacher Allocation

                    </p>

                </div>

                <Link
                    to="/academic-management/teacher-allocations"
                    className="px-4 py-2 bg-[#610e1e] text-white rounded-lg hover:bg-[#4d0b18]"
                >

                    Back

                </Link>

            </div>

            <div className="bg-white rounded-xl shadow border">

                <div className="bg-[#610e1e] text-white px-6 py-3">

                    <h2 className="font-semibold">

                        Allocation Information

                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Academic Year

                        </label>

                        <p className="mt-1">

                            {allocation.academicYear?.academic_year}

                        </p>

                    </div>

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Class

                        </label>

                        <p className="mt-1">

                            {allocation.class?.class_name}

                        </p>

                    </div>

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Subject

                        </label>

                        <p className="mt-1">
                            {allocation.subject_details?.length
                                ? allocation.subject_details
                                    .map(subject => subject.subject_name)
                                    .join(", ")
                                : "-"
                            }
                        </p>

                    </div>

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Teacher

                        </label>

                        <p className="mt-1">

                            {allocation.employee?.first_name}{" "}
                            {allocation.employee?.last_name}

                        </p>

                    </div>

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Status

                        </label>

                        <p className="mt-1">

                            {allocation.status ? (

                                <span className="text-green-600 font-semibold">

                                    Active

                                </span>

                            ) : (

                                <span className="text-red-600 font-semibold">

                                    Inactive

                                </span>

                            )}

                        </p>

                    </div>

                    <div>

                        <label className="text-sm font-semibold text-gray-600">

                            Created At

                        </label>

                        <p className="mt-1">

                            {allocation.created_at}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}