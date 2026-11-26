import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaMoneyBillWave,
} from "react-icons/fa";

import feeComponentApi from "../../../services/feeComponentApi";


export default function Edit() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: "",
        code: "",
        component_type: "",
        is_active: true,
        remarks: "",
    });


    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Component
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadComponent();

    }, [id]);


    const loadComponent = async () => {

        try {

            setLoading(true);

            const response =
                await feeComponentApi.getById(id);


            console.log(
                "Fee Component Response:",
                response
            );


            const component =
                response?.data?.data ??
                response?.data;


            if (!component) {

                alert(
                    "Fee component not found."
                );

                navigate(
                    "/fees/components"
                );

                return;

            }


            setFormData({

                name:
                    component.name ?? "",

                code:
                    component.code ?? "",

                component_type:
                    component.component_type ?? "",

                is_active:
                    Boolean(
                        component.is_active
                    ),

                remarks:
                    component.remarks ?? "",

            });

        }
        catch (error) {

            console.error(
                "Load Fee Component Error:",
                error
            );

            console.error(
                "Backend:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load fee component."
            );

            navigate(
                "/fees/components"
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
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});


        const validationErrors = {};


        if (!formData.name.trim()) {

            validationErrors.name =
                "Component name is required.";

        }


        if (!formData.code.trim()) {

            validationErrors.code =
                "Component code is required.";

        }


        if (!formData.component_type) {

            validationErrors.component_type =
                "Please select component type.";

        }


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

                name:
                    formData.name.trim(),

                code:
                    formData.code
                        .trim()
                        .toUpperCase(),

                component_type:
                    formData.component_type,

                is_active:
                    formData.is_active,

                remarks:
                    formData.remarks.trim() ||
                    null,

            };


            console.log(
                "Updating Fee Component:",
                payload
            );


            const response =
                await feeComponentApi.update(
                    id,
                    payload
                );


            console.log(
                "Update Response:",
                response
            );


            navigate(
                "/fees/components"
            );

        }
        catch (error) {

            console.error(
                "Update Fee Component Error:",
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
                    "Unable to update fee component."
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
                        Loading fee component...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            className="
                max-w-4xl
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
                            "/fees/components"
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

                    <FaMoneyBillWave
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
                        Edit Fee Component
                    </h1>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Update fee component details
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
                        Component Information
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Update the information below.
                    </p>

                </div>


                <div className="p-6 space-y-6">

                    {/* Component Name */}

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
                            Component Name
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Example: Course Fee"
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


                    {/* Component Code */}

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
                            Component Code
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Example: COURSE"
                            className={`
                                w-full
                                px-4
                                py-3
                                border
                                rounded-lg
                                uppercase
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                                ${
                                    errors.code
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                            `}
                        />

                        <p
                            className="
                                text-xs
                                text-gray-400
                                mt-1
                            "
                        >
                            Component code must be unique.
                        </p>

                        {errors.code && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(errors.code)
                                    ? errors.code[0]
                                    : errors.code}
                            </p>

                        )}

                    </div>


                    {/* Component Type */}

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
                            Component Type
                            <span className="text-red-500 ml-1">
                                *
                            </span>
                        </label>

                        <select
                            name="component_type"
                            value={
                                formData.component_type
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
                                    errors.component_type
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                            `}
                        >

                            <option value="">
                                Select Component Type
                            </option>

                            <option value="course">
                                Course
                            </option>

                            <option value="hostel">
                                Hostel
                            </option>

                            <option value="other">
                                Other
                            </option>

                        </select>

                        {errors.component_type && (

                            <p
                                className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                "
                            >
                                {Array.isArray(
                                    errors.component_type
                                )
                                    ? errors.component_type[0]
                                    : errors.component_type}
                            </p>

                        )}

                    </div>


                    {/* Active Status */}

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
                                Active components can be used in fee structures.
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
                                name="is_active"
                                checked={
                                    formData.is_active
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


                    {/* Remarks */}

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
                            onChange={handleChange}
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
                                "/fees/components"
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

                                Updating...

                            </>

                        ) : (

                            <>
                                <FaSave />
                                Update Component
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>

    );

}