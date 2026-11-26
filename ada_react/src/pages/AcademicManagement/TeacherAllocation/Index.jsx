import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaEye,
    FaEdit,
    FaTrash,
    FaArchive,
} from "react-icons/fa";

import teacherAllocationApi from "../../../services/teacherAllocationApi";

export default function Index() {

    const [allocations, setAllocations] = useState([]);

    const [filteredAllocations, setFilteredAllocations] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchAllocations();

    }, []);

    useEffect(() => {

        const keyword = search.toLowerCase();

        setFilteredAllocations(

            allocations.filter((allocation) =>

                allocation.class?.class_name
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                allocation.subject?.subject_name
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                allocation.employee?.first_name
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                allocation.academicYear?.year_name
                    ?.toLowerCase()
                    .includes(keyword)

            )

        );

    }, [search, allocations]);

    const fetchAllocations = async () => {

        try {

            const response = await teacherAllocationApi.getAll();

            const data = response.data.data ?? [];

            setAllocations(data);

            setFilteredAllocations(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Move Teacher Allocation to inactive?"
            )
        ) {
            return;
        }

        try {

            await teacherAllocationApi.delete(id);

            fetchAllocations();

        } catch (error) {

            console.error(error);

            alert("Unable to delete allocation.");

        }

    };

    return (

        <div className="max-w-full mx-auto px-4 py-4">

            {/* Header */}

            <div className="flex justify-between items-center mb-5">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">

                        Teacher Allocation

                    </h1>

                    <p className="text-gray-500">

                        Manage Teacher Allocations

                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        to="/academic-management/teacher-allocations/inactive"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >

                        <FaArchive />

                        Inactive

                    </Link>

                    <Link
                        to="/academic-management/teacher-allocations/create"
                        className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >

                        <FaPlus />

                        Create Allocation

                    </Link>

                </div>

            </div>

            {/* Search */}

            <div className="bg-white rounded-xl shadow border p-4 mb-4">

                <input

                    type="text"

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    placeholder="Search Teacher Allocation..."

                    className="w-full border rounded-lg px-4 py-2"

                />

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full table-fixed">

                    <thead className="bg-[#610e1e] text-white">
                        <tr>
                            <th className="p-3 text-center w-[18%]">
                                Academic Year
                            </th>

                            <th className="p-3 text-center w-[15%]">
                                Class
                            </th>

                            <th className="p-3 text-center w-[18%]">
                                Subject
                            </th>

                            <th className="p-3 text-center w-[20%]">
                                Teacher
                            </th>

                            <th className="p-3 text-center w-[12%]">
                                Status
                            </th>

                            <th className="p-3 text-center w-[17%]">
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

                        ) : filteredAllocations.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-8"
                                >

                                    No Teacher Allocation Found.

                                </td>

                            </tr>

                        ) : (

                            filteredAllocations.map((allocation) => (

                                <tr
                                    key={allocation.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-3 text-center">
                                        {allocation.academicYear?.academic_year || "-"}
                                    </td>

                                    <td className="p-3 text-center">
                                        {allocation.class?.class_name || "-"}
                                    </td>

                                    <td className="p-3 text-center">
                                        {allocation.subjects?.length
                                            ? allocation.subjects
                                                .map(subject => subject.subject_name)
                                                .join(", ")
                                            : "-"
                                        }
                                    </td>

                                    <td className="p-3 text-center">
                                        {allocation.employee
                                            ? `${allocation.employee.first_name || ""} ${allocation.employee.last_name || ""}`.trim()
                                            : "-"
                                        }
                                    </td>

                                    <td className="p-3 text-center">
                                        {allocation.status ? (
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
                                                to={`/academic-management/teacher-allocations/show/${allocation.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                            >

                                                <FaEye />

                                            </Link>

                                            <Link
                                                to={`/academic-management/teacher-allocations/edit/${allocation.id}`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                            >

                                                <FaEdit />

                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(allocation.id)
                                                }
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