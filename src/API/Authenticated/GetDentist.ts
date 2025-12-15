export async function getAllDentist() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const res = await fetch("/api/dentists", {
    method: "GET",
    headers: { Authorization: `Bearer ${userInfo.token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dentists");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getDentistData() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const result = await fetch("/api/dentist-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  });

  return result.json();
}
