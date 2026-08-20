const API_URL = "http://localhost:5000/payments";

// ========================================
// Create Lawyer Publishing Checkout
// ========================================
export const createLawyerPublishingCheckout = async (token: string) => {
  const response = await fetch(`${API_URL}/lawyer-publishing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create publishing payment");
  }

  return data;
};

// ========================================
// Verify Lawyer Publishing Payment
// ========================================
export const verifyLawyerPublishingPayment = async (
  sessionId: string,
  token: string,
) => {
  const response = await fetch(
    `${API_URL}/lawyer-publishing/verify?session_id=${encodeURIComponent(
      sessionId,
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify publishing payment");
  }

  return data;
};
