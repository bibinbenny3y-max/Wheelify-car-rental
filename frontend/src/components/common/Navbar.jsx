import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/authStore";
import api from "../../services/api";

const Navbar = () => {
  const user    = useAuthStore((state) => state.user);
  const logout  = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const isOwner    = user?.role === "owner" || user?.role === "admin";
  const isAdmin    = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await api.delete("/auth/logout");
    } catch (_) {
      // token already invalid — proceed anyway
    }
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#d4af37] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="text-lg md:text-xl font-semibold hover:opacity-80 transition">
          Wheelify
        </Link>

        <div className="flex items-center gap-5 text-sm md:text-base font-medium">
          <Link to="/vehicles" className="hover:opacity-80">Browse</Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:opacity-80">Dashboard</Link>
              {user?.role === "customer" && (
                <Link to="/history" className="hover:opacity-80">History</Link>
              )}
              <Link to="/profile"   className="hover:opacity-80">Profile</Link>

              {isOwner && (
                <Link to="/owner-dashboard" className="hover:opacity-80">Owner</Link>
              )}

              {isAdmin && (
                <Link to="/admin" className="hover:opacity-80">Admin</Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-[#d4af37] px-3 py-1 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="hover:opacity-80">Login</Link>
              <Link to="/register" className="hover:opacity-80">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
