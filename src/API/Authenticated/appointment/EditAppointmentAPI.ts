export async function FetchEditAppointmentDetailsAPI(
  appointmentID: string | null,
) {
  console.log(appointmentID);
  if (appointmentID) {
    const dentistDetails = await fetch(
      "http://127.0.0.1:8000/api/specified-appointment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentID }),
      },
    );
    const data = await dentistDetails.json(); // only once
    console.log("Appointment data:", data);

    return data;
  }
}

// For Patient Updates
export async function UpdateAppointment(
  appointmentID: string | null,
  scheduleID: string | null,
  baseDate: Date,
  isEmergency: boolean,
  isFamilyBooking: boolean,
  message: string,
) {
  const init_date = new Date(baseDate);
  const date = init_date.toLocaleDateString("en-CA");

  console.log(date);

  if (appointmentID) {
    const dentistDetails = await fetch(
      "http://127.0.0.1:8000/api/update-appointment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentID,
          scheduleID,
          date,
          isEmergency,
          isFamilyBooking,
          message,
        }),
      },
    );
    const data = await dentistDetails.json(); // only once
    console.log("Appointment data:", data);

    return data;
  }
}

//  For dentist updates

export async function UpdateDentistAppointment(
  appointment_id: string | null,
  status: string,
) {
  console.log(status);
  const update = await fetch(
    "http://127.0.0.1:8000/api/edit-appointment-dentist",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id, status }),
    },
  );
  return update.json();
}

export default {
  FetchEditAppointmentDetailsAPI,
  UpdateAppointment,
  UpdateDentistAppointment,
};
