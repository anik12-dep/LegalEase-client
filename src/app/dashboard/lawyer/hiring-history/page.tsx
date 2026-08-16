"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getLawyerAppointments,
  updateAppointmentStatus,
} from "@/services/appointmentService";

interface Appointment {
  _id: string;
  userId: string;
  lawyerId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export default function LawyerHiringHistoryPage() {
  const { token, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !token) {
      return;
    }

    let isMounted = true;

    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getLawyerAppointments(token);

        if (isMounted) {
          setAppointments(data.data || []);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setError("Failed to load hiring history.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [token, authLoading]);

  const handleStatusChange = async (
    appointmentId: string,
    status: "accepted" | "rejected",
  ) => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setError("");

      await updateAppointmentStatus(appointmentId, status, token);

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment,
        ),
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update appointment status.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Hiring History</h1>

        <p className="mt-8 text-center text-gray-500">
          Loading hiring history...
        </p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Hiring History</h1>

        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">You must be logged in as a lawyer.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Hiring History</h1>

      <p className="mt-2 text-gray-600">
        View your lawyer hiring requests and manage their status.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No hiring requests found.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Client</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {appointment.userId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Request Date</p>

                  <p className="mt-1 text-gray-900">
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>

                  <p
                    className={`mt-1 font-semibold capitalize ${
                      appointment.status === "accepted"
                        ? "text-green-600"
                        : appointment.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {appointment.status}
                  </p>
                </div>
              </div>

              {appointment.status === "pending" && (
                <div className="mt-6 flex gap-3 border-t pt-5">
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "accepted")
                    }
                    disabled={updatingId === appointment._id}
                    className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === appointment._id ? "Updating..." : "Accept"}
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "rejected")
                    }
                    disabled={updatingId === appointment._id}
                    className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === appointment._id ? "Updating..." : "Reject"}
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
