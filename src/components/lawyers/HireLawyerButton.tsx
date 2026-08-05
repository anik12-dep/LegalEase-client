"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  lawyerId: string;
}

export default function HireLawyerButton({ lawyerId }: Props) {
  const router = useRouter();
  const { token } = useAuth();

  const handleHire = async () => {
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleHire}
      className="mt-8 rounded bg-blue-600 px-6 py-3 text-white"
    >
      Hire Lawyer
    </button>
  );
}
