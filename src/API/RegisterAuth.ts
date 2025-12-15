import Patient from "@/Classes/Authenticated/Patient";
export default async function RegisterAuth(value: Patient) {
  const userInfo = value;
  console.log(userInfo);
  const response = await fetch("/api/reg-check-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });
  const result = await response.json();
  console.log(result);

  return result;
}
