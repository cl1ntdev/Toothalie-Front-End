export async function updateSettingsDentist(schedules) {
  try {
    const result = await fetch('http://127.0.0.1:8000/api/update-dentist-settings', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedules }) // send as { schedules: [...] }
    });

    if (!result.ok) {
      throw new Error(`Error ${result.status}`);
    }

    return await result.json();
  } catch (error) {
    console.error("Failed to update dentist settings:", error);
    throw error;
  }
}
