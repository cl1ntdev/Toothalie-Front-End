async function FetchAppointment(){
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const fetchAppointmentDetails = await fetch('http://127.0.0.1:8000/api/get-appointment',{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
  })
  const data = await fetchAppointmentDetails.json()
    console.log("Appointment data:", data)

    return data
  
}

async function fetchAppointmentDentist(){
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log(userInfo)
  const fetchAppointmentDetails = await fetch('http://127.0.0.1:8000/api/get-appointment-dentist',{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
  })
  const data = await fetchAppointmentDetails.json() // only once
    console.log("Appointment data:", data)

    return data
 
}

export { FetchAppointment, fetchAppointmentDentist };