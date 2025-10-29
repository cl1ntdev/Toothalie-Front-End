import React, { useState,useEffect } from "react";
import { FetchAppointment } from "@/API/Authenticated/appointment/FetchAppointment";


export default function HistoryPane() {
  
  const [appointmentData, setAppointmentData] = useState()
  
  useEffect(()=>{
    
    const getAppointment = async() => {
      const appointments = await FetchAppointment()
      if(appointments){
        setAppointmentData(appointments)
      }
      console.log(appointments)
    }
    
    getAppointment();
  },[])
  
  
  
  return (
    <>
      <h1>HISTORY OF APPROVED APPOINTMENTS</h1>
    </>
  );
}