import React from 'react';
import darkBg from '../../assets/bgDark.png'
import lightBg from '../../assets/bgLight.png'
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function LPage_Section2() {
  return (
    <div className="bg-gray-900 text-white px-6 py-16
      relative min-h-screen flex flex-col justify-between bg-cover bg-center bg-fixed"
      style={{backgroundImage:`url(${darkBg})`}}
    >
      {/* Heading */}
           <div className="flex justify-center items-center mb-20">
             <div className="text-center max-w-3xl space-y-4">
               <p className="font-ceramon text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
                 Everything you need to know
               </p>
               <h3 className="font-poppins text-2xl md:text-3xl text-blue-400 font-medium">
                 Dental software made simple
               </h3>
               <p className="font-poppins text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                 Streamline your dental clinic’s operations — from appointment scheduling to patient billing — with our all-in-one platform.
               </p>
             </div>
           </div>

      {/* Responsive App Screenshot */}
      <div className="w-full my-12 px-4">
        <div className="bg-blue-500 rounded-xl flex justify-center items-center p-4 shadow-xl">
          <img
            src="https://via.placeholder.com/900x500"
            alt="Dental Software preview"
            className="w-full max-w-5xl h-auto rounded-lg shadow-lg object-contain"
          />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16">
        {[
          {
            icon: <CalendarDaysIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Appointment Scheduling",
            desc: "Manage patient bookings, confirmations, and cancellations seamlessly."
          },
          {
            icon: <CreditCardIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Billing & Payments",
            desc: "Track payments, generate invoices, and simplify insurance claims."
          },
          {
            icon: <UserGroupIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Patient Records",
            desc: "Store and access patient data, history, and treatment plans securely."
          },
          {
            icon: <ChartBarIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Analytics Dashboard",
            desc: "Monitor your clinic’s growth with easy-to-read charts and reports."
          },
          {
            icon: <BellAlertIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Automated Reminders",
            desc: "Reduce no-shows with automated SMS or email appointment reminders."
          },
          {
            icon: <ShieldCheckIcon className="h-8 w-8 text-[#5BB1E3] mb-3" />,
            title: "Secure & Compliant",
            desc: "HIPAA-compliant security keeps your patient data safe."
          },
        ].map((card, index) => (
          <div
            key={index}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-[#5BB1E3] via-[#4DA5D9] to-[#5BB1E3] transition-transform transform hover:scale-[1.03] hover:shadow-[0_0_20px_#5BB1E355]"
          >
            <div className="p-6 rounded-2xl bg-gray-900 text-center transition-all duration-300 group-hover:bg-gray-800">
              <div className="flex justify-center">{card.icon}</div>
              <h4 className="font-ceramon text-xl font-semibold mb-2 text-white">
                {card.title}
              </h4>
              <p className="font-poppins text-gray-400">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
