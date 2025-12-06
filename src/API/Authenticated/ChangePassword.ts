export default async function ChangePassword(currentPassword: string, newPassword:string, confirmPassword:string){
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const token = userInfo.token
  console.log(token)
  const userData = await fetch("http://127.0.0.1:8000/api/change-pass",{
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      'Authorization': `Bearer ${token}`, 
    },
    body:JSON.stringify({currentPassword, newPassword, confirmPassword})
  })
  
  
  return userData.json()
}