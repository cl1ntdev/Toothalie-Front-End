import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function UserPage(){
  const {id} = useParams() || null 
  const [user,setUser] = useState<number>(0)
  useEffect(()=>{
    // api for fetching user then send to other panes (patient, doctor)
  },[id])
  return(
    <>
      
    </>
  )
}