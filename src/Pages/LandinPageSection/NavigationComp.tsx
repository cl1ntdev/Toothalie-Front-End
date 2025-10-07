import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Toothalie_logo2 from "../../assets/logo.png"


const HomePageSections = [
  {
    sectionName:"Home",
  },
  {
    sectionName:"About",
  },
  {
    sectionName:"FAQ",
  },
  {
    sectionName:"Contact",
  },
]

type SectionStateProps = {
  // SectionState: string
  onChangeNewSection: (newSection:string) => void
}


export default function NavigationComp({onChangeNewSection}:SectionStateProps) {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const handleChangeSection = (sectionName:string) =>{
    console.log(sectionName)
    onChangeNewSection(sectionName)
  }
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false)
      } else {
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
        bg-white/30 md:bg-white/20 backdrop-blur-xl border-b border-white/20 shadow-sm`}
    >
      <div className="w-full mx-auto py-0.5 px-3 sm:px-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={Toothalie_logo2}
            alt="Toothalie logo"
            className="h-10 w-10"
          />
          <span className="font-ceramon font-semibold text-lg sm:text-xl text-blue-900 tracking-wide drop-shadow-sm">
            Toothalie
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {HomePageSections.map((item,index) => (
            <p
              key={index}
              className="cursor-pointer font-poppins text-blue-900 hover:text-gray-600 transition-colors text-lg"
              onClick={(e)=>handleChangeSection(item.sectionName)} 
            >
              {item.sectionName}
            </p>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/login"
            className="font-poppins text-blue-900 hover:text-blue-600 transition-colors text-base sm:text-lg"
          >
            Log in
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden text-blue-900 hover:text-blue-600">
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
