export default async function GetUserInfo() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token;
  console.log(token);
  const userData = await fetch("/api/get-user-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return userData.json();
}
