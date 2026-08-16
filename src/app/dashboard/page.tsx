"use client";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {" "}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {" "}
        {/* Header */}{" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-gray-900">
            {" "}
            Welcome to your Dashboard{" "}
          </h1>{" "}
          <p className="mt-2 text-gray-600">
            {" "}
            Manage your profile, appointments, and hiring requests.{" "}
          </p>{" "}
        </div>{" "}
        {/* Profile Card */}{" "}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm sm:p-8">
          {" "}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {" "}
            {/* Profile Information */}{" "}
            <div className="flex items-center gap-5">
              {" "}
              {/* Profile Image */}{" "}
              <div className="shrink-0">
                {" "}
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                    {" "}
                    {user?.name?.charAt(0).toUpperCase() || "U"}{" "}
                  </div>
                )}{" "}
              </div>{" "}
              {/* User Details */}{" "}
              <div>
                {" "}
                <p className="text-sm font-medium text-gray-500">
                  {" "}
                  Your Profile{" "}
                </p>{" "}
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {" "}
                  {user?.name || "User"}{" "}
                </h2>{" "}
                <p className="mt-2 text-gray-600">
                  {" "}
                  {user?.email || "No email available"}{" "}
                </p>{" "}
                <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-700">
                  {" "}
                  {user?.role || "user"}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Update Profile */}{" "}
            <Link
              href="/dashboard/user/update-profile"
              className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
            >
              {" "}
              Update Profile{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
        {/* Dashboard Actions */}{" "}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {/* My Appointments */}{" "}
          <Link
            href="/my-appointments"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {" "}
            <h2 className="text-xl font-semibold text-gray-900">
              {" "}
              My Appointments{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-gray-600">
              {" "}
              View and manage your booked lawyer appointments.{" "}
            </p>{" "}
            <span className="mt-5 inline-block font-medium text-blue-600">
              {" "}
              View Appointments →{" "}
            </span>{" "}
          </Link>{" "}
          {/* Hiring History */}{" "}
          <Link
            href="/dashboard/user/hiring-history"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {" "}
            <h2 className="text-xl font-semibold text-gray-900">
              {" "}
              Hiring History{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-gray-600">
              {" "}
              View your lawyer hiring requests and payment status.{" "}
            </p>{" "}
            <span className="mt-5 inline-block font-medium text-blue-600">
              {" "}
              View Hiring History →{" "}
            </span>{" "}
          </Link>{" "}
          {/* Browse Lawyers */}{" "}
          <Link
            href="/browse-lawyers"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            {" "}
            <h2 className="text-xl font-semibold text-gray-900">
              {" "}
              Browse Lawyers{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-gray-600">
              {" "}
              Find and hire experienced lawyers for your legal needs.{" "}
            </p>{" "}
            <span className="mt-5 inline-block font-medium text-blue-600">
              {" "}
              Browse Lawyers →{" "}
            </span>{" "}
          </Link>{" "}
        </div>{" "}
      </main>{" "}
    </ProtectedRoute>
  );
}
