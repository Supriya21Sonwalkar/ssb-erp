import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import subjectApi from "../../../services/subjectApi";
import classSubjectApi from "../../../services/classSubjectApi";

export default function Edit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);

    const [form, setForm] = useState({

        class_id: "",

        subject_ids: []

    });

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const response = await classSubjectApi.edit(id);

            setSubjects(response.data.subjects);

            const mappedSubjects = response.data.class.class_subjects.map(item => item.subject_id);

            setForm({

                class_id: response.data.class.id,

                subject_ids: mappedSubjects

            });

        } catch (error) {

            console.log(error);

        }

    };

    const handleCheckbox = (subjectId) => {

        if (form.subject_ids.includes(subjectId)) {

            setForm({

                ...form,

                subject_ids: form.subject_ids.filter(id => id !== subjectId)

            });

        } else {

            setForm({

                ...form,

                subject_ids: [...form.subject_ids, subjectId]

            });

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await classSubjectApi.update(id, {

                subject_ids: form.subject_ids

            });

            navigate("/academic-management/class-subjects");

        } catch (error) {

            console.log(error);

            alert("Unable to update.");

        }

    };

    return (

         

            <div className="max-w-6xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow">

                    <div className="border-b p-6">

                        <h2 className="text-2xl font-bold text-[#610e1e]">

                            Edit Class Subject Mapping

                        </h2>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="p-6">

                            <div className="mb-6">

                                <label className="font-semibold">

                                    Class

                                </label>

                                <input

                                    type="text"

                                    value={form.class_id}

                                    disabled

                                    className="w-full border rounded-lg p-3 mt-2 bg-gray-100"

                                />

                            </div>

                            <div>

                                <label className="font-semibold">

                                    Subjects

                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">

                                    {subjects.map(subject => (

                                        <label

                                            key={subject.id}

                                            className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"

                                        >

                                            <input

                                                type="checkbox"

                                                checked={form.subject_ids.includes(subject.id)}

                                                onChange={() => handleCheckbox(subject.id)}

                                            />

                                            {subject.subject_name}

                                        </label>

                                    ))}

                                </div>

                            </div>

                        </div>

                        <div className="border-t p-6 flex justify-end gap-3">

                            <button

                                type="button"

                                onClick={() => navigate("/academic-management/class-subjects")}

                                className="border px-5 py-2 rounded-lg"

                            >

                                Cancel

                            </button>

                            <button

                                type="submit"

                                className="bg-[#610e1e] text-white px-6 py-2 rounded-lg"

                            >

                                Update

                            </button>

                        </div>

                    </form>

                </div>

            </div>

          

    );

}