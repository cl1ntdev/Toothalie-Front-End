export default async function GetLoginUser(id: string) {
  const userData = await fetch("/api/get-login-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  return userData.json();
}
