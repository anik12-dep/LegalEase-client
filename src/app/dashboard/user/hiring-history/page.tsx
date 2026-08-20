"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getMyAppointments,
  createCheckoutSession,
  verifyPayment,
} from "@/services/appointmentService";

interface Lawyer {
  _id: string;
  name: string;
  specialization?: string;
  consultationFee?: number;
}

interface Appointment {
  _id: string;
  lawyerId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  paymentStatus?: "unpaid" | "paid";
  lawyer?: Lawyer | null;
}

export default function UserHiringHistoryPage() {
  const { token, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !token) {
      return;
    }

    let isMounted = true;

    const loadAppointments = async () => {
      try {
        const data = await getMyAppointments(token);

        if (!isMounted) {
          return;
        }

        setAppointments(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Hiring History Error:", error);

        if (!isMounted) {
          return;
        }

        setError("Failed to load hiring history.");
        setIsLoading(false);
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [authLoading, token]);

  // 👇 এইটার ঠিক পরে নতুন useEffect
  useEffect(() => {
    if (authLoading || !token) {
      return;
    }

    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus !== "success" || !sessionId) {
      return;
    }

    const verifyStripePayment = async () => {
      try {
        setError("");

        await verifyPayment(sessionId, token);

        const data = await getMyAppointments(token);

        setAppointments(data.data || []);
        window.history.replaceState({}, "", "/dashboard/user/hiring-history");
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to verify payment.");
        }
      }
    };

    verifyStripePayment();
  }, [authLoading, token, searchParams]);

  const handlePayment = async (appointmentId: string) => {
    if (!token) {
      setError("You must be logged in to make a payment.");
      return;
    }

    try {
      setPaymentLoadingId(appointmentId);
      setError("");

      const data = await createCheckoutSession(appointmentId, token);

      if (!data.url) {
        throw new Error("Payment checkout URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Payment Error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to start payment.");
      }

      setPaymentLoadingId(null);
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
          <p className="text-red-600">
            You must be logged in to view hiring history.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hiring History</h1>

        <p className="mt-2 text-gray-600">
          View your lawyer hiring requests and payment status.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No hiring history found.</p>

          <Link
            href="/browse-lawyers"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Browse Lawyers
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="grid gap-6 md:grid-cols-5">
                <div>
                  <p className="text-sm text-gray-500">Lawyer</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {appointment.lawyer?.name || "Lawyer"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Specialization</p>

                  <p className="mt-1 text-gray-900">
                    {appointment.lawyer?.specialization || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fee</p>

                  <p className="mt-1 text-gray-900">
                    {appointment.lawyer?.consultationFee
                      ? `৳${appointment.lawyer.consultationFee}`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Hiring Date</p>

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

              {appointment.status === "accepted" && (
                <div className="mt-6 border-t pt-5">
                  {appointment.paymentStatus === "paid" ? (
                    <div>
                      <p className="font-semibold text-green-600">
                        Payment successful
                      </p>

                      <button
                        type="button"
                        disabled
                        className="mt-3 rounded-lg bg-gray-400 px-5 py-2 font-medium text-white"
                      >
                        Paid
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Your hiring request has been accepted. You can now
                        complete the payment.
                      </p>

                      <button
                        type="button"
                        onClick={() => handlePayment(appointment._id)}
                        disabled={paymentLoadingId === appointment._id}
                        className="mt-3 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {paymentLoadingId === appointment._id
                          ? "Redirecting..."
                          : "Pay Now"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
