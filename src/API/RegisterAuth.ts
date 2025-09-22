// import { UserLoginInfo } from "@/Classes/UserLogin";
export default async function LoginAuth(value:string) {
  const userInfo = value;

  const response = await fetch("http://127.0.0.1:8000/api/reg-check-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
  const result = await response.json()
  console.log(result)
  
  return result;
}
