export async function updateSettingsDentist(schedules: any[], dentistID: string) {
  console.log("Sending schedules:", schedules, "Dentist ID:", dentistID);
  try {
    const result = await fetch('http://127.0.0.1:8000/api/update-dentist-settings', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules, dentistID })
    });

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
