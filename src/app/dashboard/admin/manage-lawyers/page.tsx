"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  location: string;
  availability: boolean;
  published?: boolean;
}

export default function ManageLawyersPage() {
  const { token, loading: authLoading } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLawyers = async () => {
      if (!token) {
        setIsLoading(false);
        setError("You must be logged in as an admin.");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5000/lawyers/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load lawyers");
        }

        setLawyers(data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load lawyers.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLawyers();
  }, [token]);
 
  const handlePublishToggle = async (lawyerId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/lawyers/admin/${lawyerId}/publish`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update lawyer status");
      }

      setLawyers((previousLawyers) =>
        previousLawyers.map((lawyer) =>
          lawyer._id === lawyerId
            ? {
                ...lawyer,
                published: data.data.published,
              }
            : lawyer,
        ),
      );

      alert(data.message);
    } catch (error) {
      console.error(error);

      alert("Failed to update lawyer status.");
    }
  }
  const handleDelete = async (lawyerId: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this lawyer profile?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/lawyers/admin/${lawyerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lawyer");
      }

      setLawyers((previousLawyers) =>
        previousLawyers.filter((lawyer) => lawyer._id !== lawyerId),
      );

      alert("Lawyer deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete lawyer.");
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Manage Lawyers</h1>

        <p className="mt-8 text-center text-gray-500">Loading lawyers...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Manage Lawyers</h1>

        <p className="mt-8 text-center text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Manage Lawyers</h1>

      <p className="mt-2 text-gray-600">View all registered lawyers.</p>

      {lawyers.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No lawyers found.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full min-w-[900px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Specialization
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Experience
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Fee
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {lawyers.map((lawyer) => (
                <tr key={lawyer._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{lawyer.name}</td>

                  <td className="px-5 py-4 text-gray-600">{lawyer.email}</td>

                  <td className="px-5 py-4 text-gray-600">
                    {lawyer.specialization}
                  </td>

                  <td className="px-5 py-4">{lawyer.experience} Years</td>

                  <td className="px-5 py-4">${lawyer.consultationFee}</td>

                  <td className="px-5 py-4 text-gray-600">{lawyer.location}</td>

                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <div>
                        <span
                          className={
                            lawyer.published
                              ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                              : "rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700"
                          }
                        >
                          {lawyer.published ? "Published" : "Unpublished"}
                        </span>
                      </div>

                      <div>
                        <span
                          className={
                            lawyer.availability
                              ? "rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                              : "rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                          }
                        >
                          {lawyer.availability ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePublishToggle(lawyer._id)}
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                          lawyer.published
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {lawyer.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(lawyer._id)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
