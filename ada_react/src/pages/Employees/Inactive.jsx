import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import employeeApi from "../../services/employeeApi";

export default function Inactive() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInactiveEmployees();
    }, []);

    const fetchInactiveEmployees = async () => {

        try {

            const response = await employeeApi.getInactive();

            setEmployees(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRestore = async (id) => {

        if (!window.confirm("Restore this employee?")) {
            return;
        }

        try {

            await employeeApi.restore(id);

            fetchInactiveEmployees();

        } catch (error) {

            console.error(error);

            alert("Unable to restore employee.");

        }

    };

    if (loading) {

        return (
            <div className="text-center py-10">
                Loading...
            </div>
        );

    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-[#610e1e]">
                        Inactive Employees
                    </h1>

                    <p className="text-gray-500 mt-1">
                        List of inactive employees
                    </p>

                </div>

                <Link
                    to="/configuration/employees"
                    className="bg-[#610e1e] text-white px-5 py-2 rounded-lg hover:bg-[#4d0b18]"
                >
                    Back
                </Link>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="min-w-full">

                    <thead className="bg-[#610e1e] text-white">

                        <tr>

                            <th className="px-4 py-3 text-left">
                                Employee Code
                            </th>

                            <th className="px-4 py-3 text-left">
                                Name
                            </th>

                            <th className="px-4 py-3 text-left">
                                Department
                            </th>

                            <th className="px-4 py-3 text-left">
                                Designation
                            </th>

                            <th className="px-4 py-3 text-left">
                                Mobile
                            </th>

                            <th className="px-4 py-3 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {employees.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No inactive employees found.
                                </td>

                            </tr>

                        ) : (

                            employees.map((employee) => (

                                <tr
                                    key={employee.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3">
                                        {employee.employee_code}
                                    </td>

                                    <td className="px-4 py-3">
                                        {employee.first_name} {employee.last_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {employee.department_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {employee.designation_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {employee.mobile}
                                    </td>

                                    <td className="px-4 py-3 text-center">

                                        <button
                                            onClick={() => handleRestore(employee.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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