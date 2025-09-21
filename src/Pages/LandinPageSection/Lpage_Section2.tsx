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
        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <CalendarDaysIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Appointment Scheduling</h4>
          <p className="font-poppins text-gray-400">
            Manage patient bookings, confirmations, and cancellations seamlessly.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <CreditCardIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Billing & Payments</h4>
          <p className="font-poppins text-gray-400">
            Track payments, generate invoices, and simplify insurance claims.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <UserGroupIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Patient Records</h4>
          <p className="font-poppins text-gray-400">
            Store and access patient data, history, and treatment plans securely.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <ChartBarIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Analytics Dashboard</h4>
          <p className="font-poppins text-gray-400">
            Monitor your clinic’s growth with easy-to-read charts and reports.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <BellAlertIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Automated Reminders</h4>
          <p className="font-poppins text-gray-400">
            Reduce no-shows with automated SMS or email appointment reminders.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <ShieldCheckIcon className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-ceramon text-xl font-semibold mb-2">Secure & Compliant</h4>
          <p className="font-poppins text-gray-400">
            HIPAA-compliant security keeps your patient data safe.
          </p>
        </div>
      </div>
    </div>
  );
}
