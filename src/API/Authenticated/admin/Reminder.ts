export async function getReminders() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/get-reminders", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await result.json();
  return data;
}

export async function getReminder(reminderID: string) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/get-reminder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reminderID }),
  });
  const data = await result.json();
  return data;
}

export async function deleteReminder(reminderID: string) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/delete-reminder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reminderID }),
  });
  const data = await result.json();
  return data;
}

export async function updateReminder(payload) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/update-reminder", {
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

export async function createReminder(payload) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/create-reminder", {
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
