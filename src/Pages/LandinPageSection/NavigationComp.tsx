import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Toothalie_logo from "../../assets/logo.png"
import Toothalie_logo2 from "../../assets/logo2.png"
export default function NavigationComp() {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scrolling down
        setShowHeader(false)
      } else {
        // scrolling up
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 
        ${showHeader ? 'translate-y-0' : '-translate-y-full'}
        bg-gray-200/80 backdrop-blur-lg border-b border-slate-700/50 shadow-md`}
    >
      <div className="w-full mx-auto py-2 px-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={Toothalie_logo2}
            alt="Toothalie logo"
            className="h-10 w-auto mr-2"
          />
          <span className="font-ceramon font-semibold text-2xl text-black tracking-wide">
            Toothalie
          </span>
        </div>
    
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {['Product', 'About', 'Company', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="font-poppins text-gray-200 hover:text-blue-400 transition-colors text-lg"
            >
              {item}
            </a>
          ))}
        </nav>
    
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="font-poppins text-gray-200 hover:text-blue-400 transition-colors text-lg"
          >
            Log in
          </Link>
          <button className="hidden sm:block font-poppins bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-lg shadow transition-colors">
            Sign up
          </button>
    
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-200 hover:text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

  )
}
