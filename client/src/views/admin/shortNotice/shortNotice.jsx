import React, { useState, useEffect } from "react";
import {
  createShortNoticeAPI,
  getAllShortNoticesAPI,
  updateShortNoticeAPI,
  deleteShortNoticeAPI
} from "../../../components/backendApis/admin/apis/shortNotice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateTime } from "../../../components/utils/formatTimeDate";

export default function ShortNotice({ notices = [], onCreate }) {
  const [allNotices, setAllNotices] = useState(notices);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  // Fetch all notices on mount
  useEffect(() => {
    const fetchNotices = async () => {
      setFetching(true);
      try {
        const result = await getAllShortNoticesAPI();
        if (result.success) {
          setAllNotices(
            result.data.map((item) => ({
              id: item.id,
              message: item.content,
              status: item.status || "active",
              createdAt: item.created_at || new Date().toISOString(),
            }))
          );
        } else {
          toast.error(result.message || "Failed to fetch notices.");
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        toast.error("Something went wrong while fetching notices.");
      } finally {
        setFetching(false);
      }
    };

    fetchNotices();
  }, []);

  // Create or update notice
  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (editingNotice) {
        result = await updateShortNoticeAPI(editingNotice.id, {
          content: message,
          status,
        });
      } else {
        result = await createShortNoticeAPI({
          content: message,
          status,
        });
      }

      if (result.success) {
        const updatedNotice = {
          id: result.data.id,
          message: result.data.content,
          createdAt: editingNotice
            ? editingNotice.createdAt
            : new Date().toISOString(),
          status: result.data.status || "active",
        };

        if (editingNotice) {
          setAllNotices((prev) =>
            prev.map((item) =>
              item.id === editingNotice.id ? updatedNotice : item
            )
          );
        } else {
          setAllNotices((prev) => [updatedNotice, ...prev]);
        }

        onCreate?.(updatedNotice);

        toast.success(result.message || "Notice saved successfully!");
        setMessage("");
        setStatus("active");
        setOpen(false);
        setEditingNotice(null);
      } else {
        toast.error(result.message || "Failed to save notice.");
      }
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit notice
  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setMessage(notice.message);
    setStatus(notice.status);
    setOpen(true);
  };

  // Toggle active/inactive status
  const toggleStatus = () => {
    setStatus((prev) => (prev === "active" ? "inactive" : "active"));
  };

  // Delete notice
  const deleteNotice = async (id) => {
    setLoading(true);
    try {
      const result = await deleteShortNoticeAPI(id);
      if (result.success) {
        setAllNotices((prev) => prev.filter((item) => item.id !== id));
        toast.success(result.message || "Notice deleted successfully!");
        if (editingNotice && editingNotice.id === id) {
          setOpen(false);
          setEditingNotice(null);
          setMessage("");
          setStatus("active");
        }
      } else {
        toast.error(result.message || "Failed to delete notice.");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-white shadow-md rounded-lg relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Short Notices</h2>
        <button
          onClick={() => {
            setEditingNotice(null);
            setMessage("");
            setStatus("active");
            setOpen(true);
          }}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + New Notice
        </button>
      </div>

      {fetching ? (
        <p className="text-center text-slate-500 py-10">Loading notices...</p>
      ) : allNotices.length === 0 ? (
        <p className="text-center text-slate-500 py-10">
          No short notices available.
        </p>
      ) : (
        <ul className="space-y-4">
          {allNotices.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded-lg flex flex-col gap-2 bg-slate-50 hover:bg-slate-100 transition relative"
            >
              <p
                className="text-slate-800 text-sm cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                {item.message}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{formatDateTime(item.createdAt)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              {/* Delete button for quick delete */}
              <button
                onClick={() => deleteNotice(item.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">
              {editingNotice ? "Edit Notice" : "Create New Notice"}
            </h3>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Enter message..."
            />
            <p className="text-xs text-slate-500 mt-1">
              {message.length}/200 characters
            </p>

            {editingNotice && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-slate-700">Status:</span>
                <button
                  onClick={toggleStatus}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </button>
              </div>
            )}

            <div className="flex justify-between gap-3 mt-5">
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditingNotice(null);
                    setStatus("active");
                    setMessage("");
                  }}
                  className="px-4 py-2 text-sm border rounded hover:bg-slate-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading
                    ? editingNotice
                      ? "Saving..."
                      : "Creating..."
                    : editingNotice
                    ? "Save Changes"
                    : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
