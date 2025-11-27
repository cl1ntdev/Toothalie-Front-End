export async function getAllDentist(){
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const res = await fetch('http://127.0.0.1:8000/api/dentists',{
    method: 'GET',
    headers: { "Authorization": `Bearer ${userInfo.token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dentists");
  }
  const data = await res.json()
  console.log(data)
  return data;
};

export async function getDentistData(){
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  console.log(userInfo)
  const result = await fetch('http://127.0.0.1:8000/api/dentist-info',{
    method:"GET",
    headers: { 
      "Content-Type":"application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
  })
  
  return result.json()

}
