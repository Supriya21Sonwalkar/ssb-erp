import { useEffect, useState } from "react";

import {
    getInactiveAttendance,
    restoreAttendance,
} from "../../../services/dailyAttendanceApi";

export default function Inactive() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [attendanceSessions, setAttendanceSessions] = useState([]);


        /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchInactiveAttendance();

    }, []);

    const fetchInactiveAttendance = async () => {

        try {

            setLoading(true);

            const response = await getInactiveAttendance();

            // Handle paginated response structure
            const data = response.data?.data?.data ?? response.data?.data ?? [];
            setAttendanceSessions(Array.isArray(data) ? data : []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

        /*
    |--------------------------------------------------------------------------
    | Restore Attendance
    |--------------------------------------------------------------------------
    */

    const handleRestore = async (id) => {

        if (!window.confirm("Restore this attendance session?")) {

            return;

        }

        try {

            setLoading(true);

            await restoreAttendance(id);

            fetchInactiveAttendance();

        }

        catch (error) {

            console.error(error);

            alert("Unable to restore attendance.");

        }

        finally {

            setLoading(false);

        }

    };

        return (

        <div className="space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

                <h1 className="text-2xl font-bold text-[#610e1e]">

                    Inactive Attendance Sessions

                </h1>

                <p className="text-gray-500 mt-1">

                    Restore previously deactivated attendance.

                </p>

            </div>

            {/* Table */}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-[#610e1e] text-white">

                            <tr>

                                <th className="px-4 py-3 text-left">

                                    Attendance Date

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Academic Year

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Class

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Section

                                </th>

                                <th className="px-4 py-3 text-center">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                attendanceSessions.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center py-6 text-gray-500"
                                        >

                                            No inactive attendance found.

                                        </td>

                                    </tr>

                                ) : (

                                    attendanceSessions.map((session) => (

                                        <tr
                                            key={session.id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-3">

                                                {session.attendance_date}

                                            </td>

                                            <td className="px-4 py-3">

                                                {session.academic_year?.name}

                                            </td>

                                            <td className="px-4 py-3">

                                                {session.class?.class_name}

                                            </td>

                                            <td className="px-4 py-3">

                                                {session.section?.section_name}

                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                <button

                                                    onClick={() =>
                                                        handleRestore(session.id)
                                                    }

                                                    className="
                                                        bg-green-600
                                                        hover:bg-green-700
                                                        text-white
                                                        px-4
                                                        py-2
                                                        rounded-lg
                                                    "

                                                >

                                                    Restore

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}