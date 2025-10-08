import Patient from "@/Classes/Authenticated/Patient";
export default async function RegisterAuth(value:Patient) {
  const userInfo = value;
  console.log(userInfo)
  const response = await fetch("http://127.0.0.1:8000/api/reg-check-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  })
  const result = await response.json()
  console.log(result)
  
  return result;
}
