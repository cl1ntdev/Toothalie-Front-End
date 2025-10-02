import React, {useState} from 'react'
import FetchAppointment from '@/API/Authenticated/appointment/FetchAppointment'

export default function UpcomingAppointment(){
  
  const appointment = FetchAppointment()
  console.log(appointment)
  return(
    <>
      <h1>Test</h1>
    </>
  )
}