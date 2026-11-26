import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

import logo from "../../assets/logo/logo.png";

export default function Footer() {
    return (
        <footer className="bg-primary text-white border-t border-white/10 pt-10 pb-5 px-6 md:px-12">

            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10 pb-10">

                    {/* Brand */}
                    <div>

                        <div className="flex items-center gap-4 mb-6">

                            <img
                                src={logo}
                                alt="SSB Guide"
                                className="w-14 h-14 object-contain"
                            />

                            <div>

                                <h2 className="font-heading text-xl font-bold leading-tight">
                                    SSB Guide
                                </h2>

                                <h3 className="font-heading text-lg text-white">
                                    Aaryans Defence School
                                </h3>

                                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] font-bold text-[#FFD963]">
                                    सेवा परमो धर्मः
                                </p>

                            </div>

                        </div>

                        <p className="text-white/70 leading-7 text-sm max-w-sm">
                            Building disciplined officers for the Indian Armed
                            Forces through academic excellence, defence
                            training, SSB preparation and leadership
                            development.
                        </p>

                        {/* Social Icons */}

                        <div className="flex gap-3 mt-8">

                            <a
                                href="https://www.facebook.com/profile.php?id=61570769092096"
                                target="_blank"
                                rel="noreferrer"
                                className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#FFD963] hover:text-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="https://www.instagram.com/ssbguideaaryansdefenceschool"
                                target="_blank"
                                rel="noreferrer"
                                className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#FFD963] hover:text-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#FFD963] hover:text-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <FaYoutube />
                            </a>

                        </div>

                    </div>

                    {/* Explore */}

                    <div>

                        <h3 className="font-heading text-xl font-bold mb-6 inline-block border-b-2 border-[#FFD963] pb-2">
                            Explore
                        </h3>

                        <ul className="space-y-4 text-white/70">

                            <li>
                                <Link
                                    to="/courses"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    Our Courses
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    About / Mission
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/gallery"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    Gallery & Results
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    Admissions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/resources"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    Resources
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="font-heading text-xl font-bold mb-6 inline-block border-b-2 border-[#FFD963] pb-2">
                            Reach Us
                        </h3>

                        <div className="space-y-6">

                            <div className="flex gap-4">

                                <div className="w-10 h-10 rounded-full bg-[#FFD963] text-primary flex items-center justify-center">
                                    <FaPhoneAlt />
                                </div>

                                <div>

                                    <h4 className="font-bold">
                                        +91 98234 56789
                                    </h4>

                                    <p className="text-white/60 text-sm">
                                        Mon - Sat (9 AM - 6 PM)
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="w-10 h-10 rounded-full bg-[#FFD963] text-primary flex items-center justify-center">
                                    <FaEnvelope />
                                </div>

                                <a
                                    href="mailto:admissions@aaryansdefence.in"
                                    className="hover:text-[#FFD963] transition"
                                >
                                    admissions@aaryansdefence.in
                                </a>

                            </div>

                            <div className="flex gap-4">

                                <div className="w-10 h-10 rounded-full bg-[#FFD963] text-primary flex items-center justify-center">
                                    <FaMapMarkerAlt />
                                </div>

                                <p>
                                    Pune,
                                    <br />
                                    Maharashtra, India
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Bottom */}

                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-[0.2em] text-white/40">

                    <p>
                        © 2026 Powered By Aayojan AI. All Rights Reserved.
                    </p>

                    <Link
                        to="/admin/login"
                        className="hover:text-[#FFD963] underline underline-offset-4 transition"
                    >
                        Staff Login
                    </Link>

                </div>

            </div>

        </footer>
    );
}