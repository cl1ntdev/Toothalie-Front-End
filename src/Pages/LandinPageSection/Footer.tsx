import React from 'react';
import darkbg from "../../assets/bgDark.png";
import handPic from '../../assets/hand.jpg';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <div
      className="
        relative min-h-screen flex flex-col md:flex-row justify-between
        bg-gray-900 text-gray-100 bg-cover bg-center
      "
    >
      {/* Left Section */}
      <div className="md:w-1/3 flex items-center justify-center bg-gray-800/80">
        <div
          className="
            text-center relative min-h-screen w-full flex flex-col
            justify-center items-center bg-cover bg-center px-6 py-10 rounded-lg
          "
          style={{
            backgroundImage: `url(${handPic})`,
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight drop-shadow-md">
            Invest in the health of your organization
          </h1>
          <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
            For Business
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-2/3 p-10 flex flex-col justify-between bg-gray-900/80 backdrop-blur">
        {/* Links */}
        <div>
          <div className="flex flex-col md:flex-row md:justify-between gap-10">
            <div>
              <h3 className="text-xl font-semibold text-white">Our Company</h3>
              <ul className="mt-3 space-y-2 text-gray-300">
                {['About Us', 'Leadership', 'Medical Advisory Board', 'Careers', 'Newsroom', 'Contact'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Support</h3>
              <ul className="mt-3 space-y-2 text-gray-300">
                {['Help', 'Sizing', 'Membership', 'My Account', 'Oura on the Web'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Partner With Us</h3>
              <ul className="mt-3 space-y-2 text-gray-300">
                {['For Business', 'Partnerships', 'Developers', 'Blog', 'The Pulse'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social + Newsletter */}
        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Social Icons */}
            <div className="flex space-x-4">
              {['facebook-f', 'instagram', 'x', 'youtube', 'tiktok', 'pinterest'].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-lg"
                >
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center md:text-left">
              <p className="text-gray-200 font-medium">
                Receive articles, tips, and offers from Oura
              </p>
              <div className="mt-2 md:mt-0 flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="p-2 rounded-l border-none text-black bg-white"
                />
                <Button className="rounded-r">
                  →
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-gray-400 text-sm text-center md:text-left">
            We care about protecting your data. Read more in our{' '}
            <a href="#" className="underline hover:text-gray-200">
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* Footer bottom */}
        <div className="mt-8 text-gray-400 text-sm">
          <div className="space-x-2">
            <a href="#" className="hover:text-gray-200">Terms & Conditions</a> | 
            <a href="#" className="hover:text-gray-200"> Privacy Policy</a> | 
            <a href="#" className="hover:text-gray-200"> Accessibility</a> | 
            <a href="#" className="hover:text-gray-200"> IP Notice</a> | 
            <a href="#" className="hover:text-gray-200"> Security Center</a>
          </div>
          <p className="mt-2">© 2025 Ouraing Inc. | All Rights Reserved</p>
          <p className="mt-1 text-xs text-gray-500">Tootahlie Health may not be used without permission.</p>
        </div>
      </div>
    </div>
  );
}
