"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const userLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "My Appointments",
      href: "/dashboard/user/my-appointments",
    },

    {
      label: "Hiring History",
      href: "/dashboard/user/hiring-history",
    },
    {
      label: "Update Profile",
      href: "/dashboard/user/update-profile",
    },
    {
      label: "Comments",
      href: "/dashboard/user/comments",
    },
  ];

  const lawyerLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Manage Legal Profile",
      href: "/dashboard/lawyer/manage-legal-profile",
    },
    {
      label: "My Appointments",
      href: "/dashboard/lawyer/my-appointments",
    },
    {
      label: "Hiring History",
      href: "/dashboard/lawyer/hiring-history",
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/manage-users",
    },
    {
      label: "Manage Lawyers",
      href: "/dashboard/admin/manage-lawyers",
    },
  ];

  const links =
    user?.role === "lawyer"
      ? lawyerLinks
      : user?.role === "admin"
        ? adminLinks
        : userLinks;

  return (
    <ProtectedRoute>
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="w-full shrink-0 rounded-xl border bg-white p-4 shadow-sm lg:w-64">
          {/* Sidebar Header */}
          <div className="mb-5 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

            <p className="mt-1 text-sm capitalize text-gray-500">
              {user?.role || "user"} Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </ProtectedRoute>
  );
}
