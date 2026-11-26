import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaSave,
    FaPlus,
    FaTrash,
    FaBook,
} from "react-icons/fa";

import courseApi from "../../../services/courseApi";


export default function Edit() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [errors, setErrors] = useState({});

    const [featureInput, setFeatureInput] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        slug: "",
        description: "",
        icon_class: "",
        order_number: 0,
        features: [],
        is_active: true,
    });


    /*
    |--------------------------------------------------------------------------
    | Load Course
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (id) {
            loadCourse();
        }

    }, [id]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await courseApi.getById(id);

            console.log(
                "Course Response:",
                response
            );

            const course =
                response?.data?.data ??
                response?.data;

            if (!course) {

                setError(
                    "Course data not found."
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Features
            |--------------------------------------------------------------------------
            */

            let features = course.features ?? [];

            if (typeof features === "string") {

                try {

                    features = JSON.parse(features);

                }
                catch {

                    features = [];

                }

            }

            if (!Array.isArray(features)) {
                features = [];
            }


            setFormData({

                title:
                    course.title ?? "",

                subtitle:
                    course.subtitle ?? "",

                slug:
                    course.slug ?? "",

                description:
                    course.description ?? "",

                icon_class:
                    course.icon_class ?? "",

                order_number:
                    course.order_number ?? 0,

                features,

                is_active:
                    Boolean(course.is_active),

            });

        }
        catch (error) {

            console.error(
                "Load Course Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load course."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Handle Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | Add Feature
    |--------------------------------------------------------------------------
    */

    const handleAddFeature = () => {

        const feature =
            featureInput.trim();

        if (!feature) {
            return;
        }

        const alreadyExists =
            formData.features.some(
                (item) =>
                    item.toLowerCase() ===
                    feature.toLowerCase()
            );

        if (alreadyExists) {

            setFeatureInput("");

            return;
        }


        setFormData((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                feature,
            ],
        }));

        setFeatureInput("");

    };


    /*
    |--------------------------------------------------------------------------
    | Feature Enter
    |--------------------------------------------------------------------------
    */

    const handleFeatureKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            handleAddFeature();

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Remove Feature
    |--------------------------------------------------------------------------
    */

    const handleRemoveFeature = (index) => {

        setFormData((prev) => ({
            ...prev,
            features:
                prev.features.filter(
                    (_, i) => i !== index
                ),
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {

        const newErrors = {};


        if (!formData.title.trim()) {

            newErrors.title =
                "Course title is required.";

        }


        if (!formData.slug.trim()) {

            newErrors.slug =
                "Course slug is required.";

        }


        if (
            formData.order_number === "" ||
            Number(formData.order_number) < 0
        ) {

            newErrors.order_number =
                "Please enter a valid order number.";

        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!validate()) {
            return;
        }


        try {

            setSaving(true);

            setErrors({});


            const payload = {

                title:
                    formData.title.trim(),

                subtitle:
                    formData.subtitle.trim() || null,

                slug:
                    formData.slug.trim(),

                description:
                    formData.description.trim() || null,

                icon_class:
                    formData.icon_class.trim() || null,

                order_number:
                    Number(formData.order_number) || 0,

                features:
                    formData.features,

                is_active:
                    formData.is_active ? 1 : 0,

            };


            console.log(
                "Update Course Payload:",
                payload
            );


            const response =
                await courseApi.update(
                    id,
                    payload
                );


            console.log(
                "Update Course Response:",
                response
            );


            navigate("/fees/courses");

        }
        catch (error) {

            console.error(
                "Update Course Error:",
                error
            );

            console.error(
                "Backend Error:",
                error.response?.data
            );


            if (
                error.response?.data?.errors
            ) {

                setErrors(
                    error.response.data.errors
                );

            }
            else {

                alert(
                    error.response?.data?.message ||
                    "Unable to update course."
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
            <div className="min-h-[400px] flex items-center justify-center">

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

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading course...
                    </p>

                </div>

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <div className="max-w-5xl mx-auto space-y-6">


            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex items-center gap-4">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/fees/courses")
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
                    "
                >
                    <FaBook className="text-[#FFD963] text-xl" />
                </div>


                <div>

                    <h1 className="text-2xl font-bold text-[#610e1e]">
                        Edit Course
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Update course information
                    </p>

                </div>

            </div>


            {/* =========================================================
                ERROR
            ========================================================= */}

            {error && (

                <div
                    className="
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        px-4
                        py-3
                        rounded-lg
                    "
                >
                    {error}
                </div>

            )}


            {/* =========================================================
                FORM
            ========================================================= */}

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    rounded-xl
                    shadow-sm
                    border
                    border-gray-200
                    overflow-hidden
                "
            >


                {/* =====================================================
                    COURSE INFORMATION
                ===================================================== */}

                <div className="p-6 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-gray-800">
                        Course Information
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Update the basic details of the course.
                    </p>

                </div>


                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Title */}

                    <div className="md:col-span-2">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                            Course Title
                            <span className="text-red-500 ml-1">
                                *
                            </span>

                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            className={`
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                ${
                                    errors.title
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            `}
                        />

                        {errors.title && (

                            <p className="text-sm text-red-500 mt-1">
                                {Array.isArray(errors.title)
                                    ? errors.title[0]
                                    : errors.title}
                            </p>

                        )}

                    </div>


                    {/* Subtitle */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subtitle
                        </label>

                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="Enter course subtitle"
                            className="
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                border-gray-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            "
                        />

                    </div>


                    {/* Slug */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                            Slug
                            <span className="text-red-500 ml-1">
                                *
                            </span>

                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="course-slug"
                            className={`
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                ${
                                    errors.slug
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            `}
                        />

                        {errors.slug && (

                            <p className="text-sm text-red-500 mt-1">
                                {Array.isArray(errors.slug)
                                    ? errors.slug[0]
                                    : errors.slug}
                            </p>

                        )}

                    </div>


                    {/* Icon */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Icon Class
                        </label>

                        <input
                            type="text"
                            name="icon_class"
                            value={formData.icon_class}
                            onChange={handleChange}
                            placeholder="school"
                            className="
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                border-gray-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            "
                        />

                    </div>


                    {/* Order */}

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Display Order
                        </label>

                        <input
                            type="number"
                            name="order_number"
                            min="0"
                            value={formData.order_number}
                            onChange={handleChange}
                            className={`
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                ${
                                    errors.order_number
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            `}
                        />

                        {errors.order_number && (

                            <p className="text-sm text-red-500 mt-1">
                                {Array.isArray(errors.order_number)
                                    ? errors.order_number[0]
                                    : errors.order_number}
                            </p>

                        )}

                    </div>


                    {/* Description */}

                    <div className="md:col-span-2">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Enter course description"
                            className="
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                border
                                border-gray-300
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
                    FEATURES
                ===================================================== */}

                <div className="p-6 border-t border-b border-gray-200">

                    <h2 className="text-lg font-bold text-gray-800">
                        Course Features
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 mb-4">
                        Update the features included in this course.
                    </p>


                    <div className="flex gap-3">

                        <input
                            type="text"
                            value={featureInput}
                            onChange={(e) =>
                                setFeatureInput(
                                    e.target.value
                                )
                            }
                            onKeyDown={handleFeatureKeyDown}
                            placeholder="Enter a feature"
                            className="
                                flex-1
                                px-4
                                py-3
                                rounded-lg
                                border
                                border-gray-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#610e1e]/20
                                focus:border-[#610e1e]
                            "
                        />

                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="
                                px-5
                                py-3
                                rounded-lg
                                bg-[#610e1e]
                                text-white
                                flex
                                items-center
                                gap-2
                                font-semibold
                                hover:bg-[#4d0b18]
                                transition
                            "
                        >
                            <FaPlus />
                            Add
                        </button>

                    </div>


                    {formData.features.length > 0 && (

                        <div className="mt-4 space-y-2">

                            {formData.features.map(
                                (feature, index) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            bg-gray-50
                                            border
                                            border-gray-200
                                            rounded-lg
                                            px-4
                                            py-3
                                        "
                                    >

                                        <span className="text-sm text-gray-700">
                                            {feature}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveFeature(
                                                    index
                                                )
                                            }
                                            className="
                                                text-red-500
                                                hover:text-red-700
                                                transition
                                            "
                                            title="Remove feature"
                                        >
                                            <FaTrash />
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =====================================================
                    STATUS
                ===================================================== */}

                <div className="p-6 border-b border-gray-200">

                    <label className="flex items-center gap-3 cursor-pointer">

                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_active:
                                        e.target.checked,
                                }))
                            }
                            className="
                                w-5
                                h-5
                                accent-[#610e1e]
                                cursor-pointer
                            "
                        />

                        <div>

                            <p className="font-semibold text-gray-800">
                                Active Course
                            </p>

                            <p className="text-sm text-gray-500">
                                Make this course available for use.
                            </p>

                        </div>

                    </label>

                </div>


                {/* =====================================================
                    ACTIONS
                ===================================================== */}

                <div className="p-6 bg-gray-50 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/fees/courses")
                        }
                        disabled={saving}
                        className="
                            px-5
                            py-3
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-gray-700
                            font-semibold
                            hover:bg-gray-100
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
                            px-6
                            py-3
                            rounded-lg
                            bg-[#610e1e]
                            text-white
                            font-semibold
                            flex
                            items-center
                            gap-2
                            hover:bg-[#4d0b18]
                            transition
                            disabled:opacity-50
                        "
                    >

                        <FaSave />

                        {saving
                            ? "Updating..."
                            : "Update Course"
                        }

                    </button>

                </div>

            </form>

        </div>
    );
}