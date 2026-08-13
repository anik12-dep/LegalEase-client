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

export const getLawyerAppointments = async (token: string) => {
  const response = await fetch("http://localhost:5000/appointments/lawyer", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Lawyer Appointment API Error:", data);

    throw new Error(data.message || "Failed to fetch lawyer appointments");
  }

  return data;
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
