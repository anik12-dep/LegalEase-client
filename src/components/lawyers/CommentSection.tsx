"use client";

import { useEffect, useState } from "react";

interface CommentUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface Comment {
  _id: string;
  userId: string;
  lawyerId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser | null;
}

interface CommentSectionProps {
  lawyerId: string;
}

export default function CommentSection({ lawyerId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/comments/lawyer/${lawyerId}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load comments");
      }

      setComments(data.data || []);
    } catch (error) {
      console.error("Get Comments Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/comments/lawyer/${lawyerId}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load comments");
        }

        if (active) {
          setComments(data.data || []);
        }
      } catch (error) {
        if (active) {
          console.error("Get Comments Error:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchComments();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [lawyerId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");

    if (!comment.trim()) {
      setMessage("Please write a comment.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to comment.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lawyerId,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      setComment("");
      setMessage("Comment added successfully.");

      await loadComments();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

      {/* Comments List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((item) => (
            <div key={item._id} className="rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                {item.user?.image ? (
                  <img
                    src={item.user.image}
                    alt={item.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {item.user?.name?.charAt(0) || "U"}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-900">
                    {item.user?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-700">{item.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {message && (
          <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Add Comment"}
        </button>
      </form>
    </section>
  );
}
