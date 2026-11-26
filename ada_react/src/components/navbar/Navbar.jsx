import { NavLink, Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "../../assets/logo/logo.png";

const menu = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Resources", path: "/resources" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
<header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-t-4 border-[#ffd963] shadow-lg shadow-gray-200/30">
          <div className="max-w-[1480px] mx-auto px-10 xl:px-1">

        <div className="h-[80px] grid grid-cols-[1fr_auto_1fr] items-center">

<div className="flex justify-start">
    <Link to="/" className="flex items-center group">

        <div className="relative">
            <img
                src={logo}
                alt="Logo"
                className="w-[72px] h-[72px] object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd963]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="ml-2 leading-tight">

            <h1 className="font-heading text-[19px] font-bold bg-gradient-to-r from-[#6b1023] to-[#8b1a35] bg-clip-text text-transparent">
                SSB Guide Aaryans Defence School
            </h1>

            <p className="mt-1 text-[11px] text-[#6b1023] font-medium tracking-wide">
                सेवा परमो धर्मः
            </p>

        </div>

    </Link>
</div>

          {/* Navigation */}

          <nav className="hidden lg:flex justify-center gap-3">

            {menu.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => `font-body text-[13px] font-bold uppercase tracking-[1px] transition-all duration-300 relative py-2 px-3 rounded-lg ${ isActive ? "text-[#6b1023] bg-[#ffd963]/20 border-2 border-[#ffd963]" : "text-[#6b1023] hover:text-[#ffd963] hover:bg-[#ffd963]/10" }` }
              > 
                {item.name}
              </NavLink>
            ))}

          </nav>

          {/* Right Side */}

         <div className="hidden lg:flex justify-end items-center gap-5">

        <a href="tel:+919823456789" className="flex items-center gap-2 text-[15px] font-semibold text-[#6b1023] px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-[#ffd963]/30 hover:border-[#ffd963] hover:from-[#ffd963]/10 hover:to-[#ffd963]/5 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#ffd963]/20">
            <FiPhone size={18} className="transition-transform duration-300 hover:scale-110"/>
            <span className="tracking-wide">CALL</span>
        </a>

        <Link 
            to="/student-registration"
            className="rounded-xl bg-gradient-to-r from-[#6b1023] via-[#8b1a35] to-[#6b1023] bg-[length:200%_100%] px-8 py-3 text-[15px] font-bold text-white shadow-xl shadow-[#6b1023]/30 transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-2xl hover:shadow-[#6b1023]/40 hover:-translate-y-0.5 active:translate-y-0"> 
            ADMISSION / BOOK NOW
        </Link>

    </div>

    <div className="lg:hidden flex justify-end">
        <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 text-[#6b1023] hover:text-[#ffd963] transition-colors"
        >
            <HiMenuAlt3 size={32} />
        </button>
    </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6 flex justify-between items-center border-b-2 border-[#ffd963]/30">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#6b1023]/50">Menu</span>
                    <button 
                        onClick={() => setMobileOpen(false)}
                        className="p-2 text-[#6b1023] hover:text-[#ffd963]"
                    >
                        <HiX size={28} />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-2">
                    {menu.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `px-5 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${isActive ? "bg-[#ffd963]/20 text-[#6b1023] border-2 border-[#ffd963]" : "text-[#6b1023] hover:bg-[#ffd963]/10"}`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                <div className="p-6 mt-auto space-y-4">
                    <a href="tel:+919823456789" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-[#6b1023] bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-[#ffd963]/30">
                        <FiPhone />
                        <span>CALL NOW</span>
                    </a>
                    <Link 
                        to="/student-registration"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center py-5 rounded-xl font-bold uppercase tracking-widest text-white shadow-xl bg-gradient-to-r from-[#6b1023] via-[#8b1a35] to-[#6b1023] bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all"
                    >
                        ADMISSION / BOOK NOW
                    </Link>
                </div>
            </div>
        </div>
      )}

    </header>
  );
}
