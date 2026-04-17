import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        user: {
          name:     form.name,
          email:    form.email,
          password: form.password,
          role:     form.role,
        },
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(Array.isArray(errors) ? errors.join(", ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">

      {/* SUCCESS POPUP */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Registration Successful</h3>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 text-center"
      >
        <h2 className="text-2xl font-semibold text-[#d4af37] mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 text-sm text-red-500 font-medium">{error}</div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-white"
        >
          <option value="customer">Customer — I want to rent vehicles</option>
          <option value="owner">Owner — I want to list my vehicles</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4af37] text-white py-2 rounded-lg font-medium shadow hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#d4af37] hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
