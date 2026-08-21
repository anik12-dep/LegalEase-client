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
  console.log("LAWYER APPOINTMENT RESPONSE:", data);

  if (!response.ok) {
    console.error("Lawyer Appointment API Error:", data);

    throw new Error(data.message || "Failed to fetch lawyer appointments");
  }

  return data;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "accepted" | "rejected",
  token: string,
) => {
  const response = await fetch(
    `http://localhost:5000/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update appointment status");
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

// Create Stripe Checkout Session
export const createCheckoutSession = async (
  appointmentId: string,
  token: string,
) => {
  const response = await fetch(
    `http://localhost:5000/appointments/${appointmentId}/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create checkout session");
  }

  return data;
};
export const verifyPayment = async (sessionId: string, token: string) => {
  const response = await fetch(
    `http://localhost:5000/appointments/verify-payment?session_id=${encodeURIComponent(
      sessionId,
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify payment");
  }

  return data;
};
