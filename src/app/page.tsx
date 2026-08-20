"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLawyers } from "@/services/lawyerService";

import type { Lawyer } from "@/types/lawyer";

export default function HomePage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [topExperts, setTopExperts] = useState<Lawyer[]>([]);
  const [topExpertsLoading, setTopExpertsLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      icon: "⚖️",
      title: "Find & Hire Expert Legal Counsel",
      description:
        "Connect with experienced lawyers, explore their expertise, compare consultation fees, and book legal appointments with confidence.",
    },
    {
      icon: "🏛️",
      title: "Connect With Trusted Legal Professionals",
      description:
        "Discover qualified lawyers from different legal fields and find the right professional for your legal needs.",
    },
    {
      icon: "📜",
      title: "Get the Right Legal Help",
      description:
        "Explore legal experts, check their experience and consultation fees, and hire the lawyer that best fits your needs.",
    },
  ];

  useEffect(() => {
    const fetchFeaturedLawyers = async () => {
      try {
        const response = await getLawyers(1, "", "", "", "", "");

        setLawyers(response.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Failed to fetch featured lawyers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLawyers();
  }, []);

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/appointments/top-experts",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch top legal experts");
        }

        const data = await response.json();

        setTopExperts((data.data || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch top legal experts:", error);
      } finally {
        setTopExpertsLoading(false);
      }
    };

    fetchTopExperts();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((previous) =>
        previous === heroSlides.length - 1 ? 0 : previous + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative min-h-[600px] overflow-hidden rounded-3xl bg-white shadow-xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid min-h-[600px] items-center gap-10 p-8 md:grid-cols-2 md:p-14"
            >
              {/* Hero Content */}
              <div>
                <p className="mb-4 font-semibold uppercase tracking-wider text-blue-600">
                  Trusted Legal Services
                </p>

                <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                  {heroSlides[currentSlide].title}
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  {heroSlides[currentSlide].description}
                </p>

                <div className="mt-8">
                  <Link
                    href="/browse-lawyers"
                    className="inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:scale-105 hover:bg-blue-700"
                  >
                    Browse Lawyers
                  </Link>
                </div>
              </div>

              {/* Legal Visual */}
              <div className="flex justify-center">
                <div className="flex h-80 w-full max-w-md flex-col items-center justify-center rounded-3xl bg-blue-50 p-8">
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-6xl">
                    {heroSlides[currentSlide].icon}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    LegalEase
                  </h2>

                  <p className="mt-2 text-center text-gray-500">
                    Professional legal services at your fingertips.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Previous Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((previous) =>
                  previous === 0 ? heroSlides.length - 1 : previous - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-xl font-bold text-gray-700 shadow-md transition hover:bg-blue-600 hover:text-white"
              aria-label="Previous slide"
            >
              ←
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((previous) =>
                  previous === heroSlides.length - 1 ? 0 : previous + 1,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-xl font-bold text-gray-700 shadow-md transition hover:bg-blue-600 hover:text-white"
              aria-label="Next slide"
            >
              →
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-8 bg-blue-600"
                      : "w-3 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Lawyers
          </h2>

          <p className="mt-3 text-gray-600">
            Explore experienced legal professionals available on LegalEase.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading lawyers...
          </div>
        ) : lawyers.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No lawyers available at the moment.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {lawyers.map((lawyer) => (
              <motion.div
                key={lawyer._id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Lawyer Image */}
                <div className="h-52 bg-gray-100">
                  {lawyer.image ? (
                    <img
                      src={lawyer.image}
                      alt={lawyer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">
                      👨‍⚖️
                    </div>
                  )}
                </div>

                {/* Lawyer Information */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    {lawyer.name}
                  </h3>

                  <p className="mt-1 font-medium text-blue-600">
                    {lawyer.specialization}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {lawyer.experience} years
                    </p>

                    <p>
                      <span className="font-semibold">Consultation Fee:</span> ৳
                      {lawyer.consultationFee}
                    </p>

                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {lawyer.location}
                    </p>
                  </div>

                  <Link
                    href={`/lawyers/${lawyer._id}`}
                    className="mt-5 block rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
      {/* Top Legal Experts */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Top Legal Experts
            </h2>

            <p className="mt-3 text-gray-600">
              Meet some of the most trusted and frequently hired legal experts.
            </p>
          </div>

          {topExpertsLoading ? (
            <div className="py-10 text-center text-gray-500">
              Loading top legal experts...
            </div>
          ) : topExperts.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No top legal experts available yet.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="flex flex-wrap justify-center gap-6"
            >
              {topExperts.map((lawyer) => (
                <motion.div
                  key={lawyer._id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  whileHover={{
                    scale: 1.03,
                  }}
                  className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-sm transition"
                >
                  {/* Avatar */}
                  <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full bg-blue-100">
                    {lawyer.image ? (
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        👨‍⚖️
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {lawyer.name}
                  </h3>

                  <p className="mt-2 font-medium text-blue-600">
                    {lawyer.specialization}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {lawyer.experience} years experience
                  </p>

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Most Hired Expert
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      {/* Legal Categories */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Legal Categories
            </h2>

            <p className="mt-3 text-gray-600">
              Find lawyers based on your legal needs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              "Criminal Law",
              "Corporate Law",
              "Family Law",
              "Civil Law",
              "Property Law",
              "Immigration Law",
              "Tax Law",
              "Cyber Law",
            ].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/browse-lawyers?search=${encodeURIComponent(category)}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-blue-500 hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                    ⚖️
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {category}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Find {category.toLowerCase()} experts
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
