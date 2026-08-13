"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  lawyerId: string;
  availability: boolean;
}

export default function HireLawyerButton({ lawyerId, availability }: Props) {
  const router = useRouter();
  const { token } = useAuth();

  const handleHire = async () => {
    // Guest user
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lawyerId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Appointment booked successfully!");
        router.push("/my-appointments");
      } else {
        alert(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // Lawyer unavailable
  if (!availability) {
    return (
      <button
        disabled
        className="mt-8 rounded bg-gray-400 px-6 py-3 text-white"
      >
        Currently Unavailable
      </button>
    );
  }

  // Lawyer available + user logged in/out
  return (
    <button
      onClick={handleHire}
      className="mt-8 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
    >
      {token ? "Hire Lawyer" : "Login to Hire"}
    </button>
  );
}
