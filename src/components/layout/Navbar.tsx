"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, token, loading, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
    <nav className="relative border-b bg-white">
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="rounded-md border px-3 py-2 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Menu */}
        <ul className="hidden items-center gap-6 font-medium md:flex">
          {/* Home */}
          <li>
            <Link
              href="/"
              className={`transition ${
                isActive("/")
                  ? "font-semibold text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              Home
            </Link>
          </li>

          {/* Browse Lawyers */}
          <li>
            <Link
              href="/browse-lawyers"
              className={`transition ${
                isActive("/browse-lawyers")
                  ? "font-semibold text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              Browse Lawyers
            </Link>
          </li>

          {!token ? (
            <>
              {/* Login */}
              <li>
                <Link
                  href="/login"
                  className={`transition ${
                    pathname === "/login"
                      ? "font-semibold text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Login
                </Link>
              </li>

              {/* Register */}
              <li>
                <Link
                  href="/register"
                  className={`transition ${
                    pathname === "/register"
                      ? "font-semibold text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
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
                    {/* Main Dashboard */}
                    <Link
                      href="/dashboard"
                      className="block rounded px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>

                    {/* User Menu */}
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

                        <Link
                          href="/dashboard/user/update-profile"
                          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Update Profile
                        </Link>
                        <Link
                          href="/dashboard/user/comments"
                          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Comments
                        </Link>
                      </>
                    )}

                    {/* Lawyer Menu */}
                    {user?.role === "lawyer" && (
                      <Link
                        href="/dashboard/lawyer"
                        className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Lawyer Dashboard
                      </Link>
                    )}

                    {/* Admin Menu */}
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
                  type="button"
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <FiLogOut className="text-base" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b bg-white p-4 shadow-md md:hidden">
            <div className="flex flex-col gap-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-l-md border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Search
                </button>
              </form>

              {/* Home */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded px-3 py-2 ${
                  isActive("/")
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Home
              </Link>

              {/* Browse Lawyers */}
              <Link
                href="/browse-lawyers"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded px-3 py-2 ${
                  isActive("/browse-lawyers")
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Browse Lawyers
              </Link>

              {!token ? (
                <>
                  {/* Login */}
                  <li>
                    <Link
                      href="/login"
                      className={`transition ${
                        isActive("/login")
                          ? "font-semibold text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Login
                    </Link>
                  </li>

                  {/* Register */}
                  <li>
                    <Link
                      href="/register"
                      className={`transition ${
                        isActive("/register")
                          ? "font-semibold text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded px-3 py-2 ${
                      isActive("/dashboard")
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </Link>

                  {user?.role === "user" && (
                    <>
                      <Link
                        href="/my-appointments"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded px-3 py-2 hover:bg-gray-100"
                      >
                        My Appointments
                      </Link>

                      <Link
                        href="/dashboard/user/hiring-history"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded px-3 py-2 hover:bg-gray-100"
                      >
                        Hiring History
                      </Link>

                      <Link
                        href="/dashboard/user/update-profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded px-3 py-2 hover:bg-gray-100"
                      >
                        Update Profile
                      </Link>

                      <Link
                        href="/dashboard/user/comments"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded px-3 py-2 hover:bg-gray-100"
                      >
                        Comments
                      </Link>
                    </>
                  )}

                  {user?.role === "lawyer" && (
                    <Link
                      href="/dashboard/lawyer"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded px-3 py-2 hover:bg-gray-100"
                    >
                      Lawyer Dashboard
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded px-3 py-2 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="rounded-md border border-red-200 px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
