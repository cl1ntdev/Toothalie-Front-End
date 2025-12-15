export default async function DeleteAppointmentAPI(
  appointmentID: string | null,
) {
  console.log("Appointment id is: " + appointmentID);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (appointmentID) {
    const deleteAppointmentDetails = await fetch("/api/delete-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({ appointmentID }),
    });
    const data = await deleteAppointmentDetails.json(); // only once
    console.log("Appointment data:", data);

    return data;
  }
}
