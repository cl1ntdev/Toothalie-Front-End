import React from 'react'
import { Link } from 'react-router-dom'
export default function NavigationComp() {
  {/* Header */ }
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center absolute">
      <div className="flex items-center">
        <span className="text-blue-400 text-3xl mr-2">∼</span>
        <span className="font-ceramon font-semibold text-2xl">Toothalie</span>
      </div>
    
      <nav className="hidden md:flex items-center space-x-6 text-sm">
        <a href="#" className="font-poppins text-2xl hover:text-blue-400 transition-colors">Product</a>
        <a href="#" className="font-poppins text-2xl hover:text-blue-400 transition-colors">About</a>
        <a href="#" className="font-poppins text-2xl hover:text-blue-400 transition-colors">Company</a>
        <a href="#" className="font-poppins text-2xl hover:text-blue-400 transition-colors">Contact</a>
      </nav>
    
      <div className="flex items-center space-x-4">
        <Link to="/login" className="font-poppins text-2xl hover:text-blue-400 transition-colors">Log in</Link>
        <button className="font-poppins bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-2xl transition-colors hidden sm:block">
          Sign up
        </button>
      
        {/* <><><><><><><><><><><><><><><><><><><><><><><><><><><> */}
        {/*  THIS CONTENT HERE IS STILL UNCLICKABLE IN MOBILE VIEW */}
        {/* <><><><><><><><><><><><><><><><><><><><><><><><><><><> */}
      
      
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}