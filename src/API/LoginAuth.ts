import { UserLoginInfoClass } from "@/Classes/UserLogin";
export default async function LoginAuth(value: UserLoginInfoClass) {
  const userInfo = value;

  const response = await fetch("http://127.0.0.1:8000/api/login-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
  const result = await response.json()
  console.log(result)
  
  
  // 
  // MAKE A RESPONSE OF A LOGIN USER IN LOCAL HOST 
  //
  
  
  return response;
}
