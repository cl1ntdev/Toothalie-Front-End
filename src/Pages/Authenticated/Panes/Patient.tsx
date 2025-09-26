import React, { useEffect, useState } from 'react'

type userLoginProps = {
  userLoginID?: string
}

export default function PatientPanel({userLoginID}:userLoginProps){
  const userID = userLoginID
  return(
    <>
      <div>
        <h1>Hello Patient: { userID }</h1>
      </div>
    </>
  )
}