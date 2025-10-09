export default async function GetUserInfo(id:string){
  
  const userData = await fetch("http://127.0.0.1:8000/api/get-user-info",{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({id})
  })
  
  
  return userData.json()
}