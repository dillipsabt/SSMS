import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuperAdminAsync, clearError, clearSuccess } from "../../features/SuperAdmin/Authentication/superAdminAuthSlice";
import useToastMessage from "../../utils/useToastMessage";
import logo from "../../assets/logo-color 1.png";
import "../superAdmin.css";

export default function SuperAdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, success, error, successMessage } = useSelector((state) => state.superAdminAuth);

  useEffect(() => {
    if (token && sessionStorage.getItem("superAdminAuthenticated") === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  useToastMessage({
    success,
    error,
    successMessage,
    clearSuccess,
    clearError,
    onSuccess: () => navigate("/dashboard", { replace: true }),
  });

  const submit = (event) => {
    event.preventDefault();
    dispatch(loginSuperAdminAsync(credentials));
  };
  return (
    <main className="sa-login">
    <section className="sa-login-panel">
      <img src={logo} alt="Walkout SSMS" className="sa-login-logo" />
      <div className="sa-login-copy">
        <p className="sa-eyebrow">SUPER ADMIN PORTAL</p>
        <h1>Manage every school from one place.</h1>
        <p>Securely manage school accounts, subscriptions, and platform settings.</p>
      </div></section>
    <section className="sa-login-form-wrap">
      <form className="sa-login-form" onSubmit={submit}>
        <p className="sa-eyebrow">WELCOME BACK</p>
        <h2>Sign in to Super Admin</h2>
        <p className="sa-login-hint">Enter your account credentials to continue.</p>
        <label>Email address<div className="sa-input-icon"><UserRound size={19} />
          <input type="email" required placeholder="admin@walkoutssms.com" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} />
        </div>
        </label>
        <label>Password<div className="sa-input-icon"><LockKeyhole size={19} />
          <input type={showPassword ? "text" : "password"} required placeholder="Enter your password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
        </div>
        </label>
        <button className="sa-login-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </section>
    </main>
  );
}
