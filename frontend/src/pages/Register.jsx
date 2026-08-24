import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import farmBanner from "../assets/farm-banner.jpg";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    district: "",
    region: "",
    village: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      {/* =========================================================
          LEFT SIDE: Inspiring Agricultural Visual Showcase
      ========================================================= */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between overflow-hidden bg-emerald-950 p-12 text-white">
        {/* Scenic Farm Photo */}
        <img
          src={farmBanner}
          alt="Lush Agricultural Fields"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 backdrop-blur-[1px]" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-xl shadow-lg">
            🌱
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              Agro AI
            </h2>
            <p className="text-xs text-emerald-300 font-medium">
              Smart Agriculture & Farm Intelligence
            </p>
          </div>
        </div>

        {/* Bottom Showcase Content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Farmer Registration
          </div>

          <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Join Thousands of Smart Farmers Today.
          </h3>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Get personalized regional farming guidance, weather-triggered advisory alerts, crop calculators, and verified equipment rental access.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
              <p className="text-base font-bold text-white">24/7</p>
              <p className="text-[10px] text-neutral-300">AI Agronomist Support</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
              <p className="text-base font-bold text-white">3 Languages</p>
              <p className="text-[10px] text-neutral-300">English, Telugu, Hindi</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-[11px] text-neutral-400">
          © 2026 Agro AI Platform • Built for Indian Agriculture
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE: Modern Registration Form
      ========================================================= */}
      <div className="flex col-span-12 lg:col-span-7 xl:col-span-7 flex-col justify-center px-6 py-12 sm:px-12 md:px-16 xl:px-20 overflow-y-auto">
        <div className="mx-auto w-full max-w-xl space-y-6 animate-fade-up">
          {/* Mobile Header Logo */}
          <div className="flex items-center gap-2.5 lg:hidden mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base dark:border-emerald-800 dark:bg-emerald-950">
              🌱
            </div>
            <span className="text-base font-bold text-neutral-950 dark:text-white">
              Agro AI
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
              Create your farmer account
            </h1>
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
              Register to access disease diagnosis, equipment marketplace, and farm calculators.
            </p>
          </div>

          {error && (
            <div className="notion-callout text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/30">
              <span>⚠️</span>
              <span className="flex-1 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="Full Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ramesh Patel"
              />

              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ramesh@farm.com"
              />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="Password *"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Gujarat"
              />

              <Input
                label="District"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="Vadodara"
              />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Input
                label="Region / Taluka"
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="Padra"
              />

              <Input
                label="Village"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="Samiala"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400 cursor-pointer mt-2"
            >
              {loading ? "Creating workspace..." : "Create Account & Start Farming →"}
            </button>
          </form>

          <div className="border-t border-neutral-200/80 pt-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={["name", "email", "password"].includes(name)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-emerald-400"
      />
    </div>
  );
}

export default Register;