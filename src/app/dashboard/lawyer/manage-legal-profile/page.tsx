"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  createLawyerPublishingCheckout,
  verifyLawyerPublishingPayment,
} from "@/services/paymentService";

interface LawyerProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  location: string;
  image: string;
  bio: string;
  availability: boolean;
  published?: boolean;
  createdAt?: string;
}

export default function ManageLegalProfilePage() {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<LawyerProfile | null>(null);

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    location: "",
    image: "",
    bio: "",
    availability: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Load Lawyer Profile
  // =========================
  useEffect(() => {
    if (authLoading || !token) return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/lawyers/my-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load lawyer profile");
        }

        const lawyer = data.data;

        setProfile(lawyer);

        setFormData({
          specialization: lawyer.specialization || "",
          experience: lawyer.experience?.toString() || "",
          consultationFee: lawyer.consultationFee?.toString() || "",
          location: lawyer.location || "",
          image: lawyer.image || "",
          bio: lawyer.bio || "",
          availability:
            typeof lawyer.availability === "boolean"
              ? lawyer.availability
              : true,
        });
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load lawyer profile.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token, authLoading]);
  // =========================
  // Verify Stripe Publishing Payment
  // =========================
  useEffect(() => {
    if (authLoading || !token) return;

    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(window.location.search);

      const paymentStatus = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");

      if (paymentStatus !== "success" || !sessionId) {
        return;
      }

      try {
        setIsPublishing(true);
        setError("");
        setSuccess("");

        const paymentData = await verifyLawyerPublishingPayment(
          sessionId,
          token,
        );

        if (paymentData.published) {
          setSuccess(
            "Publishing payment successful. Your lawyer profile is now published.",
          );

          // Update profile status immediately
          setProfile((previous) =>
            previous
              ? {
                  ...previous,
                  published: true,
                }
              : previous,
          );
        }

        // Remove Stripe query parameters from URL
        window.history.replaceState(
          {},
          "",
          "/dashboard/lawyer/manage-legal-profile",
        );
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to verify publishing payment.");
        }
      } finally {
        setIsPublishing(false);
      }
    };

    verifyPayment();
  }, [token, authLoading]);
  // =========================
  // Handle Input
  // =========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // Save Profile
  // =========================
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    setError("");
    setSuccess("");

    try {
      setIsSaving(true);

      const response = await fetch("http://localhost:5000/lawyers/my-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          specialization: formData.specialization,
          experience: Number(formData.experience),
          consultationFee: Number(formData.consultationFee),
          location: formData.location,
          image: formData.image,
          bio: formData.bio,
          availability: formData.availability,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.data);

      setSuccess("Lawyer profile updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update lawyer profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // Publish / Unpublish
  // =========================
  const handlePublishToggle = async () => {
    if (!token || !profile) return;

    setError("");
    setSuccess("");

    try {
      setIsPublishing(true);

      // ========================================
      // UNPUBLISH
      // ========================================
      if (profile.published) {
        const response = await fetch(
          "http://localhost:5000/lawyers/my-profile/publish",
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to unpublish lawyer profile");
        }

        setProfile(data.data);

        setSuccess("Your lawyer profile has been unpublished.");

        return;
      }

      // ========================================
      // PUBLISH → STRIPE PAYMENT
      // ========================================
      const data = await createLawyerPublishingCheckout(token);

      if (!data.url) {
        throw new Error("Stripe checkout URL was not created.");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update publishing status.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // =========================
  // Delete Profile
  // =========================
  const handleDelete = async () => {
    if (!token || !profile) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your lawyer profile? This action cannot be undone.",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      setIsDeleting(true);

      const response = await fetch("http://localhost:5000/lawyers/my-profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lawyer profile");
      }

      setProfile(null);

      setSuccess("Lawyer profile deleted successfully.");

      setTimeout(() => {
        router.push("/dashboard/lawyer");
      }, 1000);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete lawyer profile.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================
  // Loading
  // =========================
  if (authLoading || isLoading) {
    return (
      <ProtectedRoute>
        <main className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Legal Profile
          </h1>

          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200" />
            <div className="h-12 rounded bg-gray-200" />
            <div className="h-12 rounded bg-gray-200" />
            <div className="h-32 rounded bg-gray-200" />
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Legal Profile
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your professional lawyer information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/lawyer")}
            className="w-fit rounded-lg border px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-600">
            {success}
          </div>
        )}

        {/* Profile Status */}
        {profile && (
          <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Status
                </h2>

                <p className="mt-2 text-gray-600">
                  {profile.published ? (
                    <span className="font-medium text-green-600">
                      Published
                    </span>
                  ) : (
                    <span className="font-medium text-orange-600">
                      Unpublished
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePublishToggle}
                  disabled={isPublishing}
                  className={`rounded-lg px-5 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    profile.published
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isPublishing
                    ? "Updating..."
                    : profile.published
                      ? "Unpublish Profile"
                      : "Publish Profile"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Profile"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        {profile ? (
          <form
            onSubmit={handleSave}
            className="mt-8 rounded-lg border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Professional Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Criminal Law"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Consultation Fee
                </label>

                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste your ImgBB image URL"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Lawyer profile preview"
                      className="h-40 w-40 rounded-lg border object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Professional Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a short professional summary..."
                  required
                  className="w-full resize-none rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Availability */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Availability
                </label>

                <select
                  name="availability"
                  value={formData.availability ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((previous) => ({
                      ...previous,
                      availability: e.target.value === "true",
                    }))
                  }
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                >
                  <option value="true">Available</option>
                  <option value="false">Busy</option>
                </select>
              </div>
            </div>

            {/* Save */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 rounded-lg border bg-gray-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No Lawyer Profile Found
            </h2>

            <p className="mt-2 text-gray-600">
              Your lawyer profile has not been created yet.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Logged in as: {user?.email}
            </p>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
