import React from "react";
import dentist from '../../assets/dentist-bg.jpg'
import bgDark from '../../assets/bgDark.png'
export default function LPage_Section1() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between
      bg-cover bg-center h-screen
      "
          style={{ backgroundImage: `url(${dentist})` }}
    >
     

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 md:py-20 flex flex-col items-center justify-center flex-grow">
        <section className="text-center max-w-3xl mx-auto">
          <div className="font-poppins inline-flex items-center bg-blue-900/30 text-blue-300 px-4 py-2 rounded-full text-xs md:text-sm mb-6 md:mb-8">
            Announcing our next round of funding
            <a href="#" className="ml-2 font-medium flex items-center hover:text-blue-100 transition-colors">
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          <h1 className="
              font-ceramon
              text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem]
              font-bold mb-6 leading-tight
              bg-clip-text text-transparent
              bg-gradient-to-r from-blue-400 to-cyan-400">
            Data to enrich your online business
          </h1>
          
          <p className="
            font-poppins
            text-xl md:text-xl lg:text-xxl  /* bumped up sizes */
            text-slate-300 mb-10 
            max-w-3xl mx-auto leading-relaxed">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
          </p>

          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="font-poppins bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center">
              Book Now!
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="font-poppins bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          
          <div className="font-poppins inline-flex items-center text-slate-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Lorem ipsum
            <a href="#" className="ml-2 text-blue-400 hover:text-blue-300 transition-colors flex items-center">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}