import React from 'react';
import ceoImage from '../../assets/ceo.png';

export default function LPage_Section3() {
  return (
    <section className="bg-[#1575aa] py-20">
      <div className="container mx-auto px-6">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10">
          {/* IMAGE */}
          <div className="flex justify-center relative">
            {/* Gradient accent */}
            <div className="absolute -z-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 rounded-full blur-3xl opacity-30"></div>
            <img
              src={ceoImage}
              alt="CEO"
              className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-xl ring-4 ring-gray-700"
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-col justify-center text-center md:text-left space-y-4">
            <p className="font-poppins text-lg md:text-xl text-gray-200 italic leading-relaxed">
              “Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc
              suscipit tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum
              eget tellus non nibh scelerisque bibendum.”
            </p>
            <h4 className="font-ceramon mt-4 text-2xl md:text-3xl font-bold text-white">
              Clint Jay Estrellanes
            </h4>
            <span className="font-poppins text-gray-400 text-lg">CEO of Toothalie</span>
          </div>
        </div>
      </div>
    </section>
  );
}
