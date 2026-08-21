"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import {
  getLawyerAppointments,
  updateAppointmentStatus,
} from "@/services/appointmentService";

interface Appointment {
  _id: string;
  clientId?: string;
  lawyerId?: string;
  status: string;
  createdAt: string;
}

export default function LawyerMyAppointmentsPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getLawyerAppointments(token);

      setAppointments(data.data || []);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load appointments.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    status: "accepted" | "rejected",
  ) => {
    if (!token) return;

    try {
      await updateAppointmentStatus(appointmentId, status, token);

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment,
        ),
      );

      alert(
        status === "accepted"
          ? "Appointment accepted successfully."
          : "Appointment rejected successfully.",
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to update appointment status.");
      }
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <p className="mt-8 text-center text-lg text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!token) {
    router.push("/login");
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <button
          onClick={fetchAppointments}
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Load Appointments"}
        </button>
      </div>

      {error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>

          <button
            onClick={fetchAppointments}
            className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && appointments.length === 0 && !isLoading && (
        <div className="mt-8 rounded-lg border bg-gray-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No appointments found
          </h2>

          <p className="mt-2 text-gray-500">
            You have not received any appointment requests yet.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 rounded-lg border bg-gray-50 p-10 text-center">
          <p className="text-lg text-gray-500">Loading appointments...</p>
        </div>
      )}

      {!isLoading && appointments.length > 0 && (
        <div className="mt-8 space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <p>
                <strong>Client ID:</strong>{" "}
                {appointment.clientId || "Not available"}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="capitalize">{appointment.status}</span>
              </p>

              <p className="mt-2">
                <strong>Date:</strong>{" "}
                {new Date(appointment.createdAt).toLocaleString()}
              </p>

              {appointment.status === "pending" && (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      handleStatusUpdate(appointment._id, "accepted")
                    }
                    className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(appointment._id, "rejected")
                    }
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
