import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import employeeApi from "../../services/employeeApi";
import EmployeeView from "../../components/employees/EmployeeView";

export default function Show() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {

        loadEmployee();

    }, [id]);

    const loadEmployee = async () => {

        try {

            setLoading(true);

            const response = await employeeApi.getById(id);

            setEmployee(response.data.employee);

        } catch (error) {

            console.error(error);

            alert("Employee not found.");

            navigate("/employees");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="max-w-7xl mx-auto p-4">

                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="text-lg font-semibold text-gray-600">
                        Loading Employee...
                    </div>

                </div>

            </div>

        );

    }

    if (!employee) {

        return (

            <div className="max-w-7xl mx-auto p-4">

                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="text-lg font-semibold text-red-600">
                        Employee not found.
                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto p-4">

            <EmployeeView
                employee={employee}
            />

        </div>

    );

}