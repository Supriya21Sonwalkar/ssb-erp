import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { submitBooking } from "../services/bookingService";
import { useSearchParams } from "react-router-dom";

export default function Booking() {
    const [formData, setFormData] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "",
        father_name: "",
        mother_name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        course_id: "",
        message: "",
    });

    const [courses, setCourses] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedFees, setSelectedFees] = useState(null);
    const [showFees, setShowFees] = useState(false);
    const [searchParams] = useSearchParams();

    const selectedCourseId = searchParams.get("course");

    // Fetch courses on component mount
   useEffect(() => {
        fetchCourses();
    }, [selectedCourseId]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/react/courses');
            const data = await response.json();
            if (data.status) {

    setCourses(data.courses);

    // Auto-select course from URL
    if (selectedCourseId) {

        const selectedCourse = data.courses.find(
            course => course.id === Number(selectedCourseId)
        );

        if (selectedCourse) {

            setFormData(prev => ({
                ...prev,
                course_id: selectedCourse.id
            }));

            if (selectedCourse.fees) {
                setSelectedFees(selectedCourse.fees);
                setShowFees(true);
            }

        }

    }

}
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }
        
        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!formData.course_id) {
            newErrors.course_id = "Please select a course";
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            try {
                const data = await submitBooking(formData);
                
                if (data.success) {
                    setSubmitted(true);
                    setFormData({
                        full_name: "",
                        date_of_birth: "",
                        gender: "",
                        father_name: "",
                        mother_name: "",
                        phone: "",
                        email: "",
                        address: "",
                        city: "",
                        state: "",
                        course_id: "",
                        message: "",
                    });
                    setSelectedFees(null);
                    setShowFees(false);
                    setTimeout(() => setSubmitted(false), 5000);
                } else {
                    setErrors({ submit: data.message || 'Unable to submit booking. Please try again.' });
                }
            } catch (error) {
                setErrors({ submit: error.message || 'Network error. Please check your connection and try again.' });
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setFormData({ ...formData, course_id: courseId });
        
        const selectedCourse = courses.find(c => c.id === parseInt(courseId));
        if (selectedCourse && selectedCourse.fees) {
            setSelectedFees(selectedCourse.fees);
            setShowFees(true);
        } else {
            setSelectedFees(null);
            setShowFees(false);
        }
    };

    const handlePayment = () => {
        if (!selectedFees) {
            alert('Please select a course first to proceed with payment.');
            return;
        }
        const selectedCourse = courses.find(c => c.id === parseInt(formData.course_id));
        const formattedFees = new Intl.NumberFormat('en-IN').format(parseFloat(selectedFees));
        alert(`Redirecting to payment gateway for:\n${selectedCourse?.title}\nAmount: ₹${formattedFees}`);
        // TODO: Integrate with Razorpay / PayU / Cashfree etc.
    };

    const formatFees = (fees) => {
        if (!fees) return '—';
        return '₹' + new Intl.NumberFormat('en-IN').format(parseFloat(fees));
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-48 pb-24 px-6 md:px-12 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD963] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFD963] rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                </div>
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
                        Secure Your Future
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-heading font-black text-5xl md:text-7xl text-white mb-8"
                    >
                        Book <span className="text-[#FFD963]">Your Seat</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Fill in the details below to reserve your seat. Our admissions team will confirm your booking within 24 hours.
                    </motion.p>
                </motion.div>
            </section>

            {/* Booking Form Section */}
            <section className="py-24 px-6 md:px-12 bg-[#faf8f4]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="font-heading font-bold text-3xl text-primary mb-10">Reach the Academy</h2>
                            <div className="space-y-8">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg">📞</div>
                                    <div>
                                        <p className="text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Phone</p>
                                        <a href="tel:+919823456789" className="text-2xl font-bold text-primary hover:text-[#FFD963] transition-colors">+91 98234 56789</a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg">✉️</div>
                                    <div>
                                        <p className="text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Email</p>
                                        <a href="mailto:admissions@aaryansdefence.in" className="text-2xl font-bold text-primary hover:text-[#FFD963] transition-colors break-all">admissions@aaryansdefence.in</a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg">📍</div>
                                    <div>
                                        <p className="text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-1">Branches</p>
                                        <p className="text-2xl font-bold text-primary">Pune (HQ) · Ambaba · Delhi NCR</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-[#FFD963] rounded-3xl p-10 shadow-xl"
                        >
                            <h3 className="font-bold text-2xl text-primary mb-4">Ready to join SSB Guide Aaryans Defence School?</h3>
                            <p className="text-primary/70 mb-8 font-medium">Talk to our admissions team today — and take your Pratham Pag towards the uniform.</p>
                            <div className="flex flex-wrap gap-4">
                                <a href="tel:+919823456789" className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-2 shadow-lg">
                                    📞 CALL NOW
                                </a>
                                <a href="https://wa.me/919823456789" target="_blank" rel="noreferrer" className="bg-white text-primary px-8 py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-lg">
                                    💬 CHAT ON WHATSAPP
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="rounded-3xl overflow-hidden shadow-2xl h-80 grayscale hover:grayscale-0 transition-all duration-700"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04360341777!2d73.78056637373859!3d18.524870607310534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43105d951336!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714476000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </motion.div>
                    </motion.div>

                    {/* Right: Booking Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD963] opacity-10 rounded-bl-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-28 h-28 bg-primary opacity-5 rounded-tr-full pointer-events-none"></div>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border-2 border-green-200 text-green-700 p-8 rounded-2xl mb-12 flex items-center gap-6"
                            >
                                <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shrink-0">✓</div>
                                <div>
                                    <p className="font-black text-lg mb-1">Booking Received!</p>
                                    <p className="text-green-600 font-medium">Your seat has been booked! Our team will contact you within 24 hours to confirm.</p>
                                </div>
                            </motion.div>
                        )}

                        {errors.submit && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-2 border-red-200 text-red-700 p-8 rounded-2xl mb-12 flex items-center gap-6"
                            >
                                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl shrink-0">✕</div>
                                <p className="font-bold text-lg">{errors.submit}</p>
                            </motion.div>
                        )}

                        <h2 className="font-heading font-bold text-3xl text-primary mb-2">Admission Booking Form</h2>
                        <p className="text-gray-500 text-sm mb-12">All fields marked <span className="text-red-500 font-bold">*</span> are required.</p>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Section 1: Cadet Info */}
                            <div>
                                <h3 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-l-4 border-[#FFD963] pl-4 mb-6">Cadet Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            required
                                            placeholder="Aaryan Singh"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all ${errors.full_name ? 'ring-2 ring-red-500' : ''}`}
                                        />
                                        {errors.full_name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.full_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Gender <span className="text-red-500">*</span></label>
                                        <select
                                            name="gender"
                                            required
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all appearance-none cursor-pointer ${errors.gender ? 'ring-2 ring-red-500' : ''}`}
                                        >
                                            <option value="">Select gender...</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-xs mt-2 font-bold">{errors.gender}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Parent / Guardian */}
                            <div>
                                <h3 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-l-4 border-[#FFD963] pl-4 mb-6">Parent / Guardian Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Father's Name</label>
                                        <input
                                            type="text"
                                            name="father_name"
                                            placeholder="Rajendra Singh"
                                            value={formData.father_name}
                                            onChange={handleChange}
                                            className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Mother's Name</label>
                                        <input
                                            type="text"
                                            name="mother_name"
                                            placeholder="Sunita Singh"
                                            value={formData.mother_name}
                                            onChange={handleChange}
                                            className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Contact */}
                            <div>
                                <h3 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-l-4 border-[#FFD963] pl-4 mb-6">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Phone <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            placeholder="+91 98234 56789"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-2 font-bold">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Address */}
                            <div>
                                <h3 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-l-4 border-[#FFD963] pl-4 mb-6">Address</h3>
                                <div className="grid grid-cols-1 gap-8">
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="123 Defence Colony, Sector 5"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="Pune"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                placeholder="Maharashtra"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Course & Fees */}
                            <div>
                                <h3 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-l-4 border-[#FFD963] pl-4 mb-6">Course & Fees</h3>
                                <div className="grid grid-cols-1 gap-8">
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Select Course <span className="text-red-500">*</span></label>
                                        <select
                                            name="course_id"
                                            required
                                            value={formData.course_id}
                                            onChange={handleCourseChange}
                                            className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all appearance-none cursor-pointer ${errors.course_id ? 'ring-2 ring-red-500' : ''}`}
                                        >
                                            <option value="">Choose a programme...</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && <p className="text-red-500 text-xs mt-2 font-bold">{errors.course_id}</p>}
                                    </div>

                                    {/* Auto-populated Fees display */}
                                    {showFees && (
                                        <div className="flex items-center gap-5 bg-[#FFD963]/10 border-2 border-[#FFD963]/40 rounded-xl px-6 py-5">
                                            <div className="w-12 h-12 bg-[#FFD963] rounded-xl flex items-center justify-center text-primary text-xl font-black shrink-0 shadow-md">₹</div>
                                            <div className="flex-1">
                                                <p className="text-primary/50 text-[10px] uppercase tracking-[0.2em] font-black mb-0.5">Total Fees</p>
                                                <p className="text-primary font-black text-2xl tracking-tight">{formatFees(selectedFees)}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handlePayment}
                                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-green-500 transition-all shadow-lg flex items-center gap-2 group"
                                            >
                                                <span className="text-base group-hover:scale-110 transition-transform">💳</span>
                                                PAY NOW
                                            </button>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Additional Message</label>
                                        <textarea
                                            name="message"
                                            rows="3"
                                            placeholder="Tell us about the cadet — current class, goals, any questions..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-primary text-white py-6 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FFD963] hover:text-primary transition-all shadow-xl group text-lg"
                            >
                                CONFIRM BOOKING
                                <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">🎯</span>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
