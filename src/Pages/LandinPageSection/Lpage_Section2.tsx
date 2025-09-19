import React from 'react'

export default function LPage_Section2() {
  return (
    <>
      <div className="bg-yellow-100 py-30"> 
        <div className="max-w-9xl bg-yellow-200 rounded-xl shadow-md p-6 flex items-center gap-6">
          {/* IMAGE HERE OF A CEO */}
          {/* BACKGROUND */}
          <img 
            src="https://via.placeholder.com/150" 
            alt="CEO IMAGE" 
            className="w-70 h-120 rounded-2xl object-cover border-4 border-white shadow-md bg-blue-400" 
          />
          
          {/* TEXT */}
          <div className="flex flex-col">
            <h4 className="text-lg font-medium text-gray-800">
              “Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo amet nisi 
              quibusdam reiciendis architecto eaque!”
            </h4>
            <h4 className="mt-3 text-xl font-bold text-gray-900">Clint Jay</h4>
            <h4 className="text-gray-500">CEO</h4>
          </div>
        </div>
      </div>
    </>
  )
}
