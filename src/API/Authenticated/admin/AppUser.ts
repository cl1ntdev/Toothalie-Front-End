export async function getUsers() {
  console.log("test");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const token = userInfo.token.toString();
  console.log(token);
  const result = await fetch("/api/admin/get-users", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await result.json();
  return data;
}

export async function getUser(userID: string) {
  console.log("test");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const token = userInfo.token.toString();
  console.log(token);
  const result = await fetch("/api/admin/get-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userID }),
  });
  const data = await result.json();
  return data;
}

export async function deleteUser(userID: string) {
  console.log("test");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const token = userInfo.token.toString();
  console.log(token);
  const result = await fetch("/api/admin/delete-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userID }),
  });
  const data = await result.json();
  return data;
}

export async function updateUser(payload) {
  console.log("test");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const token = userInfo.token.toString();
  console.log(token);
  const result = await fetch("/api/admin/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await result.json();
  return data;
}

export async function createUser(payload) {
  console.log("wroking");
  console.log(payload);
  console.log("test");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo);
  const token = userInfo.token.toString();
  console.log(token);
  const result = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await result.json();
  return data;
}
