export async function getAllDentist(){
  const res = await fetch('http://127.0.0.1:8000/api/dentists');

  if (!res.ok) {
    throw new Error("Failed to fetch dentists");
  }
  const data = await res.json()
  console.log(data)
  return data;
};

export async function getDentistData(dentistID: string){
  const result = await fetch('http://127.0.0.1:8000/api/dentist-info',{
    method:"POST",
    headers: { "Content-Type":"application/json"},
    body:JSON.stringify({dentistID})
  })
  
  return result.json()

}
