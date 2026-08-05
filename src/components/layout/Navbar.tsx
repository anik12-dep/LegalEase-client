"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { token, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LegalEase
        </Link>

        {/* Menu */}
        <ul className="flex items-center gap-6 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>

          <li>
            <Link href="/browse-lawyers">Browse Lawyers</Link>
          </li>

          {!token ? (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>

              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600"
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
