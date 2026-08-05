import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-4">Welcome to your dashboard.</p>
      </main>
    </ProtectedRoute>
  );
}
