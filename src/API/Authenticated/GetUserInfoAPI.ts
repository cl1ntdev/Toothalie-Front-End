export default async function GetUserInfo(){
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = userInfo.token
  console.log(token)
  const userData = await fetch("http://127.0.0.1:8000/api/get-user-info",{
    method: "GET",
    headers: {
      "Content-Type":"application/json",
      'Authorization': `Bearer ${token}`, 
    },
  })
  
  
  return userData.json()
}