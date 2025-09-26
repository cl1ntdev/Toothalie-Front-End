import React, { useEffect, useState } from 'react'
import { LoginedUserClass } from '@/Classes/Authenticated/LoginedUserInfoClass'
type DoctorPanelProps = {
  userLoginedInfo?: LoginedUserClass
}


export default function DoctorPanel({ userLoginedInfo }:DoctorPanelProps){
  const user = userLoginedInfo
  
  return(
    <>
      <div>
        <h1>Hello Doctor { user?.id}</h1>
      </div>
    </>
  )
}