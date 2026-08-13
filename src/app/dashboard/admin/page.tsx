"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <p className="mt-2 text-gray-600">Welcome, {user?.name}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Profile */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Profile</h2>

          <p className="mt-3 text-gray-600">Name: {user?.name}</p>

          <p className="mt-1 text-gray-600">Email: {user?.email}</p>

          <p className="mt-1 text-gray-600">Role: Admin</p>
        </div>

        {/* Lawyers */}
        <Link
          href="/dashboard/admin/manage-lawyers"
          className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">Lawyers</h2>

          <p className="mt-3 text-gray-600">
            Manage lawyers from the admin dashboard.
          </p>
        </Link>

        {/* Users */}
        <Link
          href="/dashboard/admin/manage-users"
          className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">Users</h2>

          <p className="mt-3 text-gray-600">
            Manage registered users from the admin dashboard.
          </p>
        </Link>
      </div>
    </main>
  );
}
