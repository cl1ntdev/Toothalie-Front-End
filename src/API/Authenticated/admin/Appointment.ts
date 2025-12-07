export async function getAppointments() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo.token.toString();

  const result = await fetch('http://127.0.0.1:8000/api/admin/appointments', {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return await result.json();
}

export async function getAppointment(appointmentID: string) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo.token.toString();

  const result = await fetch(`http://127.0.0.1:8000/api/admin/appointments/${appointmentID}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return await result.json();
}

export async function deleteAppointment(appointmentID: string) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo.token.toString();

  const result = await fetch(`http://127.0.0.1:8000/api/admin/appointments/${appointmentID}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return await result.json();
}

export async function updateAppointment(payload: any) {
  console.log(payload)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo.token.toString();

  const result = await fetch(`http://127.0.0.1:8000/api/admin/appointments/${payload.appointmentID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return await result.json();
}

export async function createAppointment(payload: any) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo.token.toString();

  const result = await fetch('http://127.0.0.1:8000/api/admin/appointments', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return await result.json();
}
