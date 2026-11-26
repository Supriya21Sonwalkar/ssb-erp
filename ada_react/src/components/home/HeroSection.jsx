import { motion } from "framer-motion";
import heroVideo from "../../assets/videos/hero.mp4";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";



export default function HeroSection() {

    const videoRef = useRef(null);
    useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.65;
    }
}, []);

return (
    <section className="relative min-h-screen overflow-hidden bg-[#610e1e]">

        {/* Background Video */}
        <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
        >
            <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Animated Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#610e1e] via-[#610e1e]/70 to-[#610e1e]/40 animate-pulse"></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,217,99,0.15)_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(97,14,30,0.8)_0%,transparent_60%)] animate-pulse" style={{ animationDuration: '5s' }}></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#FFD963]/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#FFD963]/30 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-[#FFD963]/20 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#FFD963]/25 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-10 w-3 h-3 bg-[#FFD963]/35 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>

        {/* Decorative Lines */}
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FFD963]/20 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD963]/30 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>

        {/* Animated Corner Accents */}
        <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-[#FFD963]/30 rounded-tl-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-[#FFD963]/30 rounded-br-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>

{/* ERP Login Floating Button */}
<div className="fixed top-28 right-8 z-[9999]">
    <Link
        to="/login"
        className="group flex items-center overflow-hidden rounded-full border border-[#FFD963]/40 bg-[#610e1e]/90 backdrop-blur-md shadow-xl transition-all duration-300 hover:w-44 w-14 h-14"
    >
        {/* Icon */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center text-[#FFD963]">
           <FaUserShield size={28} />
        </div>

        {/* Text */}
        <span className="whitespace-nowrap text-white font-semibold opacity-0 translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            ERP Login
        </span>
    </Link>
</div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-24 pt-40 pb-24">
    <div className="max-w-4xl">

        {/* Badge */}
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFD963]/60 bg-[#610e1e]/30 px-5 py-2 backdrop-blur-md mb-8 shadow-lg shadow-[#FFD963]/20 hover:border-[#FFD963] hover:shadow-[#FFD963]/40 transition-all duration-300 cursor-pointer"
        >
            <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-2.5 w-2.5 rounded-full bg-[#FFD963]"
            ></motion.span>

            <span className="font-body text-[11px] md:text-xs font-bold uppercase tracking-[3px] text-[#FFD963] drop-shadow-lg">
                PRATHAM PAG · THE FIRST STEP
            </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-heading font-black leading-tight mb-8"
        >
            <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block text-white text-4xl md:text-6xl lg:text-7xl drop-shadow-2xl"
            >
                Prepare for
            </motion.span>

            <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block bg-gradient-to-r from-[#FFD963] via-[#FFE5A0] to-[#FFD963] bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl animate-gradient bg-[length:200%_auto] drop-shadow-lg"
            >
                NDA, SSB, CDS
            </motion.span>

            <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="block text-white text-4xl md:text-6xl lg:text-7xl drop-shadow-2xl"
            >
                & AFCAT
            </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl mb-10 font-body text-base md:text-lg leading-relaxed text-white/90 backdrop-blur-sm p-4 rounded-xl bg-white/5 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-[#FFD963]/10 transition-all duration-300"
        >
            SSB Guide Aaryans Defence School combines academic excellence,
            defence training and character development — building disciplined
            officers for a lifetime of service.
        </motion.p>

        {/* Buttons */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-5"
        >
            <button className="group relative rounded-xl bg-gradient-to-r from-[#FFD963] via-[#FFE5A0] to-[#FFD963] bg-[length:200%_100%] px-10 py-4 font-body text-sm font-bold uppercase tracking-[2px] text-[#610e1e] shadow-2xl shadow-[#FFD963]/30 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[#FFD963]/50 hover:-translate-y-1 active:translate-y-0 active:scale-95 overflow-hidden">
                <span className="relative z-10">VIEW COURSES →</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            <button className="group relative flex items-center gap-3 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 font-body text-sm font-bold uppercase tracking-[2px] text-white backdrop-blur-xl transition-all duration-500 hover:bg-white hover:text-[#610e1e] hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 active:scale-95 overflow-hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD963] to-[#FFE5A0] text-[#610e1e] transition-all duration-300 group-hover:from-[#610e1e] group-hover:to-[#8b1a35] group-hover:text-[#FFD963] group-hover:scale-110 shadow-lg">
                    ▶
                </span>

                <span className="relative z-10">WATCH VIDEO</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
        </motion.div>


    </div>
</div>




    </section>
);
}