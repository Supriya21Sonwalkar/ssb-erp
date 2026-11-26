import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classApi from "../../../services/classApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function Index() {

    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {

        const filtered = classes.filter((item) =>
            item.class_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            item.class_code
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredClasses(filtered);

    }, [search, classes]);

    const fetchClasses = async () => {

        try {

            const response = await classApi.getAll();

            setClasses(response.data.data);
            setFilteredClasses(response.data.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    const handleInactive = async (id) => {

        if (!window.confirm("Move this Class to Inactive?")) return;

        try {

            await classApi.delete(id);

            fetchClasses();

        } catch (error) {

            console.log(error);

        }
    };

    return (
         
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">

                <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Class Management</h1>
                        <p className="text-slate-500 mt-1">Manage and organize classes</p>
                    </div>

                <Link
                    to="/academic-management/classes/create"
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 text-sm"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Class
                </Link>

            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden mb-6">

                <div className="px-6 py-4 border-b border-slate-100">

                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">

                        <div className="w-full sm:w-1/3 relative">

                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>

                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-sm"
                                placeholder="Search Class..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                            <Link
                                to="/academic-management/classes/inactive"
                                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md shadow-amber-500/30 text-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                </svg>
                                Inactive Records
                            </Link>

                        </div>

                    </div>

                </div>

                <div className="p-6">

                    {loading ? (

                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                            <p className="mt-4 text-slate-500">Loading...</p>
                        </div>

                    ) : filteredClasses.length === 0 ? (

                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-slate-500">No Record Found</p>
                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {filteredClasses.map((item, index) => (

                                <div key={item.id} className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden">

                                    <div className="p-6">

                                        <div className="flex items-start justify-between mb-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                    </svg>
                                                </div>

                                                <div>

                                                    <h3 className="text-lg font-bold text-slate-800">{item.class_name}</h3>

                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 mt-1">
                                                        {item.class_code}
                                                    </span>

                                                </div>

                                            </div>

                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>

                                        </div>

                                        {/* <div className="space-y-3 mb-6">

                                            <div className="flex items-center gap-2 text-sm text-slate-600">

                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>

                                                <span className="font-medium">Academic Year:</span>
                                                <span>{item.academic_year?.academic_year || 'N/A'}</span>

                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-slate-600">

                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                                </svg>

                                                <span className="font-medium">Display Order:</span>
                                                <span>{item.display_order || 'N/A'}</span>

                                            </div>

                                        </div> */}

                                        <div className="flex gap-2 pt-4 border-t border-slate-100">

                                            <Link
                                                to={`/academic-management/classes/show/${item.id}`}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                                View
                                            </Link>

                                            <Link
                                                to={`/academic-management/classes/edit/${item.id}`}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                Edit
                                            </Link>

                                            <button
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                                                onClick={() => handleInactive(item.id)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Inactive
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
          
    );
}
