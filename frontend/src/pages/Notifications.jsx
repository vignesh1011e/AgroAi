import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/notifications");
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error("Notifications error:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Message": return "💬";
      case "Weather": return "☁️";
      case "AI": return "✦";
      case "Marketplace": return "🛒";
      case "Activity": return "✓";
      default: return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🔔</span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Activity alerts, community updates, and meteorological notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950 dark:border-neutral-700 dark:border-t-white" />
          <p className="mt-3">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="notion-callout text-xs text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/30">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-3xl mb-2">🔔</div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">All caught up</h3>
          <p className="mt-1 text-xs text-neutral-400">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start justify-between gap-4 p-4 transition ${
                  n.read ? "bg-white dark:bg-neutral-900" : "bg-neutral-50/70 dark:bg-neutral-800/40"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                    {getIcon(n.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-neutral-400">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="rounded-lg border border-neutral-200 px-2 py-1 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="h-6 w-6 rounded-md text-xs text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;