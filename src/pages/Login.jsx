import React, { useState } from "react";
import logo from "../assets/logo-color 1.png";
import { EyeOff } from "lucide-react";
import EyeIcon from "../assets/eye-icon.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { schoolName, logoUrl } = useSelector((state) => state.schoolBranding);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      login({
        email,
        password,
      })
    );

    if (login.fulfilled.match(result)) {
      const role = result.payload.role;

      toast.success("Login successful!");

      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "teacher-portal") {
        navigate("/teacher-dashboard");
      } else if (role === "student-portal") {
        navigate("/student-dashboard");
      } else if (role === "parent-portal") {
        navigate("/parent-dashboard");
      } else if (role === "staff-portal") {
        navigate("/staff-dashboard");
      } else {
        toast.error("Invalid role");
      }
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-brand-900 via-[#312e81] to-brand-700 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute right-16 top-1/2 h-32 w-32 rounded-full border border-white/10" />

        <div className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-wide text-white/80">
          <span className="h-2 w-2 rounded-full bg-brand-400" />
          SCHOOL ADMINISTRATION SYSTEM
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="relative mb-8 h-36 w-36">
            <div className="absolute -inset-3 rounded-[2rem] border border-white/10 bg-white/[0.03]" />
            <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/30 bg-white/15 p-4 shadow-2xl shadow-brand-900/30 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/20 bg-white/90 p-3 shadow-inner">
                <img
                  src={logoUrl || logo}
                  alt={schoolName || "Walkout SSMS"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <span className="absolute -right-1 top-4 h-2.5 w-2.5 rounded-full bg-brand-400 shadow-lg shadow-brand-400/70" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Welcome back</p>
          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            {schoolName || "Walkout SSMS"}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
            Manage your school&apos;s operations securely from one connected workspace.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/50">Secure access for authorized administrators.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="card w-full max-w-md rounded-2xl border-white/80 bg-white/95 p-7 shadow-xl shadow-slate-200/70 sm:p-10">
          <header className="text-center">
            <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-3xl bg-brand-50 p-3 shadow-sm ring-1 ring-brand-100">
              <img
                src={logoUrl || logo}
                alt={schoolName || "Walkout SSMS"}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {schoolName || "Walkout SSMS"}
            </h1>
          </header>

          <div className="mt-9 border-t border-gray-100 pt-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-brand-900">Welcome back</h2>
            <p className="mt-2 text-center text-sm leading-6 text-gray-500">Sign in to continue to your dashboard.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input h-12 rounded-lg bg-slate-50 px-4 shadow-sm transition focus:bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input h-12 rounded-lg bg-slate-50 px-4 pr-12 shadow-sm transition focus:bg-white"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-brand-600 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeIcon width={18} height={13} style={{ color: "#4f39f6" }} />
                    ) : (
                      <EyeOff size={18} color="#4f39f6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600" />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-brand-600 transition hover:text-brand-700">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary h-12 w-full justify-center rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 font-semibold shadow-lg shadow-brand-600/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/25 active:translate-y-0"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          <footer className="mt-8 border-t border-gray-100 pt-5 text-center text-xs leading-5 text-gray-400">
            Authorized access only. Your activity may be monitored for security.
          </footer>
        </div>
      </section>
    </main>
  );
}
