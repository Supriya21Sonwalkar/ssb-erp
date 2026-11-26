import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import classApi from "../../../services/classApi";
// import academicYearApi from "../../../services/academicYearApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Create() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // academic_year_id: "",
        class_name: "",
        class_code: "",
        display_order: "",
        created_by: 1,
    });

    // const [academicYears, setAcademicYears] = useState([]);
    const [errors, setErrors] = useState({});

//     useEffect(() => {
//         fetchAcademicYears();
//     }, []);

// const fetchAcademicYears = async () => {
//     try {
//         const response = await academicYearApi.getAll();

//         console.log("Academic Year Response:", response);

//         setAcademicYears(response.data?.data ?? response.data ?? []);
//     } catch (error) {
//         console.log("Academic Year Error:", error);
//     }
// };


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
            await classApi.create(formData);
            navigate("/academic-management/classes");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || {});
                if (error.response.data.message && !error.response.data.errors) {
                    alert(error.response.data.message);
                }
            } else {
                console.log(error);
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
                alert(errorMessage);
            }
        }
    };

    return (
         
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">

                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Create Class</h1>
                            <p className="text-slate-500 mt-1">Add a new class to the system</p>
                        </div>

                        <Link
                            to="/academic-management/classes"
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg shadow-slate-500/30 hover:shadow-slate-500/50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back
                        </Link>

                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">

                        <div className="p-8">

                            <form onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Academic Year
                                        </label>

                                        <select
                                            name="academic_year_id"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            value={formData.academic_year_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Academic Year</option>
                                            {academicYears.map((year) => (
                                                <option key={year.id} value={year.id}>
                                                    {year.academic_year}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.academic_year_id && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.academic_year_id[0]}
                                            </p>
                                        )}

                                    </div> */}

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Class Name
                                        </label>

                                        <input
                                            type="text"
                                            name="class_name"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., Grade 10"
                                            value={formData.class_name}
                                            onChange={handleChange}
                                        />

                                        {errors.class_name && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.class_name[0]}
                                            </p>
                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Class Code
                                        </label>

                                        <input
                                            type="text"
                                            name="class_code"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., G10"
                                            value={formData.class_code}
                                            onChange={handleChange}
                                        />

                                        {errors.class_code && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.class_code[0]}
                                            </p>
                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Display Order
                                        </label>

                                        <input
                                            type="number"
                                            name="display_order"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., 1"
                                            value={formData.display_order}
                                            onChange={handleChange}
                                        />

                                        {errors.display_order && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.display_order[0]}
                                            </p>
                                        )}

                                    </div>

                                </div>

                                <div className="mt-8 flex justify-end gap-4">

                                    <Link
                                        to="/academic-management/classes"
                                        className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Save Class
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>
          
    );
}
