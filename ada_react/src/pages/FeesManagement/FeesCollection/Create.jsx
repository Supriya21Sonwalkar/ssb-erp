import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSearch,
    FaUserGraduate,
    FaMoneyBillWave,
    FaReceipt,
    FaCalendarAlt,
    FaSpinner,
    FaTimes,
} from "react-icons/fa";

import feePaymentApi from "../../../services/feePaymentApi";

import academicYearApi from "../../../services/academicYearApi";
import classApi from "../../../services/classApi";
import sectionApi from "../../../services/sectionApi";


export default function FeesCollectionCreate() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const searchRef = useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Academic Years
    |--------------------------------------------------------------------------
    */

    const [academicYears, setAcademicYears] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Classes
    |--------------------------------------------------------------------------
    */

    const [classes, setClasses] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    const [sections, setSections] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Student Search
    |--------------------------------------------------------------------------
    */

    const [academicYearId, setAcademicYearId] =
        useState(
            searchParams.get(
                "academic_year_id"
            ) || ""
        );


    const [search, setSearch] =
        useState("");


    const [students, setStudents] =
        useState([]);


    const [showSuggestions, setShowSuggestions] =
        useState(false);


    const [loadingStudents, setLoadingStudents] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Selected Student
    |--------------------------------------------------------------------------
    */

    const [selectedStudent, setSelectedStudent] =
        useState(null);


    const [studentDetails, setStudentDetails] =
        useState(null);


    const [loadingDetails, setLoadingDetails] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    const [paymentForm, setPaymentForm] =
        useState({

            payment_date:
                new Date()
                    .toISOString()
                    .split("T")[0],

            amount: "",

            payment_mode: "Cash",

            transaction_reference: "",

            cheque_no: "",

            bank_name: "",

            remarks: "",

        });


    const [submitting, setSubmitting] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Academic Years & Classes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAcademicYears();

        loadClasses();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Academic Years
    |--------------------------------------------------------------------------
    */

    const loadAcademicYears = async () => {

        try {

            const response =
                await academicYearApi.getAll();


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            setAcademicYears(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Academic Years Error:",
                error
            );

            setAcademicYears([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Classes
    |--------------------------------------------------------------------------
    */

    const loadClasses = async () => {

        try {

            const response =
                await classApi.getAll();


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            setClasses(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Classes Error:",
                error
            );

            setClasses([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    const loadSections = async (
        classId
    ) => {

        if (!classId) {

            setSections([]);

            return;

        }


        try {

            const response =
                await sectionApi.getByClass(
                    classId
                );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            setSections(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Sections Error:",
                error
            );

            setSections([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Student Search
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const value =
            search.trim();


        if (!value) {

            setStudents([]);

            setShowSuggestions(false);

            return;

        }


        const timer =
            setTimeout(() => {

                searchStudents(
                    value
                );

            }, 350);


        return () => {

            clearTimeout(timer);

        };

    }, [
        search,
        academicYearId,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Search Students
    |--------------------------------------------------------------------------
    */

    const searchStudents = async (
        value
    ) => {

        try {

            setLoadingStudents(true);


            const params = {

                search: value,

            };


            if (academicYearId) {

                params.academic_year_id =
                    academicYearId;

            }


            const response =
                await feePaymentApi.searchStudents(
                    params
                );


            console.log(
                "Students Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                [];


            setStudents(
                Array.isArray(data)
                    ? data
                    : []
            );


            setShowSuggestions(true);

        }
        catch (error) {

            console.error(
                "Student Search Error:",
                error
            );

            setStudents([]);

            setShowSuggestions(true);

        }
        finally {

            setLoadingStudents(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Select Student
    |--------------------------------------------------------------------------
    */

    const handleSelectStudent = async (
        student
    ) => {

        try {

            setSelectedStudent(
                student
            );


            setSearch(
                getStudentName(
                    student
                )
            );


            setShowSuggestions(
                false
            );


            setLoadingDetails(
                true
            );


            if (student.class_id) {

                await loadSections(
                    student.class_id
                );

            }


            const response =
                await feePaymentApi.getStudentDetails(
                    student.id
                );


            console.log(
                "Student Details Response:",
                response
            );


            const data =
                response?.data?.data ??
                response?.data ??
                null;


            setStudentDetails(
                data
            );


            /*
            |--------------------------------------------------------------------------
            | Load sections from detailed student
            |--------------------------------------------------------------------------
            */

            if (
                data?.student?.class_id
            ) {

                await loadSections(
                    data.student.class_id
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Automatically fill remaining due
            |--------------------------------------------------------------------------
            */

            const due =
                Number(
                    data
                        ?.summary
                        ?.due_amount ?? 0
                );


            setPaymentForm(
                previous => ({

                    ...previous,

                    amount:
                        due > 0
                            ? due.toString()
                            : "",

                })
            );

        }
        catch (error) {

            console.error(
                "Student Details Error:",
                error
            );

            setStudentDetails(
                null
            );

        }
        finally {

            setLoadingDetails(
                false
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Payment Form Change
    |--------------------------------------------------------------------------
    */

    const handlePaymentChange = (
        e
    ) => {

        const {
            name,
            value,
        } = e.target;


        setPaymentForm(
            previous => ({

                ...previous,

                [name]: value,

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Submit Payment
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        if (!selectedStudent) {

            alert(
                "Please select a student."
            );

            return;

        }


        if (!studentDetails) {

            alert(
                "Student fee details are not available."
            );

            return;

        }


        const feeStructureId =
            studentDetails
                ?.fee_structure
                ?.id;


        if (!feeStructureId) {

            alert(
                "No active fee structure is assigned to this student."
            );

            return;

        }


        const amount =
            Number(
                paymentForm.amount
            );


        const dueAmount =
            Number(
                studentDetails
                    ?.summary
                    ?.due_amount ?? 0
            );


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid payment amount."
            );

            return;

        }


        if (
            amount > dueAmount
        ) {

            alert(
                `Payment cannot be greater than the due amount of ₹${formatAmount(
                    dueAmount
                )}.`
            );

            return;

        }


        try {

            setSubmitting(
                true
            );


            const response =
                await feePaymentApi.collectPayment({

                    student_id:
                        selectedStudent.id,

                    fee_structure_id:
                        feeStructureId,

                    payment_date:
                        paymentForm.payment_date,

                    amount:
                        amount,

                    payment_mode:
                        paymentForm.payment_mode,

                    transaction_reference:
                        paymentForm.transaction_reference ||
                        null,

                    cheque_no:
                        paymentForm.cheque_no ||
                        null,

                    bank_name:
                        paymentForm.bank_name ||
                        null,

                    remarks:
                        paymentForm.remarks ||
                        null,

                });


            console.log(
                "Payment Response:",
                response
            );


            /*
            |--------------------------------------------------------------------------
            | Navigate back to collection
            |--------------------------------------------------------------------------
            */

            navigate(
                "/fees/collection"
            );

        }
        catch (error) {

            console.error(
                "Payment Error:",
                error
            );


            console.error(
                "Backend:",
                error?.response?.data
            );


            alert(
                error
                    ?.response
                    ?.data
                    ?.message ||
                "Unable to collect fee payment."
            );

        }
        finally {

            setSubmitting(
                false
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Student Name
    |--------------------------------------------------------------------------
    */

    const getStudentName = (
        student
    ) => {

        if (!student) {

            return "";

        }


        return (
            student.full_name ||
            [
                student.first_name,
                student.middle_name,
                student.last_name,
            ]
                .filter(Boolean)
                .join(" ")
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Academic Year Name
    |--------------------------------------------------------------------------
    */

    const getAcademicYearName = (
        id
    ) => {

        const year =
            academicYears.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        return (
            year?.name ||
            year?.title ||
            year?.academic_year ||
            year?.year ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Class Name
    |--------------------------------------------------------------------------
    */

    const getClassName = (
        id
    ) => {

        const classItem =
            classes.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        return (
            classItem?.name ||
            classItem?.class_name ||
            classItem?.title ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Section Name
    |--------------------------------------------------------------------------
    */

    const getSectionName = (
        id
    ) => {

        const section =
            sections.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        return (
            section?.name ||
            section?.section_name ||
            section?.title ||
            "-"
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Clear Student
    |--------------------------------------------------------------------------
    */

    const clearStudent = () => {

        setSelectedStudent(
            null
        );

        setStudentDetails(
            null
        );

        setSearch("");

        setStudents([]);

        setSections([]);

        setShowSuggestions(
            false
        );

        setPaymentForm(
            previous => ({

                ...previous,

                amount: "",

            })
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-gray-50 p-6">


            {/* Header */}

            <div className="flex items-center gap-4 mb-6">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/fees/collection"
                        )
                    }
                    className="
                        w-10
                        h-10
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-gray-600
                        hover:text-[#610e1e]
                        hover:border-[#610e1e]
                        transition
                    "
                >

                    <FaArrowLeft />

                </button>


                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">

                        Collect Fee Payment

                    </h1>

                    <p className="text-sm text-gray-500 mt-1">

                        Select a student and record a fee payment

                    </p>

                </div>

            </div>


            {/* Student Search */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                    {/* Academic Year */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                            Academic Year

                        </label>


                        <div className="relative">

                            <FaCalendarAlt
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#610e1e]
                                "
                            />


                            <select
                                value={
                                    academicYearId
                                }
                                onChange={(e) => {

                                    setAcademicYearId(
                                        e.target.value
                                    );

                                    clearStudent();

                                }}
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-xl
                                    pl-10
                                    pr-4
                                    py-3
                                    focus:outline-none
                                    focus:border-[#610e1e]
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                "
                            >

                                <option value="">
                                    All Academic Years
                                </option>


                                {academicYears.map(
                                    year => (

                                        <option
                                            key={year.id}
                                            value={year.id}
                                        >

                                            {
                                                year.name ||
                                                year.title ||
                                                year.academic_year ||
                                                year.year
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* Student Search */}

                    <div
                        ref={searchRef}
                        className="
                            md:col-span-2
                            relative
                        "
                    >

                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                            Search Student

                        </label>


                        <div className="relative">

                            <FaSearch
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />


                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {

                                    setSearch(
                                        e.target.value
                                    );

                                    if (
                                        selectedStudent
                                    ) {

                                        setSelectedStudent(
                                            null
                                        );

                                        setStudentDetails(
                                            null
                                        );

                                    }

                                }}
                                placeholder="Search by name or admission number..."
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-xl
                                    pl-10
                                    pr-10
                                    py-3
                                    focus:outline-none
                                    focus:border-[#610e1e]
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                "
                            />


                            {search && (

                                <button
                                    type="button"
                                    onClick={
                                        clearStudent
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-[#610e1e]
                                    "
                                >

                                    <FaTimes />

                                </button>

                            )}

                        </div>


                        {/* Suggestions */}

                        {showSuggestions && (

                            <div
                                className="
                                    absolute
                                    z-50
                                    left-0
                                    right-0
                                    mt-2
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-xl
                                    shadow-xl
                                    overflow-hidden
                                "
                            >

                                {loadingStudents ? (

                                    <div className="p-5 text-center text-gray-500">

                                        <FaSpinner className="animate-spin inline mr-2" />

                                        Searching students...

                                    </div>

                                ) : students.length > 0 ? (

                                    students.map(
                                        student => (

                                            <button
                                                type="button"
                                                key={
                                                    student.id
                                                }
                                                onClick={() =>
                                                    handleSelectStudent(
                                                        student
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    text-left
                                                    px-4
                                                    py-3
                                                    border-b
                                                    border-gray-100
                                                    last:border-b-0
                                                    hover:bg-[#610e1e]/5
                                                "
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="
                                                            w-10
                                                            h-10
                                                            rounded-full
                                                            bg-[#610e1e]/10
                                                            flex
                                                            items-center
                                                            justify-center
                                                            shrink-0
                                                        "
                                                    >

                                                        <FaUserGraduate
                                                            className="text-[#610e1e]"
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-gray-800">

                                                            {
                                                                getStudentName(
                                                                    student
                                                                )
                                                            }

                                                        </p>


                                                        <p className="text-xs text-gray-500">

                                                            Admission No:
                                                            {" "}
                                                            {
                                                                student.admission_no
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>

                                        )
                                    )

                                ) : (

                                    <div className="p-5 text-center text-gray-500">

                                        No students found.

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* Loading */}

            {loadingDetails && (

                <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">

                    <FaSpinner
                        className="
                            animate-spin
                            text-3xl
                            text-[#610e1e]
                            mx-auto
                            mb-3
                        "
                    />

                    <p className="text-gray-500">

                        Loading student fee details...

                    </p>

                </div>

            )}


            {/* Main Content */}

            {!loadingDetails &&
                studentDetails && (

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* Student Profile */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

                            <div className="flex items-center gap-4">

                                <div
                                    className="
                                        w-16
                                        h-16
                                        rounded-2xl
                                        bg-[#610e1e]/10
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <FaUserGraduate
                                        className="
                                            text-[#610e1e]
                                            text-2xl
                                        "
                                    />

                                </div>


                                <div>

                                    <h2 className="text-xl font-bold text-[#610e1e]">

                                        {
                                            getStudentName(
                                                studentDetails.student
                                            )
                                        }

                                    </h2>


                                    <p className="text-sm text-gray-500">

                                        Admission No:
                                        {" "}
                                        {
                                            studentDetails
                                                ?.student
                                                ?.admission_no ||
                                            "-"
                                        }

                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-6 pt-5 border-t border-gray-100">

                                <InfoItem
                                    label="Course"
                                    value={
                                        studentDetails
                                            ?.fee_structure
                                            ?.course
                                            ?.title ||
                                        "-"
                                    }
                                />


                                <InfoItem
                                    label="Academic Year"
                                    value={
                                        getAcademicYearName(
                                            studentDetails
                                                ?.student
                                                ?.academic_year_id
                                        )
                                    }
                                />


                                <InfoItem
                                    label="Class"
                                    value={
                                        getClassName(
                                            studentDetails
                                                ?.student
                                                ?.class_id
                                        )
                                    }
                                />


                                <InfoItem
                                    label="Section"
                                    value={
                                        getSectionName(
                                            studentDetails
                                                ?.student
                                                ?.section_id
                                        )
                                    }
                                />


                                <InfoItem
                                    label="Hostel"
                                    value={
                                        studentDetails
                                            ?.student
                                            ?.hostel_required
                                            ? "Required"
                                            : "Not Required"
                                    }
                                />

                            </div>

                        </div>


                        {/* Fee Summary */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


                            <AmountCard
                                title="Total Fee"
                                value={
                                    studentDetails
                                        ?.summary
                                        ?.total_fee
                                }
                            />


                            <AmountCard
                                title="Waiver"
                                value={
                                    studentDetails
                                        ?.summary
                                        ?.total_waiver
                                }
                            />


                            <AmountCard
                                title="Total Paid"
                                value={
                                    studentDetails
                                        ?.summary
                                        ?.total_paid
                                }
                            />


                            <AmountCard
                                title="Due Amount"
                                value={
                                    studentDetails
                                        ?.summary
                                        ?.due_amount
                                }
                                highlight
                            />

                        </div>


                        {/* Payment Form */}

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                            <div className="px-6 py-5 border-b border-gray-200">

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-[#610e1e]/10
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <FaMoneyBillWave
                                            className="text-[#610e1e]"
                                        />

                                    </div>


                                    <div>

                                        <h2 className="font-bold text-lg text-[#610e1e]">

                                            Payment Details

                                        </h2>

                                        <p className="text-xs text-gray-500">

                                            Enter the amount and payment information

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                    {/* Payment Date */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Payment Date
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>

                                        </label>


                                        <input
                                            type="date"
                                            name="payment_date"
                                            value={
                                                paymentForm.payment_date
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
                                            required
                                            className="
                                                w-full
                                                border
                                                border-gray-300
                                                rounded-xl
                                                px-4
                                                py-3
                                                focus:outline-none
                                                focus:border-[#610e1e]
                                                focus:ring-2
                                                focus:ring-[#610e1e]/20
                                            "
                                        />

                                    </div>


                                    {/* Amount */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Payment Amount
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>

                                        </label>


                                        <div className="relative">

                                            <span
                                                className="
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-500
                                                "
                                            >
                                                ₹
                                            </span>


                                            <input
                                                type="number"
                                                name="amount"
                                                value={
                                                    paymentForm.amount
                                                }
                                                onChange={
                                                    handlePaymentChange
                                                }
                                                min="0.01"
                                                max={
                                                    studentDetails
                                                        ?.summary
                                                        ?.due_amount
                                                }
                                                step="0.01"
                                                required
                                                placeholder="Enter amount"
                                                className="
                                                    w-full
                                                    border
                                                    border-gray-300
                                                    rounded-xl
                                                    pl-8
                                                    pr-4
                                                    py-3
                                                    focus:outline-none
                                                    focus:border-[#610e1e]
                                                    focus:ring-2
                                                    focus:ring-[#610e1e]/20
                                                "
                                            />

                                        </div>


                                        <p className="text-xs text-gray-500 mt-1">

                                            Maximum:
                                            {" "}
                                            ₹
                                            {
                                                formatAmount(
                                                    studentDetails
                                                        ?.summary
                                                        ?.due_amount
                                                )
                                            }

                                        </p>

                                    </div>


                                    {/* Payment Mode */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Payment Mode
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>

                                        </label>


                                        <select
                                            name="payment_mode"
                                            value={
                                                paymentForm.payment_mode
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
                                            required
                                            className="
                                                w-full
                                                border
                                                border-gray-300
                                                rounded-xl
                                                px-4
                                                py-3
                                                focus:outline-none
                                                focus:border-[#610e1e]
                                                focus:ring-2
                                                focus:ring-[#610e1e]/20
                                            "
                                        >

                                            <option value="Cash">
                                                Cash
                                            </option>

                                            <option value="UPI">
                                                UPI
                                            </option>

                                            <option value="Bank Transfer">
                                                Bank Transfer
                                            </option>

                                            <option value="Cheque">
                                                Cheque
                                            </option>

                                            <option value="Card">
                                                Card
                                            </option>

                                            <option value="Online">
                                                Online
                                            </option>

                                        </select>

                                    </div>


                                    {/* Transaction Reference */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Transaction Reference

                                        </label>


                                        <input
                                            type="text"
                                            name="transaction_reference"
                                            value={
                                                paymentForm.transaction_reference
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
                                            placeholder="UTR / Transaction ID"
                                            className="
                                                w-full
                                                border
                                                border-gray-300
                                                rounded-xl
                                                px-4
                                                py-3
                                                focus:outline-none
                                                focus:border-[#610e1e]
                                                focus:ring-2
                                                focus:ring-[#610e1e]/20
                                            "
                                        />

                                    </div>


                                    {/* Cheque Number */}

                                    {paymentForm.payment_mode ===
                                        "Cheque" && (

                                            <div>

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                    Cheque Number

                                                </label>


                                                <input
                                                    type="text"
                                                    name="cheque_no"
                                                    value={
                                                        paymentForm.cheque_no
                                                    }
                                                    onChange={
                                                        handlePaymentChange
                                                    }
                                                    className="
                                                        w-full
                                                        border
                                                        border-gray-300
                                                        rounded-xl
                                                        px-4
                                                        py-3
                                                        focus:outline-none
                                                        focus:border-[#610e1e]
                                                        focus:ring-2
                                                        focus:ring-[#610e1e]/20
                                                    "
                                                />

                                            </div>

                                        )}


                                    {/* Bank Name */}

                                    {(
                                        paymentForm.payment_mode ===
                                            "Cheque" ||
                                        paymentForm.payment_mode ===
                                            "Bank Transfer"
                                    ) && (

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                Bank Name

                                            </label>


                                            <input
                                                type="text"
                                                name="bank_name"
                                                value={
                                                    paymentForm.bank_name
                                                }
                                                onChange={
                                                    handlePaymentChange
                                                }
                                                className="
                                                    w-full
                                                    border
                                                    border-gray-300
                                                    rounded-xl
                                                    px-4
                                                    py-3
                                                    focus:outline-none
                                                    focus:border-[#610e1e]
                                                    focus:ring-2
                                                    focus:ring-[#610e1e]/20
                                                "
                                            />

                                        </div>

                                    )}


                                    {/* Remarks */}

                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Remarks

                                        </label>


                                        <textarea
                                            name="remarks"
                                            value={
                                                paymentForm.remarks
                                            }
                                            onChange={
                                                handlePaymentChange
                                            }
                                            rows="4"
                                            placeholder="Enter remarks..."
                                            className="
                                                w-full
                                                border
                                                border-gray-300
                                                rounded-xl
                                                px-4
                                                py-3
                                                resize-none
                                                focus:outline-none
                                                focus:border-[#610e1e]
                                                focus:ring-2
                                                focus:ring-[#610e1e]/20
                                            "
                                        />

                                    </div>

                                </div>


                                {/* Buttons */}

                                <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-200">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/fees/collection"
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        className="
                                            px-5
                                            py-3
                                            rounded-xl
                                            border
                                            border-gray-300
                                            text-gray-700
                                            font-semibold
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        Cancel

                                    </button>


                                    <button
                                        type="submit"
                                        disabled={
                                            submitting ||
                                            Number(
                                                studentDetails
                                                    ?.summary
                                                    ?.due_amount ??
                                                0
                                            ) <= 0
                                        }
                                        className="
                                            px-6
                                            py-3
                                            rounded-xl
                                            bg-[#610e1e]
                                            text-white
                                            font-semibold
                                            flex
                                            items-center
                                            gap-2
                                            hover:bg-[#4d0b18]
                                            disabled:bg-gray-300
                                            disabled:cursor-not-allowed
                                            transition
                                        "
                                    >

                                        {submitting ? (

                                            <>

                                                <FaSpinner className="animate-spin" />

                                                Saving...

                                            </>

                                        ) : (

                                            <>

                                                <FaReceipt />

                                                Collect Payment

                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </form>

                )}


            {/* No Student */}

            {!loadingDetails &&
                !studentDetails && (

                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-14 text-center">

                        <FaUserGraduate
                            className="
                                text-5xl
                                text-[#610e1e]/20
                                mx-auto
                                mb-4
                            "
                        />

                        <h2 className="text-lg font-semibold text-gray-700">

                            Select a Student

                        </h2>

                        <p className="text-sm text-gray-500 mt-2">

                            Search for a student above to continue with fee collection.

                        </p>

                    </div>

                )}

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Info Item
|--------------------------------------------------------------------------
*/

function InfoItem({
    label,
    value,
}) {

    return (

        <div>

            <p className="text-xs text-gray-500 mb-1">

                {label}

            </p>

            <p className="text-sm font-semibold text-gray-800 truncate">

                {value || "-"}

            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Amount Card
|--------------------------------------------------------------------------
*/

function AmountCard({
    title,
    value,
    highlight = false,
}) {

    return (

        <div
            className={`
                rounded-2xl
                border
                p-5
                ${
                    highlight
                        ? "bg-[#610e1e] border-[#610e1e]"
                        : "bg-white border-gray-200"
                }
            `}
        >

            <p
                className={
                    highlight
                        ? "text-xs text-white/70"
                        : "text-xs text-gray-500"
                }
            >

                {title}

            </p>


            <p
                className={`
                    text-xl
                    font-bold
                    mt-2
                    ${
                        highlight
                            ? "text-white"
                            : "text-[#610e1e]"
                    }
                `}
            >

                ₹
                {
                    formatAmount(
                        value
                    )
                }

            </p>

        </div>

    );

}


/*
|--------------------------------------------------------------------------
| Format Amount
|--------------------------------------------------------------------------
*/

function formatAmount(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );

}