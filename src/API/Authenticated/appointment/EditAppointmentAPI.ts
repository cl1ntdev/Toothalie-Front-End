
export async function FetchEditAppointmentDetailsAPI(appointmentID:string | null){
  console.log(appointmentID)
  if(appointmentID){
   const dentistDetails = await fetch('http://127.0.0.1:8000/api/specified-appointment',{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body: JSON.stringify({ appointmentID })
   })
     const data = await dentistDetails.json() // only once
     console.log("Appointment data:", data)
 
     return data
  }
}


export async function UpdateAppointment(appointmentID: string| null,scheduleID:string | null){
  if(appointmentID){
   const dentistDetails = await fetch('http://127.0.0.1:8000/api/update-appointment',{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body: JSON.stringify({ appointmentID, scheduleID})
   })
     const data = await dentistDetails.json() // only once
     console.log("Appointment data:", data)
 
     return data
  }
}

export default {FetchEditAppointmentDetailsAPI, UpdateAppointment}
