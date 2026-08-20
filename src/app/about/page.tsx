import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm md:p-12">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            About LegalEase
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Making Legal Services Easier
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            LegalEase is a legal service platform designed to help users find
            experienced lawyers, explore their professional expertise, compare
            consultation fees, and book legal appointments conveniently.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Find Lawyers
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Browse lawyers based on specialization, experience, and location.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare Expertise
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Explore lawyer profiles and compare their professional information
              and consultation fees.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Book Appointments
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Connect with legal professionals and manage your legal
              appointments through LegalEase.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/browse-lawyers"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Lawyers
          </Link>
        </div>
      </section>
    </main>
  );
}
