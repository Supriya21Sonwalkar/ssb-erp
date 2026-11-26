import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { submitEnquiry } from "../services/contactService";
import { useSearchParams } from "react-router-dom";



export default function Contact() {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        course_id: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);

    const selectedCourseId = searchParams.get("course");

    useEffect(() => {
    fetchCourses();
}, [selectedCourseId]);

const fetchCourses = async () => {

    try {

        const response = await fetch("http://localhost:8000/api/react/courses");

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

                }

            }

        }

    } catch (error) {

        console.error(error);

    }

};
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
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

            const data = await submitEnquiry(formData);

            if (data.success) {

                setSubmitted(true);

                setFormData({
                    full_name: "",
                    phone: "",
                    email: "",
                    course_id: selectedCourseId || "",
                    message: "",
                });

                setTimeout(() => setSubmitted(false), 5000);

            }

        } catch (error) {

            setErrors({
                submit: error.message || "Something went wrong."
            });

        }

    }

};

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-48 pb-24 px-6 md:px-12 bg-primary overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto text-center md:text-left relative z-10"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-[#FFD963] font-bold tracking-[0.2em] uppercase text-sm mb-4 inline-block"
                    >
                        Admissions Open
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-heading font-black text-5xl md:text-7xl text-white mb-8"
                    >
                        Talk to our <span className="text-[#FFD963]">admissions</span> team
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed"
                    >
                        Share your details — an advisor will call you back to discuss the right programme, timeline and fees. No pressure, only clarity.
                    </motion.p>
                </motion.div>
            </section>

            {/* Content Grid */}
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

                    {/* Right: Enquiry Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD963] opacity-10 rounded-bl-full"></div>

                        <h2 className="font-heading font-bold text-3xl text-primary mb-2">Enquiry Form</h2>
                        <p className="text-gray-500 text-sm mb-12">All fields marked * are required.</p>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border-2 border-green-200 text-green-700 p-8 rounded-2xl mb-12 flex items-center gap-6"
                            >
                                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shrink-0">✓</div>
                                <p className="font-bold text-lg">Thank you! Your enquiry has been submitted successfully.</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Full Name *</label>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Phone *</label>
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
                                        <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Email *</label>
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

                                <div>
                                    <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Select Course *</label>
                                    <select
                                        name="course_id"
                                        value={formData.course_id}
                                        onChange={handleChange}
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

                                <div>
                                    <label className="block text-primary/60 uppercase tracking-[0.2em] text-[10px] font-black mb-3">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Tell us about the cadet — class, age, goals..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-[#FFD963] transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-primary text-white py-6 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FFD963] hover:text-primary transition-all shadow-xl group"
                            >
                                SEND ENQUIRY
                                <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">✈️</span>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}