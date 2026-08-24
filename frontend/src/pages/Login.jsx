import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import farmBanner from "../assets/farm-banner.jpg";
import logoSvg from "../assets/logo.svg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please verify your credentials."
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
      <div className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between overflow-hidden bg-emerald-950 p-12 text-white">
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
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-md shadow-lg">
            <img src={logoSvg} alt="Agro AI" className="h-full w-full object-contain rounded-xl" />
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
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Diagnostics • Marketplace • Telemetry
          </div>

          <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight xl:text-4xl">
            Empowering Farmers with Next-Gen Intelligence.
          </h3>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Plan cultivation cycles, scan crop leaves for instant disease diagnosis, and connect with regional farming equipment networks seamlessly.
          </p>

          {/* Frosted Testimonial / Stat Card */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Precision Crop Health</p>
                <p className="text-[11px] text-neutral-300">ViT Classification + Multimodal Guidance</p>
              </div>
              <span className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                100% Reliable
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-[11px] text-neutral-400">
          © 2026 Agro AI Platform • Cultivating Smarter Harvests
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE: Sleek Modern Login Form
      ========================================================= */}
      <div className="flex col-span-12 lg:col-span-6 xl:col-span-5 flex-col justify-center px-6 py-12 sm:px-12 md:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-sm space-y-8 animate-fade-up">
          {/* Mobile Header Logo */}
          <div className="flex items-center gap-2.5 lg:hidden mb-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-1 dark:border-emerald-800 dark:bg-emerald-950">
              <img src={logoSvg} alt="Agro AI" className="h-full w-full object-contain rounded-lg" />
            </div>
            <span className="text-base font-bold text-neutral-950 dark:text-white">
              Agro AI
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
              Sign in to access your farm workspace & AI advisor.
            </p>
          </div>

          {error && (
            <div className="notion-callout text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/30">
              <span>⚠️</span>
              <span className="flex-1 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="farmer@domain.com"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-emerald-400"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400 cursor-pointer"
            >
              {loading ? "Signing in..." : "Continue to Dashboard →"}
            </button>
          </form>

          <div className="border-t border-neutral-200/80 pt-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;