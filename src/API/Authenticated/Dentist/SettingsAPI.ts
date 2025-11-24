export async function updateSettingsDentist(
  schedules: any[],
  dentistID: string,
) {
  console.log("Sending schedules:", schedules, "Dentist ID:", dentistID);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  try {
    const result = await fetch(
      "http://127.0.0.1:8000/api/update-dentist-settings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ schedules, dentistID }),
      },
    );

    if (!result.ok) {
      throw new Error(`Error ${result.status}`);
    }

    const data = await result.json(); // read JSON only once
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Failed to update dentist settings:", error);
    throw error;
  }
}

export async function getServices() {
  const result = await fetch("http://127.0.0.1:8000/api/get-services");
  const data = result.json();
  console.log(data);
  return data;
}

export async function getDentistServices(userID: string | null) {
  const result = await fetch("http://127.0.0.1:8000/api/get-dentist-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
  });
  const data = result.json();
  console.log(data);
  return data;
}

export async function updateDentistServices(
  userID: string | null,
  payload: { user_id: any; service_id: number }[],
) {
  console.log(userID,payload)
  const data = await fetch('http://127.0.0.1:8000/api/edit-services',{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userID,payload})
  })
  
  const result = await data.json();
  console.log(result)
}
