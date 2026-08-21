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
      setError("");

      try {
        const data = await getMyAppointments(token);

        setAppointments(data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token, loading, router]);

  if (loading || isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <p className="mt-8 text-center text-lg text-gray-500">
          Loading appointments...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No appointments found
          </h2>

          <p className="mt-2 text-gray-500">
            You have not booked any lawyer appointments yet.
          </p>

          <button
            onClick={() => router.push("/browse-lawyers")}
            className="mt-5 rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Browse Lawyers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <p>
                <strong>Lawyer ID:</strong> {appointment.lawyerId}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="capitalize">{appointment.status}</span>
              </p>

              <p className="mt-2">
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
