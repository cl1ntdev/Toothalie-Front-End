async function FetchAppointment(){
  const userID = localStorage.getItem("userID")
  console.log('userID is: '+ userID)
  if(userID){
   const fetchAppointmentDetails = await fetch('http://127.0.0.1:8000/api/get-appointment',{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify({userID})
   })
   const data = await fetchAppointmentDetails.json() // only once
     console.log("Appointment data:", data)
 
     return data
  }
  
}

async function fetchAppointmentDentist(dentistID:string){
  const fetchAppointmentDetails = await fetch('http://127.0.0.1:8000/api/get-appointment-dentist',{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({dentistID})
  })
  const data = await fetchAppointmentDetails.json() // only once
    console.log("Appointment data:", data)

    return data
 
}

export { FetchAppointment, fetchAppointmentDentist };