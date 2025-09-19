import React from 'react'

export default function LPage_Section2() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-indigo-900 py-40">
      <div className="max-w-fit  bg-gray-800  shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://via.placeholder.com/400"
            alt="CEO"
            className="w-80 h-80 md:w-120 md:h-140 rounded-2xl object-cover border-4 border-gray-700 shadow-xl bg-blue-400"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col text-center md:text-left">
          <p className="text-lg md:text-xl text-gray-200 italic leading-relaxed">
            “Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh scelerisque bibendum.”
          </p>
          <h4 className="mt-6 text-2xl font-bold text-white">Judith Black</h4>
          <span className="text-gray-400 text-lg">CEO of Tuple</span>
        </div>
      </div>
    </section>
  )
}