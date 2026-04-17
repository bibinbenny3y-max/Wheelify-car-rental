import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../app/authStore";

export default function ProtectedRoute({ children, requireAdmin = false, requireOwner = false }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (requireOwner && user?.role !== "owner" && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}