import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import employeeApi from "../../services/employeeApi";
export default function Index() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchEmployees();
    }, []);
    useEffect(() => {
        const keyword = search.toLowerCase();
        setFilteredEmployees(
            employees.filter((employee) => {
                const name = `${employee.first_name ?? ""} ${employee.middle_name ?? ""} ${employee.last_name ?? ""}`.toLowerCase();
                return (
                    (employee.employee_code ?? "").toLowerCase().includes(keyword) ||
                    name.includes(keyword) ||
                    (employee.email ?? "").toLowerCase().includes(keyword) ||
                    (employee.phone_number ?? "").toLowerCase().includes(keyword) ||
                    (employee.branch?.branch_name ?? "").toLowerCase().includes(keyword) ||
                    (employee.department?.department_name ?? "").toLowerCase().includes(keyword) ||
                    (employee.designation?.designation_name ?? "").toLowerCase().includes(keyword)
                );
            })
        );
    }, [search, employees]);
    const fetchEmployees = async () => {
        try {
            const response = await employeeApi.getAll();
            const employees = response.data.data ?? [];
            setEmployees(employees);
            setFilteredEmployees(employees);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to inactive this employee?")) {
            return;
        }
        try {
            await employeeApi.delete(id);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            alert("Unable to inactive employee.");
        }
    };
    return (
        <div className="max-w-full mx-auto px-3 py-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-[#610e1e]">
                    Employees
                </h1>
                <Link to="/configuration/employees/search" className="bg-[#610e1e] hover:bg-[#4d0b18] text-white px-4 py-2 rounded text-sm">
                    + Add Employee
                </Link>
            </div>
            {/* Search */}
            <div className="bg-white rounded-lg shadow border p-3 mb-3">
                <input
                    type="text"
                    placeholder="Search Employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#610e1e] text-white">
                        <tr>
                            <th className="px-3 py-2 text-left">Code</th>
                            <th className="px-3 py-2 text-left">Employee</th>
                            <th className="px-3 py-2 text-left">Phone</th>
                            <th className="px-3 py-2 text-left">Branch</th>
                            <th className="px-3 py-2 text-left">Department</th>
                            <th className="px-3 py-2 text-left">Designation</th>
                            <th className="px-3 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-3 py-2 font-medium">{employee.employee_code}</td>
                                    <td className="px-3 py-2">
                                        <div className="font-semibold text-gray-800">
                                            {employee.first_name}{" "}
                                            {employee.middle_name}{" "}
                                            {employee.last_name}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {employee.email || "-"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">{employee.phone_number || "-"}</td>
                                    <td className="px-3 py-2">{employee.branch?.branch_name || "-"}</td>
                                    <td className="px-3 py-2">{employee.department?.department_name || "-"}</td>
                                    <td className="px-3 py-2">{employee.designation?.designation_name || "-"}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-center gap-1">
                                            <Link
                                                to={`/configuration/employees/${employee.id}`}
                                                className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/configuration/employees/${employee.id}/edit`}
                                                className="px-2 py-1 text-sm rounded bg-amber-500 text-white hover:bg-amber-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
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