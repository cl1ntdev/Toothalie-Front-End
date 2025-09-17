import { UserLoginInfo } from "@/Classes/UserLogin"
export default async function checkUserLogin (value:UserLoginInfo){
  const userInfo = value;
    
  await fetch("http://127.0.0.1:8000/api/login-auth",{
    method:"POST",
    headers: { "ContentType":"application/json"},
    body:JSON.stringify(userInfo)
  })
} 