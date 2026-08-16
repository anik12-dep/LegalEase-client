"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { user, token, loading, logout } = useAuth();

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      router.push("/browse-lawyers");
      return;
    }

    router.push(`/browse-lawyers?search=${encodeURIComponent(trimmedSearch)}`);
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-bold text-blue-600">
          LegalEase
        </Link>

        {/* Global Search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:flex md:max-w-md"
        >
          <input
            type="text"
            placeholder="Search lawyers by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-l-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Menu */}
        <ul className="flex items-center gap-6 font-medium">
          {/* Home */}
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>

          {/* Browse Lawyers */}
          <li>
            <Link href="/browse-lawyers" className="hover:text-blue-600">
              Browse Lawyers
            </Link>
          </li>

          {!token ? (
            <>
              {/* Login */}
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>

              {/* Register */}
              <li>
                <Link href="/register" className="hover:text-blue-600">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* Dashboard Dropdown */}
              <li className="relative">
                <details className="group">
                  <summary className="cursor-pointer list-none hover:text-blue-600">
                    Dashboard ▾
                  </summary>

                  <div className="absolute right-0 z-50 mt-3 w-48 rounded-md border bg-white p-2 shadow-lg">
                    {user?.role === "user" && (
                      <>
                        <Link
                          href="/my-appointments"
                          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          My Appointments
                        </Link>

                        <Link
                          href="/dashboard/user/hiring-history"
                          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Hiring History
                        </Link>
                      </>
                    )}

                    {user?.role === "lawyer" && (
                      <Link
                        href="/dashboard/lawyer"
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Lawyer Dashboard
                      </Link>
                    )}

                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                </details>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
