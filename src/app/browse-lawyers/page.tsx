"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getLawyers } from "@/services/lawyerService";
import type { Lawyer } from "@/types/lawyer";

export default function BrowseLawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      setError("");
      setIsLoading(true);
      setIsLoading(false);
      try {
        const data = await getLawyers(
          currentPage,
          search,
          availability,
          minFee,
          maxFee,
          sort,
        );
        setLawyers(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
        setError("Failed to load lawyers.");
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, [currentPage, search, availability, minFee, maxFee, sort]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Browse Lawyers</h1>

        <p className="mt-8 text-center text-lg">Loading...</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Browse Lawyers</h1>

        <p className="mt-8 text-center text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Browse Lawyers</h1>

      <input
        type="text"
        placeholder="Search by name, specialization or location..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-8 w-full rounded-md border p-3 outline-none"
      />
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <select
          value={availability}
          onChange={(e) => {
            setAvailability(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border p-3"
        >
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>

        <input
          type="number"
          placeholder="Minimum Fee"
          value={minFee}
          onChange={(e) => {
            setMinFee(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border p-3"
        />

        <input
          type="number"
          placeholder="Maximum Fee"
          value={maxFee}
          onChange={(e) => {
            setMaxFee(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border p-3"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border p-3"
        >
          <option value="">Sort By</option>
          <option value="feeLow">Fee: Low → High</option>
          <option value="feeHigh">Fee: High → Low</option>
          <option value="experienceLow">Experience: Low → High</option>
          <option value="experienceHigh">Experience: High → Low</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lawyers.map((lawyer) => (
          <div key={lawyer._id} className="rounded-lg border p-5 shadow-sm">
            <img
              src={lawyer.image}
              alt={lawyer.name}
              className="mb-4 h-56 w-full rounded-md object-cover"
            />

            <h2 className="text-xl font-semibold">{lawyer.name}</h2>

            <p className="mt-2 text-gray-600">{lawyer.specialization}</p>

            <p className="mt-1">
              <strong>Experience:</strong> {lawyer.experience} Years
            </p>

            <p>
              <strong>Fee:</strong> ${lawyer.consultationFee}
            </p>

            <p>
              <strong>Location:</strong> {lawyer.location}
            </p>

            <Link
              href={`/lawyers/${lawyer._id}`}
              className="mt-5 block rounded bg-blue-600 py-2 text-center text-white"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`rounded px-4 py-2 ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "border"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
