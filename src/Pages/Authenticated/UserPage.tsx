import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GetLoginUser from '@/API/Authenticated/GetLoginUser'

import { LoginedUserClass } from '@/Classes/Authenticated/LoginedUserInfoClass'
// =============== //
//     PANNELS     //
// =============== //
import DentistPanel from './Panes/Dentist'
import PatientPanel from './Panes/PatientPane/Patient'

 

export default function UserPage(){
  const [isWaiting,setIsWaiting] = useState<boolean>(true)
  const {id} = useParams()
  const userID = id // VALIDATED and AUTHENTICATED  ID OF USER 
  const [userIDLocal,setUserIDLocal] = useState<string>("")
  const [userInfo, setUserInfo] = useState<LoginedUserClass>()
  useEffect(()=>{
    
    // 
    // 
    // DEBUGGING PURPOSES 
    // 
    const loginUser = new LoginedUserClass("TestUserPage","TestUserPage","Patient",userID || "0")
    setUserInfo(loginUser) 
    // 
    // 
    // 
    // 
    
    const getUserFunc = async(id:string)=>{
      const userInfo = await GetLoginUser(id);  
      const loginUser = new LoginedUserClass(userInfo.firstname,userInfo.lastname,userInfo.role,id)
      setUserInfo(loginUser)
      console.log(userInfo)
    }
    
    // AFTER VALIDATION IT WILL GET INFORMATION OF THE LOGIN USER
    if(userID){
      getUserFunc(userID)      
    }else{
      alert("User ID is invalid: ")
      return
    }
    
    // STORE ID IN LOCAL BROWSER 
    if(id){
        localStorage.setItem("userID", id)
        
        const storedID = localStorage.getItem("userID")
        // STORE ID LOCAL for debugging 
        if(storedID){
          setUserIDLocal(storedID)
        } 
    }
    console.log(id)
  },[id])
  
  useEffect(()=>{
    if(userInfo){
      setIsWaiting(false)
    }
  },[userInfo])
  
  return(
    <>
      {isWaiting ? (
        <h1>Page Loading</h1>
      ):(
        userInfo?.role == "Dentist" ? (
          <DentistPanel userLoginedInfo={userInfo} />
        ):(
          <PatientPanel userLoginedInfo={userInfo} />
        )
      )}
    </>
  )
}


