import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState("");
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/password", {
        user: { email },
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch {
      setError("Email not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">

      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Reset Link Sent</h3>
            <p className="text-sm text-gray-500 mt-1">Check your email to reset password</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-2xl font-semibold text-[#d4af37] mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we'll send you a reset link
        </p>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4af37] text-white py-2 rounded-lg font-medium shadow hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-[#d4af37] hover:underline">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
