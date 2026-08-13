"use client";

import { useEffect, useState } from "react";

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  location: string;
  availability: boolean;
}

export default function ManageLawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLawyers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/lawyers?limit=100",
          {
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
  }, []);

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
                    <span
                      className={
                        lawyer.availability
                          ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                      }
                    >
                      {lawyer.availability ? "Available" : "Busy"}
                    </span>
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
