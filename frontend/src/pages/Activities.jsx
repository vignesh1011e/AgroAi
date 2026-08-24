import { useEffect, useState } from "react";
import API from "../services/api";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    type: "Planting",
    date: "",
    status: "Pending",
    description: "",
  });

  const filters = ["All", "Pending", "Completed", "Upcoming"];
  const activityTypes = [
    "Planting",
    "Irrigation",
    "Fertilizing",
    "Pest Control",
    "Land Preparation",
    "Harvesting",
    "Maintenance",
    "Farm Management",
    "Other",
  ];

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/activities");
      setActivities(response.data.activities || []);
    } catch (err) {
      console.error("Load activities error:", err);
      setError(err.response?.data?.message || "Failed to load farm activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setForm({
      title: activity.title,
      type: activity.type,
      date: activity.date ? activity.date.split("T")[0] : "",
      status: activity.status || "Pending",
      description: activity.description || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      type: "Planting",
      date: "",
      status: "Pending",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await API.put(`/activities/${editingId}`, form);
      } else {
        await API.post("/activities", form);
      }
      resetForm();
      await fetchActivities();
    } catch (err) {
      console.error("Save activity error:", err);
      setError(err.response?.data?.message || "Failed to save activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await API.delete(`/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete activity error:", err);
      alert("Failed to delete activity.");
    }
  };

  const toggleStatus = async (activity) => {
    const nextStatus =
      activity.status === "Pending"
        ? "Completed"
        : activity.status === "Completed"
        ? "Upcoming"
        : "Pending";

    try {
      await API.put(`/activities/${activity._id}`, { status: nextStatus });
      setActivities((prev) =>
        prev.map((a) => (a._id === activity._id ? { ...a, status: nextStatus } : a))
      );
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const filteredActivities = activities.filter((a) => {
    if (filter === "All") return true;
    return a.status === filter;
  });

  const pendingCount = activities.filter((a) => a.status === "Pending").length;
  const completedCount = activities.filter((a) => a.status === "Completed").length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base text-emerald-600">✓</span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
              Farm Activities & Schedules
            </h1>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Track cultivation operations, fertilizing cycles, and harvest calendars.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
        >
          <span>+ New Task</span>
        </button>
      </div>

      {/* Metrics summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-neutral-400">Total Tasks</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-950 dark:text-white">{activities.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-neutral-400">Pending</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-950 dark:text-white">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Completed</p>
          <p className="mt-0.5 text-lg font-bold text-emerald-700 dark:text-emerald-400">{completedCount}</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filter === f
                ? "bg-emerald-600 text-white font-semibold shadow-xs dark:bg-emerald-500 dark:text-neutral-950"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task Database Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-neutral-700 dark:border-t-emerald-400" />
          <p className="mt-3">Loading tasks...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">No activities found</h3>
          <p className="mt-1 text-xs text-neutral-400">Create a task to keep track of your farming calendar.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filteredActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-emerald-50/30 dark:hover:bg-neutral-800/40 transition"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleStatus(activity)}
                    title="Click to toggle status"
                    className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                      activity.status === "Completed"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "border-neutral-300 hover:border-emerald-500 dark:border-neutral-700"
                    }`}
                  >
                    {activity.status === "Completed" && <span className="text-[10px]">✓</span>}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs font-semibold ${
                          activity.status === "Completed"
                            ? "text-neutral-400 line-through"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {activity.title}
                      </p>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {activity.type}
                      </span>
                    </div>

                    {activity.description && (
                      <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {activity.description}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-neutral-400">
                      📅 {activity.date ? new Date(activity.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "No date"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleStatus(activity)}
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold cursor-pointer ${
                      activity.status === "Completed"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : activity.status === "Upcoming"
                        ? "border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                        : "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                    }`}
                  >
                    {activity.status}
                  </button>

                  <button
                    onClick={() => handleEdit(activity)}
                    className="h-7 w-7 rounded-lg border border-neutral-200 text-xs text-neutral-600 hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    title="Edit task"
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="h-7 w-7 rounded-lg border border-neutral-200 text-xs text-neutral-600 hover:bg-red-50 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-red-950/40"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-scale-up rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                {editingId ? "Edit Farm Activity" : "Create Farm Activity"}
              </h3>
              <button onClick={resetForm} className="text-xs text-neutral-400 hover:bg-neutral-100 rounded-full h-6 w-6">
                ✕
              </button>
            </div>

            {error && (
              <div className="notion-callout mt-4 text-xs text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/30">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Activity Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tomato drip irrigation & NPK dosage"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {activityTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Target Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Notes & Details
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Dosage, plot coordinates, seed variety notes..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:text-neutral-950"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;