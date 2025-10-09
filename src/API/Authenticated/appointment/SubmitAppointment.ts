export default async function SubmitAppointment(
  patientID:string, 
  dentistID:string,
  day:string,
  time:string,
  emergency:boolean,
  familyBooking:boolean,
  date:string | null

){
  console.log(patientID)
  console.log(dentistID)
  console.log(day)
  console.log(time)
  console.log(emergency)
  console.log(familyBooking)
  console.log(date)
  const submit = await fetch('http://127.0.0.1:8000/api/add-appointment',{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      patientID, 
      dentistID,
      day,
      time,
      emergency,
      familyBooking,
      date
    })
  })
  
  console.log(submit)
  return submit
}