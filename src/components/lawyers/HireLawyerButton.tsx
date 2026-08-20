"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface Props {
  lawyerId: string;
  availability: boolean;
}

export default function HireLawyerButton({ lawyerId, availability }: Props) {
  const router = useRouter();
  const { token, user } = useAuth();

  const [isHiring, setIsHiring] = useState(false);

  const handleHire = async () => {
    // Guest user
    if (!token) {
      router.push("/login");
      return;
    }

    // Lawyer cannot hire another lawyer
    if (user?.role === "lawyer") {
      alert("Lawyers cannot hire lawyers.");
      return;
    }

    // Lawyer unavailable
    if (!availability) {
      alert("This lawyer is currently unavailable.");
      return;
    }

    try {
      setIsHiring(true);

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

      if (!response.ok) {
        alert(data.message || "Failed to send hiring request.");
        return;
      }

      alert("Hiring request sent successfully!");

      // Go to user's hiring/appointment history
      router.push("/dashboard/user/hiring-history");
    } catch (error) {
      console.error("Hire Lawyer Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsHiring(false);
    }
  };

  // Lawyer unavailable
  if (!availability) {
    return (
      <button
        disabled
        className="mt-8 rounded-lg bg-gray-400 px-6 py-3 font-medium text-white"
      >
        Currently Unavailable
      </button>
    );
  }
  return (
    <button
      onClick={handleHire}
      disabled={isHiring}
      className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isHiring
        ? "Sending Request..."
        : token
          ? "Hire Lawyer"
          : "Login to Hire"}
    </button>
  );
}
