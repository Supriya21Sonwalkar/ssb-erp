import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import teacherAllocationApi from "../../../services/teacherAllocationApi";
import TeacherAllocationTable from "../../../components/TeacherAllocation/TeacherAllocationTable";

export default function Inactive() {

    const [allocations, setAllocations] = useState([]);
    const [filteredAllocations, setFilteredAllocations] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchInactiveAllocations();

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

                allocation.employee?.last_name
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                allocation.academicYear?.year_name
                    ?.toLowerCase()
                    .includes(keyword)

            )

        );

    }, [search, allocations]);

    const fetchInactiveAllocations = async () => {

        try {

            const response =
                await teacherAllocationApi.inactive();

            const data = response.data.data ?? [];

            setAllocations(data);

            setFilteredAllocations(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRestore = async (id) => {

        if (
            !window.confirm(
                "Restore this Teacher Allocation?"
            )
        ) {
            return;
        }

        try {

            await teacherAllocationApi.restore(id);

            fetchInactiveAllocations();

        } catch (error) {

            console.error(error);

            alert("Unable to restore.");

        }

    };

    return (

        <div className="max-w-full mx-auto px-4 py-4">

            {/* Header */}

            <div className="flex justify-between items-center mb-5">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">

                        Inactive Teacher Allocations

                    </h1>

                    <p className="text-gray-500 mt-1">

                        Restore inactive allocations.

                    </p>

                </div>

                <Link
                    to="/academic-management/teacher-allocations"
                    className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded-lg"
                >

                    Back

                </Link>

            </div>

            {/* Search */}

            <div className="bg-white rounded-xl shadow border p-4 mb-4">

                <input

                    type="text"

                    placeholder="Search..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    className="w-full border rounded-lg px-4 py-2"

                />

            </div>

            <TeacherAllocationTable

                allocations={filteredAllocations}

                loading={loading}

                inactive={true}

                onRestore={handleRestore}

            />

        </div>

    );

}