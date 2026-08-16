"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLawyerAppointments } from "@/services/appointmentService";

interface Appointment {
  _id: string;
  userId: string;
  lawyerId: string;
  status: string;
  createdAt: string;
}

export default function LawyerDashboardPage() {
  const { user, token, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !token) return;

    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getLawyerAppointments(token);

        setAppointments(data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [token, authLoading]);

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>

        <p className="mt-8 text-center text-gray-500">
          Loading appointments...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>

        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>

      <p className="mt-2 text-gray-600">Welcome, {user?.name}</p>

      {/* Profile */}
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Profile</h2>

        <p className="mt-3 text-gray-600">Name: {user?.name}</p>

        <p className="mt-1 text-gray-600">Email: {user?.email}</p>

        <p className="mt-1 text-gray-600">Role: Lawyer</p>
      </div>

      {/* Hiring History */}
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Hiring History</h2>

            <p className="mt-1 text-gray-600">
              View and manage your client hiring requests.
            </p>
          </div>

          <Link
            href="/dashboard/lawyer/hiring-history"
            className="inline-flex w-fit rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            View Hiring History
          </Link>
        </div>
      </div>
      {/* Appointments */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Appointments</h2>

        {appointments.length === 0 ? (
          <div className="mt-5 rounded-lg border bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <p>
                  <strong>Client ID:</strong> {appointment.userId}
                </p>

                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{appointment.status}</span>
                </p>

                <p className="mt-2">
                  <strong>Appointment Date:</strong>{" "}
                  {new Date(appointment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lawyer Status */}
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Lawyer Status</h2>

        <p className="mt-3 text-green-600">Active</p>
      </div>
    </main>
  );
}
