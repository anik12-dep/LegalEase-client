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
  const [showModal, setShowModal] = useState(false);

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

    setShowModal(true);
  };
  const confirmHire = async () => {
    if (!token) return;

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

      setShowModal(false);

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
    <>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Confirm Hiring Request
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to send a hiring request to this lawyer?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isHiring}
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmHire}
                disabled={isHiring}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isHiring ? "Sending..." : "Confirm Hire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
