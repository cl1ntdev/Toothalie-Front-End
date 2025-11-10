export default async function GetUserInfo(id:string){
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = userInfo.token
  console.log(token)
  const userData = await fetch("http://127.0.0.1:8000/api/get-user-info",{
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({id})
  })
  
  
  return userData.json()
}