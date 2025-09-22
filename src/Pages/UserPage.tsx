import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// =============== //
//     PANNELS     //
// =============== //
import DoctorPanel from './Panes/Doctor'
import PatientPanel from './Panes/Patient'

 

export default function UserPage(){
  const {id} = useParams()
  const [userIDLocal,setUserIDLocal] = useState<string>("")
  
  useEffect(()=>{
    if(id){
      localStorage.setItem("userID", id)
      const storedID = localStorage.getItem("userID")
    if(storedID){
      setUserIDLocal(storedID)
    } 
    }
    console.log(id)
  },[id])
  
  return(
    <>
      <div>
        <h1>Hello User {id}</h1>
      </div>
    </>
  )
}