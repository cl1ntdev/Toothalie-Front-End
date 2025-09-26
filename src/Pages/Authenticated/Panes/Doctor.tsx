import React, { useEffect, useState } from 'react'

type idProps = {
  doctorID?: string
}


export default function DoctorPanel({doctorID}: idProps){
  
  return(
    <>
      <div>
        <h1>Hello Doctor { doctorID}</h1>
      </div>
    </>
  )
}