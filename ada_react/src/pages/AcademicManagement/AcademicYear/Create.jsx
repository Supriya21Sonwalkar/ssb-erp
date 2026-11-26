import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import academicYearApi from "../../../services/academicYearApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Create() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        academic_year: "",
        start_date: "",
        end_date: "",
        is_current: 0,
        created_by: 1,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setErrors({});

            await academicYearApi.create(formData);

            navigate("/academic-management/academic-year");

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
         
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">

                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Create Academic Year</h1>
                            <p className="text-slate-500 mt-1">Add a new academic year to the system</p>
                        </div>

                        <Link
                            to="/academic-management/academic-year"
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg shadow-slate-500/30 hover:shadow-slate-500/40"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back
                        </Link>

                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                        <div className="p-8">

                            <form onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Academic Year
                                        </label>

                                        <input
                                            type="text"
                                            name="academic_year"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            placeholder="e.g., 2024-2025"
                                            value={formData.academic_year}
                                            onChange={handleChange}
                                        />

                                        {errors.academic_year && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.academic_year[0]}
                                            </p>
                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            name="start_date"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                        />

                                        {errors.start_date && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.start_date[0]}
                                            </p>
                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="end_date"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                        />

                                        {errors.end_date && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.end_date[0]}
                                            </p>
                                        )}

                                    </div>

                                    <div className="flex items-center">

                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            id="is_current"
                                            name="is_current"
                                            checked={formData.is_current === 1}
                                            onChange={handleChange}
                                        />

                                        <label
                                            className="ml-3 text-sm font-medium text-slate-700"
                                            htmlFor="is_current"
                                        >
                                            Set as Current Academic Year
                                        </label>

                                    </div>

                                </div>

                                <div className="mt-8 flex justify-end gap-4">

                                    <Link
                                        to="/academic-management/academic-year"
                                        className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Save Academic Year
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>
          
    );
}