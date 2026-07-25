import React, { useState } from "react";
import logo from "../assets/logo_greenfield_school.png";
import studentImg from "../assets/student.png";
import { EyeOff } from "lucide-react";
import EyeIcon from "../assets/eye-icon.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

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
    <div className="flex min-h-screen">
      <div
        className="w-[65%] hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${studentImg})` }}
      ></div>

      <div className="w-full md:w-[35%] flex items-center justify-center bg-[#cfe3ec]">
        <div className="w-full max-w-sm px-6">

          <div className="flex items-center justify-center gap-2 mb-6">
            <img src={logo} alt="logo" className="h-8" />
            <h1 className="text-lg font-semibold text-gray-700">Green Field Convent School</h1>
          </div>

          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon width={18} height={13} style={{ color: "#4f39f6" }} />
                ) : (
                  <EyeOff size={18} color="#4f39f6" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
