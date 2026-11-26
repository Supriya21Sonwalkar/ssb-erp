import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaReceipt,
} from "react-icons/fa";

import feePaymentApi from "../../../services/feePaymentApi";
import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";


export default function FeesCollectionIndex() {

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [academicYearFilter, setAcademicYearFilter] = useState("");

    const [classFilter, setClassFilter] = useState("");

    const [academicYears, setAcademicYears] = useState([]);

    const [classes, setClasses] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Load Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadPayments();
        loadAcademicYears();
        loadClasses();

    }, []);


    useEffect(() => {

        loadPayments();

    }, [academicYearFilter, classFilter]);


    /*
    |--------------------------------------------------------------------------
    | Load Payments
    |--------------------------------------------------------------------------
    */

    const loadPayments = async () => {

        try {

            setLoading(true);

            const params = {};

            if (academicYearFilter) {
                params.academic_year_id = academicYearFilter;
            }

            if (classFilter) {
                params.class_id = classFilter;
            }

            const response = await feePaymentApi.getAll(params);

            console.log("Payments Response:", response);

            const data = response?.data?.data ?? response?.data ?? [];

            setPayments(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Payments Error:", error);
            console.error("Backend:", error.response?.data);
            setPayments([]);

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Academic Years
    |--------------------------------------------------------------------------
    */

    const loadAcademicYears = async () => {

        try {

            const response = await academicYearApi.getAll();

            const data = response?.data?.data ?? response?.data ?? [];

            setAcademicYears(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Academic Years Error:", error);
            setAcademicYears([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Load Classes
    |--------------------------------------------------------------------------
    */

    const loadClasses = async () => {

        try {

            const response = await classApi.getAll();

            const data = response?.data?.data ?? response?.data ?? [];

            setClasses(Array.isArray(data) ? data : []);

        }
        catch (error) {

            console.error("Classes Error:", error);
            setClasses([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Filter Payments
    |--------------------------------------------------------------------------
    */

    const filteredPayments = payments.filter((payment) => {

        const searchText = search.toLowerCase().trim();

        if (!searchText) {

            return true;

        }

        const studentName = (
            payment.student?.full_name ||
            payment.student?.first_name + " " + payment.student?.last_name ||
            ""
        ).toLowerCase();

        const admissionNo = (
            payment.student?.admission_no ||
            ""
        ).toLowerCase();

        const receiptNo = (
            payment.receipt_no ||
            payment.transaction_reference ||
            ""
        ).toLowerCase();

        return (
            studentName.includes(searchText) ||
            admissionNo.includes(searchText) ||
            receiptNo.includes(searchText)
        );

    });


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });

    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (dateString) => {

        if (!dateString) return "-";

        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };


    /*
    |--------------------------------------------------------------------------
    | Get Academic Year Name
    |--------------------------------------------------------------------------
    */

    const getAcademicYearName = (payment) => {

        const id = payment?.student?.academic_year_id;

        if (!id) return "-";

        const year = academicYears.find(
            (item) => Number(item.id) === Number(id)
        );

        return year?.name || year?.title || year?.academic_year || "-";

    };


    /*
    |--------------------------------------------------------------------------
    | Get Class Name
    |--------------------------------------------------------------------------
    */

    const getClassName = (id) => {

        const classItem = classes.find(
            (item) => Number(item.id) === Number(id)
        );

        return classItem?.name || classItem?.class_name || classItem?.title || "-";

    };


    /*
    |--------------------------------------------------------------------------
    | Get Student Name
    |--------------------------------------------------------------------------
    */

    const getStudentName = (student) => {

        if (!student) return "-";

        return (
            student.full_name ||
            [student.first_name, student.middle_name, student.last_name]
                .filter(Boolean)
                .join(" ") ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="min-h-[400px] flex items-center justify-center">

                <div className="text-center">

                    <div className="
                        w-12 h-12 border-4 border-[#610e1e] border-t-transparent rounded-full animate-spin mx-auto
                    " />

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading fee payments...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="space-y-6">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                    <div className="
                        w-12 h-12 rounded-xl bg-[#610e1e] flex items-center justify-center shadow-md
                    ">

                        <FaReceipt className="text-[#FFD963] text-xl" />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-[#610e1e]">
                            Fees Collection
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            View and manage fee payment records
                        </p>

                    </div>

                </div>


                {/* Collect Fee Button */}

                <Link
                    to="/fees/collection/create"
                    className="
                        inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#610e1e] text-white rounded-lg font-semibold
                        hover:bg-[#4d0b18] transition shadow-sm
                    "
                >

                    <FaPlus />

                    Collect Fee

                </Link>

            </div>


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Search */}

                    <div className="relative">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by student name, admission no, receipt..."
                            className="
                                w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                            "
                        />

                    </div>


                    {/* Academic Year Filter */}

                    <div>

                        <select
                            value={academicYearFilter}
                            onChange={(e) => setAcademicYearFilter(e.target.value)}
                            className="
                                w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
                                focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                            "
                        >

                            <option value="">All Academic Years</option>

                            {academicYears.map((year) => (

                                <option key={year.id} value={year.id}>
                                    {year.name || year.title || year.academic_year}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Class Filter */}

                    <div>

                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="
                                w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
                                focus:outline-none focus:ring-2 focus:ring-[#610e1e]/20 focus:border-[#610e1e]
                            "
                        >

                            <option value="">All Classes</option>

                            {classes.map((classItem) => (

                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.name || classItem.class_name || classItem.title}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>


                <p className="mt-3 text-sm text-gray-500">

                    Found <span className="font-semibold text-gray-800">{filteredPayments.length}</span> payment(s)

                </p>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Receipt No
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Student
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Class
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Academic Year
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Payment Date
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">
                                    Amount
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                                    Mode
                                </th>


                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {filteredPayments.length === 0 ? (

                                <tr>

                                    <td colSpan="8" className="px-6 py-14 text-center">

                                        <div className="flex flex-col items-center">

                                            <div className="
                                                w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3
                                            ">

                                                <FaReceipt className="text-gray-400 text-xl" />

                                            </div>

                                            <p className="font-semibold text-gray-700">
                                                No fee payments found
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Start collecting fees to see records here.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredPayments.map((payment, index) => (

                                    <tr key={payment.id} className="hover:bg-gray-50 transition">

                                        {/* # */}

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {index + 1}
                                        </td>


                                        {/* Receipt No */}

                                        <td className="px-6 py-4">

                                            <span className="font-semibold text-gray-800">
                                                {payment.receipt_no || payment.transaction_reference || "-"}
                                            </span>

                                        </td>


                                        {/* Student */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="
                                                    w-10 h-10 rounded-full bg-[#610e1e] flex items-center justify-center text-white font-semibold
                                                ">

                                                    {payment.student?.first_name?.charAt(0) || "S"}

                                                </div>

                                                <div>

                                                    <p className="font-semibold text-gray-800">
                                                        {getStudentName(payment.student)}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {payment.student?.admission_no || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Class */}

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {getClassName(payment.student?.class_id)}
                                        </td>


                                        {/* Academic Year */}

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {getAcademicYearName(payment)}
                                        </td>


                                        {/* Payment Date */}

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatDate(payment.payment_date)}
                                        </td>


                                        {/* Amount */}

                                        <td className="px-6 py-4 text-right">

                                            <span className="font-bold text-[#610e1e]">
                                                {formatAmount(payment.amount)}
                                            </span>

                                        </td>


                                        {/* Mode */}

                                        <td className="px-6 py-4">

                                            <span className="
                                                inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold
                                            ">

                                                {payment.payment_mode || "Cash"}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}
