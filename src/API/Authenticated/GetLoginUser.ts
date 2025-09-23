export default async function GetLoginUser(id:string){
  
  const userData = await fetch("http://127.0.0.1:8000/api/get-login-user",{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({id})
  })
  
  
  return userData.json()
}