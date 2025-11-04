
const fetchHistory = async(patientID: string | null) => {
  const result = await fetch('http://127.0.0.1:8000/api/get-history',{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({patientID})
  })
  
  return result.json()
  
}

export { fetchHistory }