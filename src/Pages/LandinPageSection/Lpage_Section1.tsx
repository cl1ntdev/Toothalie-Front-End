import React from 'react'

export default function LPage_Section1() {
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-4xl font-bold">Everything you need</h1>
            <h3 className="text-xl text-blue-400">No server? No problem.</h3>
            <p className="text-gray-400 mt-2">
              Lorem ipsum, dolor sit amet consectetur adipiscing elit. Maiores
              impedit perferendis suscipit eaque, iste dolor cupiditate
              blanditiis.
            </p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            New project
          </button>
        </div>

        {/* IMAGE HERE TO SHOW THE APPLICATION */}
        <div className="flex h-120 w-full justify-center my-8 bg-blue-500">
          <img
            src="https://via.placeholder.com/600x400" // sample image
            alt="App preview"
            className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">🌱</span>
            <p className="text-gray-400 mt-2">
              Push to deploy. Lorem ipsum, dolor sit amet consectetur adipiscing
              elit aute id magna.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">🔒</span>
            <p className="text-gray-400 mt-2">
              SSL certificates. Anim ut id magna aliqua ad ad non deserunt sunt.
              Qui nisi lorem cupidatat commodo.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">📡</span>
            <p className="text-gray-400 mt-2">
              Simple queues. Ac tincidunt sapien vehicula erat auctor
              pellentesque rhoncus.
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
            <span className="text-blue-400">🤖</span>
            <p className="text-gray-400 mt-2">
              Powerful API. Anim ut id magna aliqua ad ad non deserunt sunt. Qui
              nisi lorem cupidatat commodo.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <span className="text-blue-400">💾</span>
            <p className="text-gray-400 mt-2">
              Database backups. Ac incididunt sapien vehicula erat auctor
              pellentesque rhoncus.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
