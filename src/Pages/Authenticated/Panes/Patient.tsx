import React, { useEffect, useState } from 'react'
import { LoginedUserClass } from '@/Classes/Authenticated/LoginedUserInfoClass'

type PatientPanelProps = {
  userLoginedInfo?: LoginedUserClass
}

export default function PatientPanel({ userLoginedInfo }:PatientPanelProps){
  const user = userLoginedInfo
  return(
    <>
      <div>
        <h1>Hello Patient: {user?.id}</h1>
      </div>
    </>
  )
}