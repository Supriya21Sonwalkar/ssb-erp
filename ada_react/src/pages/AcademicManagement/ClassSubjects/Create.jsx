import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";

import classApi from "../../../services/classApi";
import subjectApi from "../../../services/subjectApi";
import classSubjectApi from "../../../services/classSubjectApi";

export default function Create() {

    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [form, setForm] = useState({
        class_id: "",
        subject_ids: [],
    });

    useEffect(() => {

        fetchData();

    }, []);

        const fetchData = async () => {

            try {

                const classRes = await classApi.getAll();
                const subjectRes = await subjectApi.getAll();

                setClasses(classRes.data.data || []);
                setSubjects(subjectRes.data || []);

            } catch (error) {

                console.log(error);

            }

        };

    const handleCheckbox = (id) => {

        if (form.subject_ids.includes(id)) {

            setForm({

                ...form,

                subject_ids: form.subject_ids.filter(item => item !== id)

            });

        } else {

            setForm({

                ...form,

                subject_ids: [...form.subject_ids, id]

            });

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await classSubjectApi.create(form);

            navigate("/academic-management/class-subjects");

        } catch (error) {

            console.log(error);

            alert("Unable to save.");

        }

    };

    return (

         

            <div className="max-w-6xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow">

                    <div className="p-6 border-b">

                        <h2 className="text-2xl font-bold text-[#610e1e]">

                            Assign Subjects To Class

                        </h2>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="p-6">

                            <div className="mb-6">

                                <label className="font-semibold">

                                    Select Class

                                </label>

                                <select

                                    className="w-full border rounded-lg mt-2 p-3"

                                    value={form.class_id}

                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            class_id: e.target.value
                                        })
                                    }

                                >

                                    <option value="">

                                        Select Class

                                    </option>

                                    {Array.isArray(classes) &&
                                    classes.map(item => (

                                        <option

                                            key={item.id}

                                            value={item.id}

                                        >

                                            {item.class_name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div>

                                <label className="font-semibold">

                                    Select Subjects

                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">

                                    {Array.isArray(subjects) &&
        subjects.map(subject => (

                                        <label

                                            key={subject.id}

                                            className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"

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

                                className="px-5 py-2 rounded-lg border"

                            >

                                Cancel

                            </button>

                            <button

                                type="submit"

                                className="bg-[#610e1e] text-white px-6 py-2 rounded-lg hover:bg-[#4c0b17]"

                            >

                                Save

                            </button>

                        </div>

                    </form>

                </div>

            </div>

          

    );

}