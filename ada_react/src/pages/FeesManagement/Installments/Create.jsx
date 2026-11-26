import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaCalendarAlt,
} from "react-icons/fa";

import installmentApi from "../../../services/installmentApi";
import api from "../../../services/api";


export default function Create() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        academic_year_id: "",

        name: "",

        start_date: "",

        end_date: "",

        status: true,

        description: "",

    });


    const [academicYears, setAcademicYears] = useState([]);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Academic Years
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadAcademicYears();

    }, []);


    const loadAcademicYears = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/academic-management/academic-years"
                );

            console.log(
                "Installments Create Academic Years Response:",
                response
            );

            const data =
                response?.data?.data ??
                response?.data ??
                [];

            setAcademicYears(
                Array.isArray(data) ? data : []
            );

        }
        catch (error) {

            console.error(
                "Installments Create Academic Years Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load academic years."
            );

        }
        finally {

            setLoading(false);

        }

    };


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


        if (errors[name]) {

            setErrors((prev) => ({

                ...prev,

                [name]: "",

            }));

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Validate
    |--------------------------------------------------------------------------
    */

    const validate = () => {

        const validationErrors = {};


        if (!formData.academic_year_id) {

            validationErrors.academic_year_id =
                "Please select an academic year.";

        }


        if (!formData.name.trim()) {

            validationErrors.name =
                "Installment name is required.";

        }


        if (!formData.start_date) {

            validationErrors.start_date =
                "Start date is required.";

        }


        if (!formData.end_date) {

            validationErrors.end_date =
                "End date is required.";

        }


        if (
            formData.start_date &&
            formData.end_date &&
            formData.end_date < formData.start_date
        ) {

            validationErrors.end_date =
                "End date must be after or equal to start date.";

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

        setErrors({});


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


            const payload = {

                academic_year_id:
                    Number(
                        formData.academic_year_id
                    ),

                name:
                    formData.name.trim(),

                start_date:
                    formData.start_date,

                end_date:
                    formData.end_date,

                status:
                    formData.status,

                description:
                    formData.description.trim() ||
                    null,

            };


            console.log(
                "Creating Installment:",
                payload
            );


            const response =
                await installmentApi.create(
                    payload
                );


            console.log(
                "Create Installment Response:",
                response
            );


            navigate(
                "/fees/installments"
            );

        }
        catch (error) {

            console.error(
                "Create Installment Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );


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
                    "Unable to create installment."
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
                        Loading data...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto space-y-6">


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
                            "/fees/installments"
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

                    <FaCalendarAlt
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
                        Add Installment
                    </h1>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Create a new fee installment
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
                        Installment Information
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Enter the basic details of the installment.
                    </p>

                </div>


                <div className="p-6 space-y-6">


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
                            onChange={handleChange}
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
                                        {year.academic_year ??
                                            year.name ??
                                            year.title ??
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
                        NAME
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
                            Installment Name
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>


                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: 1st Installment"
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
                        DATES
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        {/* Start Date */}

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
                                Start Date
                                <span className="text-red-500 ml-1">
                                    *
                                </span>
                            </label>


                            <input
                                type="date"
                                name="start_date"
                                value={
                                    formData.start_date
                                }
                                onChange={handleChange}
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
                                        errors.start_date
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            />


                            {errors.start_date && (

                                <p
                                    className="
                                        text-red-500
                                        text-xs
                                        mt-1
                                    "
                                >
                                    {Array.isArray(
                                        errors.start_date
                                    )
                                        ? errors.start_date[0]
                                        : errors.start_date}
                                </p>

                            )}

                        </div>


                        {/* End Date */}

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
                                End Date
                                <span className="text-red-500 ml-1">
                                    *
                                </span>
                            </label>


                            <input
                                type="date"
                                name="end_date"
                                value={
                                    formData.end_date
                                }
                                onChange={handleChange}
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
                                        errors.end_date
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }
                                `}
                            />


                            {errors.end_date && (

                                <p
                                    className="
                                        text-red-500
                                        text-xs
                                        mt-1
                                    "
                                >
                                    {Array.isArray(
                                        errors.end_date
                                    )
                                        ? errors.end_date[0]
                                        : errors.end_date}
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
                                Active installments can be used in fee structures.
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
                                onChange={handleChange}
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
                        DESCRIPTION
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
                            Description
                        </label>


                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter any additional description..."
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
                                "/fees/installments"
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
                                Save Installment
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>

    );
}
