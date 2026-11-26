import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import classSubjectApi from "../../../services/classSubjectApi";

export default function Show() {

    const { id } = useParams();

    const [record, setRecord] = useState(null);

    useEffect(() => {

        fetchRecord();

    }, []);

    const fetchRecord = async () => {

        try {

            const response = await classSubjectApi.get(id);

            setRecord(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    if (!record) {

        return (

             

                <div className="p-6">

                    Loading...

                </div>

              

        );

    }

    return (

         

            <div className="max-w-6xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow">

                    <div className="border-b p-6 flex justify-between items-center">

                        <div>

                            <h2 className="text-2xl font-bold text-[#610e1e]">

                                Class Subject Details

                            </h2>

                            <p className="text-gray-500 mt-1">

                                View mapped subjects

                            </p>

                        </div>

                        <Link
                            to="/academic-management/class-subjects"
                            className="px-4 py-2 bg-[#610e1e] text-white rounded-lg"
                        >
                            Back
                        </Link>

                    </div>

                    <div className="p-6">

                        <div className="mb-8">

                            <label className="block font-semibold mb-2">

                                Class

                            </label>

                            <input
                                type="text"
                                value={record.class_name}
                                disabled
                                className="w-full border rounded-lg p-3 bg-gray-100"
                            />

                        </div>

                        <div>

                            <label className="block font-semibold mb-4">

                                Assigned Subjects

                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                                {record.class_subjects.length === 0 ? (

                                    <div className="col-span-full text-center text-gray-500">

                                        No Subjects Assigned

                                    </div>

                                ) : (

                                    record.class_subjects.map((item) => (

                                        <div
                                            key={item.id}
                                            className="border rounded-lg p-4 bg-gray-50"
                                        >

                                            <div className="font-semibold">

                                                {item.subject.subject_name}

                                            </div>

                                            <div className="text-sm text-gray-500 mt-2">

                                                Code : {item.subject.subject_code}

                                            </div>

                                            <div className="mt-3">

                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">

                                                    {item.is_compulsory
                                                        ? "Compulsory"
                                                        : "Optional"}

                                                </span>

                                            </div>

                                        </div>

                                    ))

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

          

    );

}