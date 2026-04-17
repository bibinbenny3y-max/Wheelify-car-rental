import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../app/authStore";
import api from "../../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        user: { email, password },
      });

      // JWT token is in the Authorization response header
      const token = response.headers["authorization"]?.replace("Bearer ", "");
      const user  = response.data.user;

      setAuth(user, token);
      setSuccess(true);

      setTimeout(() => navigate(from), 1600);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Login Successful
            </h3>
          </div>
        </div>
      )}

      {/* LOGIN FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-2xl font-semibold text-[#d4af37] mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-600 text-sm font-medium rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4af37] text-white py-2 rounded-lg font-medium shadow hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-[#d4af37] hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </>
  );
}
