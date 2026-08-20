export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="animate-pulse">
        {/* Image Skeleton */}
        <div className="mx-auto h-[400px] w-full max-w-md rounded-2xl bg-gray-200" />

        {/* Name Skeleton */}
        <div className="mt-8 h-10 w-64 rounded bg-gray-200" />

        {/* Specialization Skeleton */}
        <div className="mt-4 h-6 w-48 rounded bg-gray-200" />

        {/* Information Skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-5 w-56 rounded bg-gray-200" />
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-5 w-52 rounded bg-gray-200" />
          <div className="h-5 w-44 rounded bg-gray-200" />
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-20 w-full rounded bg-gray-200" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-8 h-12 w-40 rounded-md bg-gray-200" />
      </div>
    </main>
  );
}
