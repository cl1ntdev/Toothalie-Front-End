import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GetLoginUser from '@/API/Authenticated/GetLoginUser'
// =============== //
//     PANNELS     //
// =============== //
import DoctorPanel from './Panes/Doctor'
import PatientPanel from './Panes/Patient'

 

export default function UserPage(){
  const {id} = useParams()
  const userID = id
  const [userIDLocal,setUserIDLocal] = useState<string>("")
  const [userInfo,setUserInfo] = useState("")
  useEffect(()=>{
    
    const getUserFunc = async(id:string)=>{
      const userInfo = await GetLoginUser(id);  
      setUserInfo(userInfo)
      console.log(userInfo)
    }
    if(userID){
      getUserFunc(userID)      
    }else{
      alert("User ID is invalid: ")
      return
    }
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
     {userID ? (
       <DoctorPanel />
     ):(
      <PatientPanel userLoginID={id} />
     )
     }
    </>
  )
}