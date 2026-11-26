import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import studentApi from "../../../services/studentApi";

import StudentTable from "../../../components/Students/StudentTable";

export default function Index() {

    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadStudents();

    }, []);

    useEffect(() => {

        const keyword = search.toLowerCase();

        setFilteredStudents(

            students.filter((student) =>

                (student.student_code ?? "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (student.admission_no ?? "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (student.full_name ?? "")
                    .toLowerCase()
                    .includes(keyword)

            )

        );

    }, [search, students]);

    const loadStudents = async () => {

        try {

            const response = await studentApi.getAll();

            setStudents(response.data.data ?? []);

            setFilteredStudents(response.data.data ?? []);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load students.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Move student to inactive?")) {

            return;

        }

        try {

            await studentApi.delete(id);

            loadStudents();

        }

        catch (error) {

            console.error(error);

            alert("Unable to inactive student.");

        }

    };

    return (

        <div className="max-w-full mx-auto px-3 py-2">

            {/* Header */}

            <div className="flex justify-between items-center mb-4">

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">

                        Student Registration

                    </h1>

                    <p className="text-gray-500">

                        Manage Students

                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        to="/student-management/students/inactive"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                        Inactive
                    </Link>

                    <Link
                        to="/student-management/students/create"
                        className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded"
                    >
                        + Register Student
                    </Link>

                </div>

            </div>

            {/* Search */}

            <div className="bg-white rounded-lg shadow border p-3 mb-4">

                <input

                    type="text"

                    placeholder="Search Student..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className="w-full border rounded px-3 py-2"

                />

            </div>

            {/* Table */}

            <StudentTable

                students={filteredStudents}

                loading={loading}

                onDelete={handleDelete}

            />

        </div>

    );

}