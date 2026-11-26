import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaFileInvoiceDollar,
} from "react-icons/fa";

import api from "../../../services/api";
import feeStructureApi from "../../../services/feeStructureApi";
import feeComponentApi from "../../../services/feeComponentApi";
import installmentApi from "../../../services/installmentApi";
import courseApi from "../../../services/courseApi";


export default function Create() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        fee_component_id: "",

        course_id: "",

        academic_year_id: "",

        installment_id: "",

        name: "",

        total_amount: "",

        effective_from: "",

        effective_to: "",

        status: true,

        remarks: "",

    });


    const [components, setComponents] = useState([]);

    const [courses, setCourses] = useState([]);

    const [academicYears, setAcademicYears] = useState([]);

    const [installments, setInstallments] = useState([]);


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});


    /*
    |--------------------------------------------------------------------------
    | Load Dropdown Data
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDropdownData();

    }, []);


    const loadDropdownData = async () => {

        try {

            setLoading(true);


            const [
                componentsResponse,
                coursesResponse,
                academicYearsResponse,
                installmentsResponse,
            ] = await Promise.all([

                feeComponentApi.getAll({
                    is_active: 1,
                }),

                courseApi.getAll({
                    is_active: 1,
                }),

                api.get("/academic-management/academic-years", {
                    params: {
                        is_current: 1,
                    },
                }),

                installmentApi.getAll({
                    status: 1,
                }),

            ]);


            /*
            |--------------------------------------------------------------------------
            | Components
            |--------------------------------------------------------------------------
            */

            const componentsData =
                componentsResponse?.data?.data ??
                componentsResponse?.data ??
                [];


            setComponents(
                Array.isArray(componentsData)
                    ? componentsData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Courses
            |--------------------------------------------------------------------------
            */

            const coursesData =
                coursesResponse?.data?.data ??
                coursesResponse?.data ??
                [];


            setCourses(
                Array.isArray(coursesData)
                    ? coursesData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Academic Years
            |--------------------------------------------------------------------------
            */

            const academicYearsData =
                academicYearsResponse?.data?.data ??
                academicYearsResponse?.data ??
                [];


            setAcademicYears(
                Array.isArray(academicYearsData)
                    ? academicYearsData
                    : []
            );


            /*
            |--------------------------------------------------------------------------
            | Installments
            |--------------------------------------------------------------------------
            */

            const installmentsData =
                installmentsResponse?.data?.data ??
                installmentsResponse?.data ??
                [];


            setInstallments(
                Array.isArray(installmentsData)
                    ? installmentsData
                    : []
            );

        }
        catch (error) {

            console.error(
                "Fee Structure Dropdown Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load required data."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Selected Component
    |--------------------------------------------------------------------------
    */

    const selectedComponent =
        components.find(
            (component) =>
                String(component.id) ===
                String(formData.fee_component_id)
        );


    /*
    |--------------------------------------------------------------------------
    | Is Course Component?
    |--------------------------------------------------------------------------
    */

    const isCourseComponent =
        String(
            selectedComponent?.component_type || ""
        ).toLowerCase() === "course";


    /*
    |--------------------------------------------------------------------------
    | Handle Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));


        /*
        |--------------------------------------------------------------------------
        | When Component Changes
        |--------------------------------------------------------------------------
        */

        if (name === "fee_component_id") {

            /*
            | Course component requires course.
            | Hostel / Other does not.
            */

            const component =
                components.find(
                    (item) =>
                        String(item.id) ===
                        String(value)
                );


            const componentType =
                String(
                    component?.component_type || ""
                ).toLowerCase();


            if (componentType !== "course") {

                setFormData((prev) => ({

                    ...prev,

                    fee_component_id: value,

                    course_id: "",

                }));

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Clear Field Error
        |--------------------------------------------------------------------------
        */

        if (errors[name]) {

            setErrors((prev) => ({

                ...prev,

                [name]: "",

            }));

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {

        const validationErrors = {};


        if (!formData.fee_component_id) {

            validationErrors.fee_component_id =
                "Please select a fee component.";

        }


        if (
            isCourseComponent &&
            !formData.course_id
        ) {

            validationErrors.course_id =
                "Please select a course.";

        }


        if (!formData.academic_year_id) {

            validationErrors.academic_year_id =
                "Please select an academic year.";

        }


        if (!formData.name.trim()) {

            validationErrors.name =
                "Fee structure name is required.";

        }


        if (
            formData.total_amount === "" ||
            Number(formData.total_amount) < 0
        ) {

            validationErrors.total_amount =
                "Please enter a valid fee amount.";

        }


        if (
            formData.effective_from &&
            formData.effective_to
        ) {

            if (
                formData.effective_to <
                formData.effective_from
            ) {

                validationErrors.effective_to =
                    "Effective To must be after or equal to Effective From.";

            }

        }


        return validationErrors;

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();


        const validationErrors =
            validate();


        if (
            Object.keys(validationErrors).length > 0
        ) {

            setErrors(
                validationErrors
            );

            return;

        }


        try {

            setSaving(true);

            setErrors({});


            const payload = {

                fee_component_id:
                    Number(
                        formData.fee_component_id
                    ),

                course_id:
                    isCourseComponent &&
                    formData.course_id
                        ? Number(
                            formData.course_id
                        )
                        : null,

                academic_year_id:
                    Number(
                        formData.academic_year_id
                    ),

                installment_id:
                    formData.installment_id
                        ? Number(
                            formData.installment_id
                        )
                        : null,

                name:
                    formData.name.trim(),

                total_amount:
                    Number(
                        formData.total_amount
                    ),

                effective_from:
                    formData.effective_from ||
                    null,

                effective_to:
                    formData.effective_to ||
                    null,

                status:
                    formData.status,

                remarks:
                    formData.remarks.trim() ||
                    null,

            };


            console.log(
                "Creating Fee Structure:",
                payload
            );


            const response =
                await feeStructureApi.create(
                    payload
                );


            console.log(
                "Create Fee Structure Response:",
                response
            );


            navigate(
                "/fees/structure"
            );

        }
        catch (error) {

            console.error(
                "Create Fee Structure Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );


            /*
            |--------------------------------------------------------------------------
            | Laravel Validation Errors
            |--------------------------------------------------------------------------
            */

            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {

                setErrors(
                    error.response.data.errors
                );

            }
            else {

                alert(
                    error.response?.data?.message ||
                    "Unable to create fee structure."
                );

            }

        }
        finally {

            setSaving(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div
                className="
                    min-h-[400px]
                    flex
                    items-center
                    justify-center
                "
            >

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            border-4
                            border-[#610e1e]
                            border-t-transparent
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-gray-600
                            font-medium
                        "
                    >
                        Loading fee structure data...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            className="
                max-w-5xl
                mx-auto
                space-y-6
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/fees/structure"
                        )
                    }
                    className="
                        w-10
                        h-10
                        rounded-lg
                        bg-white
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                        text-[#610e1e]
                        hover:bg-[#610e1e]
                        hover:text-white
                        transition
                    "
                >

                    <FaArrowLeft />

                </button>


                <div
                    className="
                        w-12
                        h-12
                        rounded-xl
                        bg-[#610e1e]
                        flex
                        items-center
                        justify-center
                        shadow-md
                    "
                >

                    <FaFileInvoiceDollar
                        className="
                            text-[#FFD963]
                            text-xl
                        "
                    />

                </div>


                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-[#610e1e]
                        "
                    >
                        Add Fee Structure
                    </h1>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Create a fee structure for a course or other fee component
                    </p>

                </div>

            </div>


            {/* =====================================================
                FORM
            ===================================================== */}

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    rounded-xl
                    border
                    border-gray-200
                    shadow-sm
                    overflow-hidden
                "
            >

                {/* Form Header */}

                <div
                    className="
                        px-6
                        py-5
                        bg-gray-50
                        border-b
                        border-gray-200
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-gray-800
                        "
                    >
                        Fee Structure Information
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Define the fee amount applicable for the selected component.
                    </p>

                </div>


                <div className="p-6 space-y-6">


                    {/* =================================================
                        COMPONENT + COURSE
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        {/* Fee Component */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Fee Component
                                <span className="text-red-500 ml-1">
                                    *
                                </span>
                            </label>


                            <select
                                name="fee_component_id"
                                value={
                                    formData.fee_component_id
                                }
                                onChange={
                                    handleChange
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    rounded-lg
                                    bg-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                    focus:border-[#610e1e]
                                    ${
                                        errors.fee_component_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            >

                                <option value="">
                                    Select Fee Component
                                </option>


                                {components.map(
                                    (component) => (

                                        <option
                                            key={
                                                component.id
                                            }
                                            value={
                                                component.id
                                            }
                                        >
                                            {component.name}
                                        </option>

                                    )
                                )}

                            </select>


                            {errors.fee_component_id && (

                                <p
                                    className="
                                        text-red-500
                                        text-xs
                                        mt-1
                                    "
                                >
                                    {Array.isArray(
                                        errors.fee_component_id
                                    )
                                        ? errors.fee_component_id[0]
                                        : errors.fee_component_id}
                                </p>

                            )}

                        </div>


                        {/* Course */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Course

                                {isCourseComponent && (
                                    <span className="text-red-500 ml-1">
                                        *
                                    </span>
                                )}

                            </label>


                            <select
                                name="course_id"
                                value={
                                    formData.course_id
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    !isCourseComponent
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    rounded-lg
                                    bg-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                    focus:border-[#610e1e]
                                    disabled:bg-gray-100
                                    disabled:text-gray-400
                                    ${
                                        errors.course_id
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            >

                                <option value="">

                                    {isCourseComponent
                                        ? "Select Course"
                                        : "Not Applicable"}

                                </option>


                                {isCourseComponent &&
                                    courses.map(
                                        (course) => (

                                            <option
                                                key={
                                                    course.id
                                                }
                                                value={
                                                    course.id
                                                }
                                            >
                                                {course.title}
                                            </option>

                                        )
                                    )}

                            </select>


                            {!isCourseComponent && (
                                <p
                                    className="
                                        text-xs
                                        text-gray-400
                                        mt-1
                                    "
                                >
                                    Course is not required for this component.
                                </p>
                            )}


                            {errors.course_id && (

                                <p
                                    className="
                                        text-red-500
                                        text-xs
                                        mt-1
                                    "
                                >
                                    {Array.isArray(
                                        errors.course_id
                                    )
                                        ? errors.course_id[0]
                                        : errors.course_id}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        ACADEMIC YEAR
                    ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            Academic Year
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>


                        <select
                            name="academic_year_id"
                            value={
                                formData.academic_year_id
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                px-4
                                py-3
                                border
                                rounded-lg
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                                ${
                                    errors.academic_year_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                            `}
                        >

                            <option value="">
                                Select Academic Year
                            </option>


                            {academicYears.map(
                                (year) => (

                                    <option
                                        key={year.id}
                                        value={year.id}
                                    >
                                        {year.name ||
                                            year.title ||
                                            year.academic_year ||
                                            `Academic Year ${year.id}`}
                                    </option>

                                )
                            )}

                        </select>


                        {errors.academic_year_id && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(
                                    errors.academic_year_id
                                )
                                    ? errors.academic_year_id[0]
                                    : errors.academic_year_id}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        INSTALLMENT
                    ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            Installment
                        </label>


                        <select
                            name="installment_id"
                            value={
                                formData.installment_id
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                px-4
                                py-3
                                border
                                rounded-lg
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                                ${
                                    errors.installment_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                            `}
                        >

                            <option value="">
                                No Installment / One-time
                            </option>


                            {installments.map(
                                (installment) => (

                                    <option
                                        key={installment.id}
                                        value={installment.id}
                                    >
                                        {installment.name}
                                    </option>

                                )
                            )}

                        </select>


                        {errors.installment_id && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(
                                    errors.installment_id
                                )
                                    ? errors.installment_id[0]
                                    : errors.installment_id}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        STRUCTURE NAME
                    ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            Fee Structure Name
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>


                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: Schooling + NDA + SSB Fee 2026-27"
                            className={`
                                w-full
                                px-4
                                py-3
                                border
                                rounded-lg
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                                ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                            `}
                        />


                        {errors.name && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(errors.name)
                                    ? errors.name[0]
                                    : errors.name}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        AMOUNT
                    ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            Total Fee Amount
                            <span className="text-red-500 ml-1">
                                *
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
                                    font-semibold
                                "
                            >
                                ₹
                            </span>


                            <input
                                type="number"
                                name="total_amount"
                                value={
                                    formData.total_amount
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={`
                                    w-full
                                    pl-10
                                    pr-4
                                    py-3
                                    border
                                    rounded-lg
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                    focus:border-[#610e1e]
                                    ${
                                        errors.total_amount
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            />

                        </div>


                        {errors.total_amount && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(
                                    errors.total_amount
                                )
                                    ? errors.total_amount[0]
                                    : errors.total_amount}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        EFFECTIVE DATES
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        {/* From */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Effective From
                            </label>


                            <input
                                type="date"
                                name="effective_from"
                                value={
                                    formData.effective_from
                                }
                                onChange={
                                    handleChange
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    rounded-lg
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                    focus:border-[#610e1e]
                                    ${
                                        errors.effective_from
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            />

                        </div>


                        {/* To */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Effective To
                            </label>


                            <input
                                type="date"
                                name="effective_to"
                                value={
                                    formData.effective_to
                                }
                                onChange={
                                    handleChange
                                }
                                className={`
                                    w-full
                                    px-4
                                    py-3
                                    border
                                    rounded-lg
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#610e1e]/20
                                    focus:border-[#610e1e]
                                    ${
                                        errors.effective_to
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            />


                            {errors.effective_to && (

                                <p
                                    className="
                                        text-red-500
                                        text-xs
                                        mt-1
                                    "
                                >
                                    {Array.isArray(
                                        errors.effective_to
                                    )
                                        ? errors.effective_to[0]
                                        : errors.effective_to}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            bg-gray-50
                            border
                            border-gray-200
                            rounded-lg
                            px-4
                            py-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                Active Status
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Active structures will be used when calculating student fees.
                            </p>

                        </div>


                        <label
                            className="
                                relative
                                inline-flex
                                items-center
                                cursor-pointer
                            "
                        >

                            <input
                                type="checkbox"
                                name="status"
                                checked={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                className="sr-only peer"
                            />


                            <div
                                className="
                                    w-11
                                    h-6
                                    bg-gray-300
                                    rounded-full
                                    peer
                                    peer-checked:bg-[#610e1e]
                                    after:content-['']
                                    after:absolute
                                    after:top-[2px]
                                    after:left-[2px]
                                    after:bg-white
                                    after:border-gray-300
                                    after:border
                                    after:rounded-full
                                    after:h-5
                                    after:w-5
                                    after:transition-all
                                    peer-checked:after:translate-x-full
                                    peer-checked:after:border-white
                                "
                            />

                        </label>

                    </div>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            Remarks
                        </label>


                        <textarea
                            name="remarks"
                            value={
                                formData.remarks
                            }
                            onChange={
                                handleChange
                            }
                            rows="4"
                            placeholder="Enter any additional remarks..."
                            className="
                                w-full
                                px-4
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                resize-none
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            "
                        />

                    </div>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div
                    className="
                        px-6
                        py-4
                        bg-gray-50
                        border-t
                        border-gray-200
                        flex
                        items-center
                        justify-end
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/fees/structure"
                            )
                        }
                        disabled={saving}
                        className="
                            px-5
                            py-3
                            rounded-lg
                            border
                            border-gray-300
                            text-gray-700
                            font-semibold
                            hover:bg-white
                            transition
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-6
                            py-3
                            rounded-lg
                            bg-[#610e1e]
                            text-white
                            font-semibold
                            hover:bg-[#4d0b18]
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        {saving ? (

                            <>
                                <span
                                    className="
                                        w-4
                                        h-4
                                        border-2
                                        border-white
                                        border-t-transparent
                                        rounded-full
                                        animate-spin
                                    "
                                />

                                Saving...
                            </>

                        ) : (

                            <>
                                <FaSave />
                                Save Fee Structure
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>

    );

}