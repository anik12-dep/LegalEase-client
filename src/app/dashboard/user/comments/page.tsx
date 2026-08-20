"use client";

import { useEffect, useState } from "react";

interface Comment {
  _id: string;
  lawyerId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [message, setMessage] = useState("");

  const loadComments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/comments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load comments");
      }

      setComments(data.data || []);
    } catch (error) {
      console.error("Load Comments Error:", error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to load comments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadComments();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (item: Comment) => {
    setEditingId(item._id);
    setEditText(item.comment);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdate = async (id: string) => {
    if (!editText.trim()) {
      setMessage("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await fetch(`http://localhost:5000/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: editText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update comment");
      }

      setMessage("Comment updated successfully.");
      setEditingId(null);
      setEditText("");

      await loadComments();
    } catch (error) {
      console.error("Update Comment Error:", error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to update comment.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await fetch(`http://localhost:5000/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete comment");
      }

      setMessage("Comment deleted successfully.");

      await loadComments();
    } catch (error) {
      console.error("Delete Comment Error:", error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to delete comment.");
      }
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">My Comments</h1>

        <p className="mt-6 text-gray-500">Loading comments...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Comments</h1>

        <p className="mt-2 text-gray-500">
          Manage your comments on lawyer profiles.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          {message}
        </div>
      )}

      {comments.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">You have not posted any comments yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Lawyer ID</p>

                  <p className="mt-1 break-all font-mono text-sm text-gray-700">
                    {item.lawyerId}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {editingId === item._id ? (
                <div className="space-y-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item._id)}
                      className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-md border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800">{item.comment}</p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
