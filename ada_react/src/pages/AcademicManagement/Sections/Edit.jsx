import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import sectionApi from "../../../services/sectionApi";
import classApi from "../../../services/classApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Edit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        class_id: "",
        section_name: "",
        room_number: "",
        capacity: "",
        updated_by: 1,
    });

    const [classes, setClasses] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSection();
        fetchClasses();
    }, []);

    const fetchSection = async () => {

        try {

            const response = await sectionApi.getById(id);

            const data = response.data.data;

            setFormData({
                class_id: data.class_id,
                section_name: data.section_name,
                room_number: data.room_number,
                capacity: data.capacity,
            });

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const fetchClasses = async () => {

        try {

            const response = await classApi.getAll();

            setClasses(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setErrors({});

            await sectionApi.update(id, formData);

            navigate("/academic-management/sections");

        } catch (error) {

            if (error.response && error.response.status === 422) {

                setErrors(error.response.data.errors || {});

                if (error.response.data.message && !error.response.data.errors) {
                    alert(error.response.data.message);
                }

            } else {

                console.log(error);

                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong.";

                alert(errorMessage);

            }

        }

    };

    if (loading) {

        return (

             

                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">

                    <div className="max-w-6xl mx-auto">

                        <div className="text-center py-12">

                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>

                            <p className="mt-4 text-slate-500">
                                Loading...
                            </p>

                        </div>

                    </div>

                </div>

              

        );

    }

    return (

         

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">

                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-8">

                        <div>

                            <h1 className="text-3xl font-bold text-slate-800">
                                Edit Section
                            </h1>

                            <p className="text-slate-500 mt-1">
                                Update section information
                            </p>

                        </div>

                        <Link
                            to="/academic-management/sections"
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg shadow-slate-500/30 hover:shadow-slate-500/50"
                        >

                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>

                            Back

                        </Link>

                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">

                        <div className="p-8">

                            <form onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Class
                                        </label>

                                        <select
                                            name="class_id"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            value={formData.class_id}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select Class
                                            </option>

                                            {classes.map((item) => (

                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.class_name}
                                                </option>

                                            ))}

                                        </select>

                                        {errors?.class_id && (

                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.class_id[0]}
                                            </p>

                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Section Name
                                        </label>

                                        <input
                                            type="text"
                                            name="section_name"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., A"
                                            value={formData.section_name}
                                            onChange={handleChange}
                                        />

                                        {errors?.section_name && (

                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.section_name[0]}
                                            </p>

                                        )}

                                    </div>
                                                                        <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Room Number
                                        </label>

                                        <input
                                            type="text"
                                            name="room_number"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., 101"
                                            value={formData.room_number}
                                            onChange={handleChange}
                                        />

                                        {errors?.room_number && (

                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.room_number[0]}
                                            </p>

                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Capacity
                                        </label>

                                        <input
                                            type="number"
                                            name="capacity"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., 40"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                        />

                                        {errors?.capacity && (

                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.capacity[0]}
                                            </p>

                                        )}

                                    </div>

                                </div>

                                <div className="mt-8 flex justify-end gap-4">

                                    <Link
                                        to="/academic-management/sections"
                                        className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                                    >

                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>

                                        Update Section

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

          

    );

}