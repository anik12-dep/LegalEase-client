export const getMyAppointments = async (token: string) => {
  const response = await fetch("http://localhost:5000/appointments/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
};

export const cancelAppointment = async (
  appointmentId: string,
  token: string,
) => {
  const response = await fetch(
    `http://localhost:5000/appointments/${appointmentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to cancel appointment");
  }

  return response.json();
};
