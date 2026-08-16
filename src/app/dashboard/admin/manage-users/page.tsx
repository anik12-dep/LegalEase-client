"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function ManageUsersPage() {
  const { token, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const loadUsers = async () => {
      if (!token) {
        setIsLoading(false);
        setError("You must be logged in as an admin.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data.data || []);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [authLoading, token]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user,
        ),
      );

      alert("User role updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update user role.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId),
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

        <div className="mt-8 rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading users...</p>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600">You must be logged in as an admin.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

        <p className="mt-2 text-gray-600">
          Manage registered users, change their roles, or delete users.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 p-10 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Change Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="user">User</option>

                      <option value="lawyer">Lawyer</option>

                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
