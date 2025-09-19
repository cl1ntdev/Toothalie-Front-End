import React from 'react'

export default function LPage_Section1() {
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen p-6">
        
        <div className="flex justify-center items-center mb-20">
          <div className="text-center mt-40">
            <h1 className="text-4xl font-bold">Everything you need</h1>
            <h3 className="text-xl text-blue-400">No server? No problem.</h3>
            <p className="text-gray-400 mt-2">
              Lorem ipsum, dolor sit amet consectetur adipiscing elit. Maiores
              impedit perferendis suscipit eaque, iste dolor cupiditate
              blanditiis.
            </p>
          </div>
        </div>

        {/* IMAGE HERE TO SHOW THE APPLICATION */}
        <div className="flex h-280 w-full justify-center my-8 bg-blue-500 ">
          <img
            src="https://via.placeholder.com/600x400" // sample image
            alt="App preview"
            className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 mb-90">
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">Feature Icon</span>
            <p className="text-gray-400 mt-2">
              Feature Information. Lorem ipsum
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">Feature Icon</span>
            <p className="text-gray-400 mt-2">
              Feature Information. Lorem ipsum
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">Feature Icon</span>
            <p className="text-gray-400 mt-2">
              Feature Information
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">🔐</span>
            <p className="text-gray-400 mt-2">
              Advanced security. Lorem ipsum, dolor sit amet consectetur
              adipiscing elit aute id magna.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">Feature Icon</span>
            <p className="text-gray-400 mt-2">
              Feature Information
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">Feature Icon</span>
            <p className="text-gray-400 mt-2">
              Feauture Information
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
