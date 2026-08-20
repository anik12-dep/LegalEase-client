"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getLawyers } from "@/services/lawyerService";
import type { Lawyer } from "@/types/lawyer";

function LawyerSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-3 shadow-sm sm:p-5">
      <div className="mb-4 h-40 w-full rounded-md bg-gray-200 sm:h-56" />

      <div className="h-6 w-3/4 rounded bg-gray-200" />

      <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />

      <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />

      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />

      <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />

      <div className="mt-5 h-10 w-full rounded bg-gray-200" />
    </div>
  );
}

export default function BrowseLawyersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  // Navbar search এবং page search একই search ব্যবহার করবে
  const search = searchParams.get("search") || "";

  const [availability, setAvailability] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Search change হলে URL update করবে
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.replace(`/browse-lawyers?${params.toString()}`);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      setError("");

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
        setError("Unable to load lawyers right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, [currentPage, search, availability, minFee, maxFee, sort]);

  // Loading State
  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold">Browse Lawyers</h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <LawyerSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Browse Lawyers</h1>

        <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Browse Lawyers</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, specialization or location..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="mb-8 w-full rounded-md border p-3 outline-none focus:border-blue-500"
      />

      {/* Filters */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Availability */}
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

        {/* Minimum Fee */}
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

        {/* Maximum Fee */}
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

        {/* Sort */}
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

      {/* Lawyers */}
      {lawyers.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No lawyers found
          </h2>

          <p className="mt-2 text-gray-500">
            No lawyers match your current search or filters. Try changing your
            search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {lawyers.map((lawyer) => (
            <Link
              key={lawyer._id}
              href={`/lawyers/${lawyer._id}`}
              className="group block rounded-lg border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              {/* Lawyer Image */}
              <div className="relative">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="mb-4 h-40 w-full rounded-md object-cover sm:h-56"
                />

                {/* Busy Badge */}
                {!lawyer.availability && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                    Busy
                  </span>
                )}
              </div>

              {/* Lawyer Information */}
              <h2 className="text-lg font-semibold group-hover:text-blue-600 sm:text-xl">
                {lawyer.name}
              </h2>

              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                {lawyer.specialization}
              </p>

              <p className="mt-2 text-sm sm:text-base">
                <strong>Experience:</strong> {lawyer.experience} Years
              </p>

              <p className="text-sm sm:text-base">
                <strong>Hourly Rate:</strong> ৳{lawyer.consultationFee}
              </p>

              <p className="text-sm sm:text-base">
                <strong>Location:</strong> {lawyer.location}
              </p>

              <div className="mt-5 rounded bg-blue-600 py-2 text-center text-sm font-medium text-white transition group-hover:bg-blue-700 sm:text-base">
                View Details
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lawyers.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
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
      )}
    </main>
  );
}
