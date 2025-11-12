
const fetchHistory = async(userID: string | null,roleInput:string) => {
  console.log(userID)
  const role = roleInput.toString()
  const result = await fetch('http://127.0.0.1:8000/api/get-history',{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({userID,role})
  })
  
  const data = await result.json() 
  console.log(data)
  return data
  
}

export { fetchHistory }