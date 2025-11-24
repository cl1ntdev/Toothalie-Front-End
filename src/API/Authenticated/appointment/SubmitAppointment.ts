export default async function SubmitAppointment(
  patientID:string, 
  dentistID:string,
  day:string,
  time:string,
  emergency:boolean,
  familyBooking:boolean,
  date:string | null,
  message:string,
  serviceID: string | null
){
  // console.log(patientID)
  // console.log(dentistID)
  // console.log(day)
  // console.log(time)
  // console.log(emergency)
  // console.log(familyBooking)
  // console.log(date)
  console.log(serviceID)
  
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const token = userInfo.token
  
  const submit = await fetch('http://127.0.0.1:8000/api/add-appointment',{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify({
      patientID, 
      dentistID,
      day,
      time,
      emergency,
      familyBooking,
      date,
      message,
      serviceID
    })
  })
  if(!submit.ok){
    const errorData = await submit.json();
    throw new Error(errorData.message || "Failed to submit appointment");
  }
  
  console.log(submit)
  return submit
}