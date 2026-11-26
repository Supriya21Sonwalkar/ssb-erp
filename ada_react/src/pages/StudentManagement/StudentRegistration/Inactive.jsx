import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import studentApi from "../../../services/studentApi";

export default function Inactive() {

    const [students, setStudents] = useState([]);

    const [filteredStudents, setFilteredStudents] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadInactiveStudents();

    }, []);

    useEffect(() => {

        const keyword = search.toLowerCase();

        setFilteredStudents(

            students.filter(student =>

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

    const loadInactiveStudents = async () => {

        try {

            const response = await studentApi.getInactive();

            const data = response.data.data ?? [];

            setStudents(data);

            setFilteredStudents(data);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load inactive students.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleRestore = async (id) => {

        if (!window.confirm("Restore this student?")) {

            return;

        }

        try {

            await studentApi.restore(id);

            loadInactiveStudents();

        }

        catch (error) {

            console.error(error);

            alert("Unable to restore student.");

        }

    };

    return (

        <div className="max-w-full mx-auto px-3 py-2">

            {/* Header */}

            <div className="flex justify-between items-center mb-4">

                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">

                        Inactive Students

                    </h1>

                    <p className="text-gray-500">

                        Restore previously deactivated students

                    </p>

                </div>

                <Link

                    to="/student-management/students"

                    className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded"

                >

                    Back

                </Link>

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

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-[#610e1e] text-white">

                        <tr>

                            <th className="px-3 py-3 text-left">
                                Admission No
                            </th>

                            <th className="px-3 py-3 text-left">
                                Student
                            </th>

                            <th className="px-3 py-3 text-left">
                                Class
                            </th>

                            <th className="px-3 py-3 text-left">
                                Section
                            </th>

                            <th className="px-3 py-3 text-center">
                                Restore
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-8"
                                >

                                    Loading...

                                </td>

                            </tr>

                        ) : filteredStudents.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-8"
                                >

                                    No Inactive Students Found.

                                </td>

                            </tr>

                        ) : (

                            filteredStudents.map(student => (

                                <tr

                                    key={student.id}

                                    className="border-b hover:bg-gray-50"

                                >

                                    <td className="px-3 py-3">

                                        {student.admission_no}

                                    </td>

                                    <td className="px-3 py-3">

                                        {student.full_name}

                                    </td>

                                    <td className="px-3 py-3">

                                        {student.class?.class_name}

                                    </td>

                                    <td className="px-3 py-3">

                                        {student.section?.section_name}

                                    </td>

                                    <td className="px-3 py-3 text-center">

                                        <button

                                            onClick={() => handleRestore(student.id)}

                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"

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