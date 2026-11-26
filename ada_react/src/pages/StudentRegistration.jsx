import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getRegistrationDropdowns,
    getSectionsByClass,
    submitStudentRegistration,
} from "../services/studentRegistrationService";

const DEFAULT_ADVANCE_AMOUNT = 5000;

const PAYMENT_MODES = [
    "Cash",
    "UPI",
    "Bank Transfer",
    "Cheque",
    "Card",
    "Online",
];

const GENDERS = ["Male", "Female", "Other"];

const ADMISSION_TYPES = ["New Admission", "Re-Admission", "Transfer"];

const BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

const CATEGORIES = [
    "General",
    "OBC",
    "SC",
    "ST",
    "NT",
    "VJ",
    "SBC",
    "Other",
];

const RELIGIONS = [
    "Hindu",
    "Muslim",
    "Christian",
    "Sikh",
    "Buddhist",
    "Jain",
    "Parsi",
    "Other",
];

export default function StudentRegistration() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCourse = searchParams.get("course");

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    const [errors, setErrors] = useState({});

    const [courses, setCourses] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [formData, setFormData] = useState({
        course_id: preselectedCourse || "",
        academic_year_id: "",
        class_id: "",
        section_id: "",
        admission_date: new Date().toISOString().split("T")[0],
        admission_type: "New Admission",

        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        dob: "",

        blood_group: "",
        category: "",
        caste: "",
        religion: "",
        nationality: "Indian",
        mother_tongue: "",
        birth_place: "",

        aadhaar_number: "",
        apaar_id: "",
        pen_number: "",

        previous_school: "",

        transport_required: false,
        hostel_required: false,

        photo: null,

        father_name: "",
        father_mobile: "",
        father_email: "",
        mother_name: "",
        mother_mobile: "",

        address: "",
        city: "",
        state: "",
        pincode: "",

        remarks: "",

        advance_amount: DEFAULT_ADVANCE_AMOUNT,
        payment_mode: "UPI",
        transaction_reference: "",
        payment_remarks: "Registration Token / Advance Payment",
    });

    useEffect(() => {
        loadDropdowns();
    }, []);

    useEffect(() => {
        if (formData.class_id) {
            loadSections(formData.class_id);
        } else {
            setSections([]);
        }
    }, [formData.class_id]);

    const loadDropdowns = async () => {
        setLoading(true);
        try {
            const data = await getRegistrationDropdowns();
            if (data.success) {
                setCourses(data.courses || []);
                setAcademicYears(data.academicYears || []);
                setClasses(data.classes || []);

                if (!formData.academic_year_id && data.academicYears?.length) {
                    const latest = data.academicYears[data.academicYears.length - 1];
                    setFormData((p) => ({ ...p, academic_year_id: latest.id }));
                }
            }
        } catch (err) {
            console.error("Failed to load dropdowns", err);
        } finally {
            setLoading(false);
        }
    };

    const loadSections = async (classId) => {
        try {
            const data = await getSectionsByClass(classId);
            if (data.success) {
                setSections(data.data || []);
            }
        } catch (err) {
            console.error("Failed to load sections", err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] || null });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.course_id) newErrors.course_id = "Select a course";
        if (!formData.academic_year_id) newErrors.academic_year_id = "Select academic year";
        if (!formData.class_id) newErrors.class_id = "Select class";
        if (!formData.admission_date) newErrors.admission_date = "Select admission date";
        if (!formData.admission_type) newErrors.admission_type = "Select admission type";

        if (!formData.first_name.trim()) newErrors.first_name = "First name required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name required";
        if (!formData.gender) newErrors.gender = "Select gender";
        if (!formData.dob) newErrors.dob = "Select date of birth";

        if (!formData.father_name.trim()) newErrors.father_name = "Father's name required";
        if (!formData.father_mobile.trim()) {
            newErrors.father_mobile = "Father's mobile required";
        } else if (!/^[0-9]{10}$/.test(formData.father_mobile.replace(/\D/g, ""))) {
            newErrors.father_mobile = "Enter a valid 10-digit mobile number";
        }

        if (formData.father_email && !/\S+@\S+\.\S+/.test(formData.father_email)) {
            newErrors.father_email = "Enter a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (formData.advance_amount === "" || formData.advance_amount === null || formData.advance_amount === undefined) {
            newErrors.advance_amount = "Enter advance amount";
        } else if (Number(formData.advance_amount) < 0) {
            newErrors.advance_amount = "Amount cannot be negative";
        }

        if (!formData.payment_mode) newErrors.payment_mode = "Select payment mode";

        if (
            formData.payment_mode !== "Cash" &&
            !formData.transaction_reference.trim()
        ) {
            newErrors.transaction_reference =
                "Enter transaction reference for non-cash payments";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        setStep(1);
        setErrors({});
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setSubmitting(true);
        try {
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value === null || value === undefined || value === "") return;
                if (key === "photo") {
                    if (value) payload.append(key, value);
                } else if (typeof value === "boolean") {
                    payload.append(key, value ? 1 : 0);
                } else {
                    payload.append(key, value);
                }
            });

            const data = await submitStudentRegistration(payload);
            if (data.success) {
                setSubmitted(data.data);
                setStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setErrors(data.errors || { submit: data.message || "Registration failed" });
            }
        } catch (err) {
            const errs = err.response?.data?.errors || {};
            if (!Object.keys(errs).length) {
                errs.submit =
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong. Please try again.";
            }
            setErrors(errs);
        } finally {
            setSubmitting(false);
        }
    };

    const studentFullName = [
        formData.first_name,
        formData.middle_name,
        formData.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    const selectedCourse = courses.find((c) => c.id === Number(formData.course_id));
    const selectedClass = classes.find((c) => c.id === Number(formData.class_id));
    const selectedSection = sections.find((s) => s.id === Number(formData.section_id));
    const selectedAY = academicYears.find(
        (y) => y.id === Number(formData.academic_year_id)
    );

    const stepIndicator = (n) => (
        <div className="flex items-center justify-center gap-2">
            {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                            n >= s
                                ? "bg-[#FFD963] text-primary shadow-lg shadow-[#FFD963]/40"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                        {n > s ? "✓" : s}
                    </div>
                    {s < 2 && (
                        <div
                            className={`w-16 md:w-28 h-1 mx-2 rounded-full transition-all duration-500 ${
                                n > s ? "bg-[#FFD963]" : "bg-gray-200"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const inputCls = (field) =>
        `w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all ${
            errors[field] ? "ring-2 ring-red-500" : ""
        }`;

    const labelCls =
        "block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3";

    const errCls = "text-red-500 text-xs mt-2 font-bold";

    if (submitted && step === 3) {
        return (
            <section className="relative pt-48 pb-24 px-6 md:px-12 bg-[#faf8f4] min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#6b1023] via-[#FFD963] to-[#6b1023]"></div>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-10 shadow-2xl shadow-green-500/40"
                        >
                            ✓
                        </motion.div>

                        <h1 className="font-heading font-black text-4xl md:text-5xl text-primary mb-4">
                            Registration Successful!
                        </h1>
                        <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                            Thank you for registering at SSB Guide Aaryans Defence School. Your
                            application has been received along with the registration token.
                        </p>

                        <div className="bg-gradient-to-br from-primary/5 via-[#FFD963]/10 to-primary/5 rounded-3xl p-8 mb-10 text-left space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-5 shadow-sm">
                                    <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                        Student Name
                                    </p>
                                    <p className="font-bold text-xl text-primary">
                                        {submitted.student?.full_name || studentFullName}
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm">
                                    <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                        Admission No.
                                    </p>
                                    <p className="font-bold text-xl text-[#6b1023]">
                                        {submitted.admission_no}
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm">
                                    <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                        Student Code
                                    </p>
                                    <p className="font-bold text-xl text-primary">
                                        {submitted.student_code}
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm">
                                    <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                        Token Amount Paid
                                    </p>
                                    <p className="font-bold text-xl text-green-600">
                                        ₹ {Number(submitted.student?.advance_amount_paid || formData.advance_amount).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#FFD963]/15 border-2 border-[#FFD963] rounded-2xl p-6 mb-12">
                            <p className="font-bold text-primary mb-2">Important Note</p>
                            <p className="text-primary/80 text-sm leading-relaxed">
                                The advance token amount of ₹{" "}
                                {Number(formData.advance_amount).toLocaleString("en-IN")} will be
                                adjusted (deducted) from your total payable fees at the time of
                                final admission. Please keep your admission number safe for future
                                reference.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/")}
                                className="bg-primary text-white px-10 py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FFD963] hover:text-primary transition-all shadow-xl"
                            >
                                Back to Home
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/contact")}
                                className="bg-white text-primary px-10 py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl border-2 border-primary"
                            >
                                Contact Admissions
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="relative pt-48 pb-16 px-6 md:px-12 bg-primary overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-[#FFD963] font-bold tracking-[0.2em] uppercase text-sm mb-4 inline-block"
                    >
                        Admissions Open {new Date().getFullYear()}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-heading font-black text-5xl md:text-7xl text-white mb-8"
                    >
                        Student <span className="text-[#FFD963]">Registration</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        Fill out your details — then proceed to pay the one-time registration
                        token, which will be adjusted against your total fees later.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-12"
                    >
                        {stepIndicator(step)}
                    </motion.div>
                </motion.div>
            </section>

            <section className="py-16 px-6 md:px-12 bg-[#faf8f4]">
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ duration: 0.5 }}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}
                                className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD963] opacity-10 rounded-bl-full"></div>

                                <h2 className="font-heading font-bold text-3xl text-primary mb-2">
                                    Step 1 : Student &amp; Parent Details
                                </h2>
                                <p className="text-gray-500 text-sm mb-12">
                                    All fields marked * are required.
                                </p>

                                {errors.submit && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl mb-10 font-semibold">
                                        {errors.submit}
                                    </div>
                                )}

                                <div className="space-y-12">
                                    <div>
                                        <h3 className="font-bold text-xl text-[#6b1023] mb-6 pb-3 border-b-2 border-[#FFD963]/40">
                                            🎓 Academic Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={labelCls}>Course *</label>
                                                <select
                                                    name="course_id"
                                                    value={formData.course_id}
                                                    onChange={handleChange}
                                                    className={inputCls("course_id")}
                                                >
                                                    <option value="">Select Course...</option>
                                                    {courses.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.course_id && <p className={errCls}>{errors.course_id}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Academic Year *</label>
                                                <select
                                                    name="academic_year_id"
                                                    value={formData.academic_year_id}
                                                    onChange={handleChange}
                                                    className={inputCls("academic_year_id")}
                                                >
                                                    <option value="">Select Year...</option>
                                                    {academicYears.map((y) => (
                                                        <option key={y.id} value={y.id}>
                                                            {y.academic_year}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.academic_year_id && <p className={errCls}>{errors.academic_year_id}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Class *</label>
                                                <select
                                                    name="class_id"
                                                    value={formData.class_id}
                                                    onChange={handleChange}
                                                    className={inputCls("class_id")}
                                                >
                                                    <option value="">Select Class...</option>
                                                    {classes.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.class_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.class_id && <p className={errCls}>{errors.class_id}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Section</label>
                                                <select
                                                    name="section_id"
                                                    value={formData.section_id}
                                                    onChange={handleChange}
                                                    disabled={!formData.class_id || sections.length === 0}
                                                    className={inputCls("section_id") + " disabled:opacity-50"}
                                                >
                                                    <option value="">
                                                        {!formData.class_id
                                                            ? "Select class first"
                                                            : sections.length === 0
                                                            ? "No sections available"
                                                            : "Select section..."}
                                                    </option>
                                                    {sections.map((s) => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.section_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Admission Date *</label>
                                                <input
                                                    type="date"
                                                    name="admission_date"
                                                    value={formData.admission_date}
                                                    onChange={handleChange}
                                                    className={inputCls("admission_date")}
                                                />
                                                {errors.admission_date && <p className={errCls}>{errors.admission_date}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Admission Type *</label>
                                                <select
                                                    name="admission_type"
                                                    value={formData.admission_type}
                                                    onChange={handleChange}
                                                    className={inputCls("admission_type")}
                                                >
                                                    {ADMISSION_TYPES.map((t) => (
                                                        <option key={t} value={t}>
                                                            {t}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.admission_type && <p className={errCls}>{errors.admission_type}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-xl text-[#6b1023] mb-6 pb-3 border-b-2 border-[#FFD963]/40">
                                            👤 Student Personal Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={labelCls}>First Name *</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    placeholder="Aaryan"
                                                    className={inputCls("first_name")}
                                                />
                                                {errors.first_name && <p className={errCls}>{errors.first_name}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Middle Name</label>
                                                <input
                                                    type="text"
                                                    name="middle_name"
                                                    value={formData.middle_name}
                                                    onChange={handleChange}
                                                    placeholder="(optional)"
                                                    className={inputCls("middle_name")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Last Name *</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    placeholder="Singh"
                                                    className={inputCls("last_name")}
                                                />
                                                {errors.last_name && <p className={errCls}>{errors.last_name}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Gender *</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className={inputCls("gender")}
                                                >
                                                    <option value="">Select...</option>
                                                    {GENDERS.map((g) => (
                                                        <option key={g} value={g}>
                                                            {g}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.gender && <p className={errCls}>{errors.gender}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Date of Birth *</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    className={inputCls("dob")}
                                                />
                                                {errors.dob && <p className={errCls}>{errors.dob}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Blood Group</label>
                                                <select
                                                    name="blood_group"
                                                    value={formData.blood_group}
                                                    onChange={handleChange}
                                                    className={inputCls("blood_group")}
                                                >
                                                    <option value="">Select...</option>
                                                    {BLOOD_GROUPS.map((b) => (
                                                        <option key={b} value={b}>
                                                            {b}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className={inputCls("category")}
                                                >
                                                    <option value="">Select...</option>
                                                    {CATEGORIES.map((c) => (
                                                        <option key={c} value={c}>
                                                            {c}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Caste</label>
                                                <input
                                                    type="text"
                                                    name="caste"
                                                    value={formData.caste}
                                                    onChange={handleChange}
                                                    className={inputCls("caste")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Religion</label>
                                                <select
                                                    name="religion"
                                                    value={formData.religion}
                                                    onChange={handleChange}
                                                    className={inputCls("religion")}
                                                >
                                                    <option value="">Select...</option>
                                                    {RELIGIONS.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Nationality</label>
                                                <input
                                                    type="text"
                                                    name="nationality"
                                                    value={formData.nationality}
                                                    onChange={handleChange}
                                                    className={inputCls("nationality")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Mother Tongue</label>
                                                <input
                                                    type="text"
                                                    name="mother_tongue"
                                                    value={formData.mother_tongue}
                                                    onChange={handleChange}
                                                    className={inputCls("mother_tongue")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Place of Birth</label>
                                                <input
                                                    type="text"
                                                    name="birth_place"
                                                    value={formData.birth_place}
                                                    onChange={handleChange}
                                                    className={inputCls("birth_place")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Aadhaar No.</label>
                                                <input
                                                    type="text"
                                                    name="aadhaar_number"
                                                    value={formData.aadhaar_number}
                                                    onChange={handleChange}
                                                    placeholder="12-digit Aadhaar"
                                                    className={inputCls("aadhaar_number")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>APAAR ID</label>
                                                <input
                                                    type="text"
                                                    name="apaar_id"
                                                    value={formData.apaar_id}
                                                    onChange={handleChange}
                                                    className={inputCls("apaar_id")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}> PEN Number</label>
                                                <input
                                                    type="text"
                                                    name="pen_number"
                                                    value={formData.pen_number}
                                                    onChange={handleChange}
                                                    className={inputCls("pen_number")}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelCls}>Previous School</label>
                                                <input
                                                    type="text"
                                                    name="previous_school"
                                                    value={formData.previous_school}
                                                    onChange={handleChange}
                                                    placeholder="Name of previous school / college"
                                                    className={inputCls("previous_school")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Student Photo</label>
                                                <input
                                                    type="file"
                                                    name="photo"
                                                    accept="image/*"
                                                    onChange={handleChange}
                                                    className={inputCls("photo") + " text-sm py-3"}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Max 2MB · JPG / PNG
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 items-end">
                                                <label className="flex items-start gap-3 bg-[#faf8f4] rounded-xl p-4 cursor-pointer hover:bg-[#FFD963]/10 transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="transport_required"
                                                        checked={formData.transport_required}
                                                        onChange={handleChange}
                                                        className="mt-1 w-5 h-5 accent-[#FFD963]"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-sm text-primary">
                                                            🚌 Transport
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Required?
                                                        </p>
                                                    </div>
                                                </label>
                                                <label className="flex items-start gap-3 bg-[#faf8f4] rounded-xl p-4 cursor-pointer hover:bg-[#FFD963]/10 transition-all">
                                                    <input
                                                        type="checkbox"
                                                        name="hostel_required"
                                                        checked={formData.hostel_required}
                                                        onChange={handleChange}
                                                        className="mt-1 w-5 h-5 accent-[#FFD963]"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-sm text-primary">
                                                            🏠 Hostel
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Required?
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-xl text-[#6b1023] mb-6 pb-3 border-b-2 border-[#FFD963]/40">
                                            👨‍👩‍👦 Parent / Guardian Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={labelCls}>Father's Name *</label>
                                                <input
                                                    type="text"
                                                    name="father_name"
                                                    value={formData.father_name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Rajesh Kumar Singh"
                                                    className={inputCls("father_name")}
                                                />
                                                {errors.father_name && <p className={errCls}>{errors.father_name}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Father's Mobile *</label>
                                                <input
                                                    type="tel"
                                                    name="father_mobile"
                                                    value={formData.father_mobile}
                                                    onChange={handleChange}
                                                    placeholder="10-digit mobile"
                                                    className={inputCls("father_mobile")}
                                                />
                                                {errors.father_mobile && <p className={errCls}>{errors.father_mobile}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Father's Email</label>
                                                <input
                                                    type="email"
                                                    name="father_email"
                                                    value={formData.father_email}
                                                    onChange={handleChange}
                                                    placeholder="parent@email.com"
                                                    className={inputCls("father_email")}
                                                />
                                                {errors.father_email && <p className={errCls}>{errors.father_email}</p>}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Mother's Name</label>
                                                <input
                                                    type="text"
                                                    name="mother_name"
                                                    value={formData.mother_name}
                                                    onChange={handleChange}
                                                    className={inputCls("mother_name")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Mother's Mobile</label>
                                                <input
                                                    type="tel"
                                                    name="mother_mobile"
                                                    value={formData.mother_mobile}
                                                    onChange={handleChange}
                                                    placeholder="(optional)"
                                                    className={inputCls("mother_mobile")}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelCls}>Residential Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="House no., Street, Locality..."
                                                    className={inputCls("address")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={inputCls("city")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className={inputCls("state")}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Pincode</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    placeholder="6-digit pincode"
                                                    className={inputCls("pincode")}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={labelCls}>Any Remarks (Optional)</label>
                                                <textarea
                                                    name="remarks"
                                                    rows="3"
                                                    value={formData.remarks}
                                                    onChange={handleChange}
                                                    placeholder="Medical concerns, special needs, etc."
                                                    className={inputCls("remarks") + " resize-none"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-14 flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-white px-12 py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FFD963] hover:text-primary transition-all shadow-xl disabled:opacity-60"
                                    >
                                        Proceed to Payment →
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.5 }}
                                onSubmit={handleSubmit}
                                className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-40 h-40 bg-[#FFD963] opacity-10 rounded-br-full"></div>

                                <h2 className="font-heading font-bold text-3xl text-primary mb-2">
                                    Step 2 : Registration Token (Advance Payment)
                                </h2>
                                <p className="text-gray-500 text-sm mb-10">
                                    This amount will be deducted from your total payable fees.
                                </p>

                                <div className="bg-gradient-to-br from-primary/5 via-[#FFD963]/15 to-primary/5 rounded-3xl p-6 md:p-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                            Student
                                        </p>
                                        <p className="font-bold text-lg text-primary truncate">
                                            {studentFullName || "(not provided)"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                            Course
                                        </p>
                                        <p className="font-bold text-lg text-primary truncate">
                                            {selectedCourse?.title || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                            Class
                                        </p>
                                        <p className="font-bold text-lg text-primary truncate">
                                            {[
                                                selectedClass?.class_name,
                                                selectedSection?.section_name && `- ${selectedSection.section_name}`,
                                            ]
                                                .filter(Boolean)
                                                .join(" ") || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-primary/50 uppercase tracking-[0.2em] text-[10px] font-black mb-2">
                                            Academic Year
                                        </p>
                                        <p className="font-bold text-lg text-primary truncate">
                                            {selectedAY?.academic_year || "-"}
                                        </p>
                                    </div>
                                </div>

                                {errors.submit && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl mb-10 font-semibold">
                                        {errors.submit}
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div>
                                        <label className={labelCls}>
                                            Token / Advance Amount (₹) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary/40">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                name="advance_amount"
                                                min="0"
                                                step="1"
                                                value={formData.advance_amount}
                                                onChange={handleChange}
                                                className={inputCls("advance_amount") + " pl-14 text-2xl font-bold"}
                                                placeholder="5000"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Suggested amount ₹ {DEFAULT_ADVANCE_AMOUNT.toLocaleString("en-IN")}. You
                                            may enter ₹ 0 if you prefer to pay in person.
                                        </p>
                                        {errors.advance_amount && <p className={errCls}>{errors.advance_amount}</p>}
                                    </div>

                                    <div>
                                        <label className={labelCls}>Payment Mode *</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {PAYMENT_MODES.map((mode) => (
                                                <label
                                                    key={mode}
                                                    className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all text-center ${
                                                        formData.payment_mode === mode
                                                            ? "border-[#FFD963] bg-[#FFD963]/10 shadow-lg shadow-[#FFD963]/20"
                                                            : "border-gray-200 bg-[#faf8f4] hover:border-primary/30"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_mode"
                                                        value={mode}
                                                        checked={formData.payment_mode === mode}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <div className="text-3xl mb-2">
                                                        {mode === "Cash"
                                                            ? "💵"
                                                            : mode === "UPI"
                                                            ? "📱"
                                                            : mode === "Bank Transfer"
                                                            ? "🏦"
                                                            : mode === "Cheque"
                                                            ? "🧾"
                                                            : mode === "Card"
                                                            ? "💳"
                                                            : "🌐"}
                                                    </div>
                                                    <p className="font-bold text-sm text-primary">
                                                        {mode}
                                                    </p>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.payment_mode && <p className={errCls + " mt-4"}>{errors.payment_mode}</p>}
                                    </div>

                                    <div>
                                        <label className={labelCls}>
                                            Transaction Reference
                                            {formData.payment_mode !== "Cash" && " *"}
                                        </label>
                                        <input
                                            type="text"
                                            name="transaction_reference"
                                            value={formData.transaction_reference}
                                            onChange={handleChange}
                                            placeholder={
                                                formData.payment_mode === "Cash"
                                                    ? "(optional — receipt no. if any)"
                                                    : formData.payment_mode === "Cheque"
                                                    ? "Cheque number"
                                                    : formData.payment_mode === "UPI"
                                                    ? "UPI Transaction ID"
                                                    : "Transaction / Reference ID"
                                            }
                                            className={inputCls("transaction_reference")}
                                        />
                                        {errors.transaction_reference && (
                                            <p className={errCls}>{errors.transaction_reference}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelCls}>Payment Remarks</label>
                                        <textarea
                                            name="payment_remarks"
                                            rows="2"
                                            value={formData.payment_remarks}
                                            onChange={handleChange}
                                            className={inputCls("payment_remarks") + " resize-none"}
                                        />
                                    </div>
                                </div>

                                <div className="mt-14 flex flex-col md:flex-row justify-between gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleBack}
                                        className="bg-white text-primary px-10 py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-gray-100 transition-all shadow-lg border-2 border-primary/20"
                                    >
                                        ← Back
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-[#6b1023] via-[#8b1a35] to-[#6b1023] bg-[length:200%_100%] hover:bg-[position:100%_0] text-white px-12 py-5 rounded-xl font-bold uppercase tracking-[0.2em] transition-all shadow-2xl shadow-[#6b1023]/40 disabled:opacity-60"
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : `Complete Registration & Pay ₹ ${Number(formData.advance_amount || 0).toLocaleString("en-IN")}`}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}
