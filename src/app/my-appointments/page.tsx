"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import {
  getMyAppointments,
  cancelAppointment,
} from "@/services/appointmentService";

interface Appointment {
  _id: string;
  lawyerId: string;
  status: string;
  createdAt: string;
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCancel = async (id: string) => {
    if (!token) return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) return;

    try {
      await cancelAppointment(id, token);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id),
      );

      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel appointment.");
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError("");
      setIsLoading(true);
      try {
        const data = await getMyAppointments(token);
        setAppointments(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load appointments.");
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token, loading, router]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <p className="mt-8 text-center text-lg">Loading...</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <p className="mt-8 text-center text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border p-5 shadow-sm"
            >
              <p>
                <strong>Lawyer ID:</strong> {appointment.lawyerId}
              </p>

              <p>
                <strong>Status:</strong> {appointment.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleCancel(appointment._id)}
                className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Cancel Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
