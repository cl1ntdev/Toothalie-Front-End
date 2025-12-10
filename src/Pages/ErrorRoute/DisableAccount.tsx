import React from "react";
import { useNavigate } from "react-router-dom";


export default function DisableAccount() {
  const nav = useNavigate()
  const handleReturn = () => {
    
    nav('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* Large 403 Text */}
        <h1 className="text-9xl font-black text-gray-200">ACCOUNT DISABLED</h1>

        {/* Message Container */}
        <div className="-mt-12 relative">
          <h2 className="text-3xl font-bold text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-600 mt-2">
            please contact administration
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => {
              console.log('working')
              localStorage.removeItem('userInfo')
              localStorage.removeItem('userDetails')
              window.history.back()
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-200 font-medium"
          >
            Go Back
          </button>
        
        </div>
      </div>
    </div>
  );
}