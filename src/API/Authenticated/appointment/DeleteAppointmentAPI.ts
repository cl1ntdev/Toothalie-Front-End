export default async function DeleteAppointmentAPI(appointmentID:string | null){
  
  console.log('Appointment id is: '+ appointmentID)
  if(appointmentID){
   const deleteAppointmentDetails = await fetch('http://127.0.0.1:8000/api/delete-appointment',{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body: JSON.stringify({ appointmentID })
   })
     const data = await deleteAppointmentDetails.json() // only once
     console.log("Appointment data:", data)
 
     return data
  }
  
  
}