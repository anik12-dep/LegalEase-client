"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Unable to Load Lawyer
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We could not load this lawyer&apos;s information right now. Please try
          again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
