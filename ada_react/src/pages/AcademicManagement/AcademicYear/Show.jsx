import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import academicYearApi from "../../../services/academicYearApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Show() {

    const { id } = useParams();

    const [academicYear, setAcademicYear] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAcademicYear();
    }, []);

    const fetchAcademicYear = async () => {

        try {

            const response = await academicYearApi.getById(id);

            setAcademicYear(response.data?.data ?? response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
             
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading...</p>
                        </div>
                    </div>
                </div>
              
        );

    }

    return (
         
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">

                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">View Academic Year</h1>
                            <p className="text-slate-500 mt-1">Academic year details and information</p>
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

                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-5 border-b border-slate-200">

                            <h2 className="text-xl font-semibold text-white">Academic Year Details</h2>

                        </div>

                        <div className="p-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Academic Year</h3>

                                    <p className="text-lg font-semibold text-slate-800">{academicYear.academic_year}</p>

                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Start Date</h3>

                                    <p className="text-lg font-semibold text-slate-800">{academicYear.start_date}</p>

                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">End Date</h3>

                                    <p className="text-lg font-semibold text-slate-800">{academicYear.end_date}</p>

                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Academic Year</h3>

                                    {academicYear.is_current ? (

                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">

                                            Yes

                                        </span>

                                    ) : (

                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">

                                            No

                                        </span>

                                    )}

                                </div>

                                {/* <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</h3>

                                    {academicYear.status ? (

                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">

                                            Active

                                        </span>

                                    ) : (

                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                                            Inactive

                                        </span>

                                    )}

                                </div> */}

                            </div>

                            <div className="mt-6 flex justify-end gap-4">

                                <Link
                                    to={`/academic-management/academic-year/edit/${academicYear.id}`}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md shadow-amber-500/30"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Edit
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
          
    );

}