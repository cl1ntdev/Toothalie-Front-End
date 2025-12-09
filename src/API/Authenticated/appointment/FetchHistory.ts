const fetchHistory = async (userID: string, role: string) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
console.log(role)
  const result = await fetch("http://127.0.0.1:8000/api/get-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
    body: JSON.stringify({ userID, role }),
  });

  return await result.json();
};

export { fetchHistory };
