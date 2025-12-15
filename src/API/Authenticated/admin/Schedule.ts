export async function getSchedules() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/get-schedules", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await result.json();
  return data;
}

export async function getSchedule(scheduleID: string) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/get-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ scheduleID }),
  });
  const data = await result.json();
  return data;
}

export async function deleteSchedule(scheduleID: string) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/delete-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ scheduleID }),
  });
  const data = await result.json();
  return data;
}

export async function updateSchedule(payload) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/update-schedule", {
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

export async function createSchedule(payload) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token.toString();
  const result = await fetch("/api/admin/create-schedule", {
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
