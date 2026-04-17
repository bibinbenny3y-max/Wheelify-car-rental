import { Routes, Route } from "react-router-dom";
import Home            from "../pages/Home";
import Login           from "../pages/Login";
import Vehicles        from "../pages/Vehicles";
import Dashboard       from "../pages/Dashboard";
import ProtectedRoute  from "../components/common/ProtectedRoute";
import Register        from "../pages/Register";
import VehicleDetails  from "../pages/VehicleDetails";
import Payment         from "../pages/Payment";
import History         from "../pages/History";
import ListVehicle     from "../pages/ListVehicle";
import EditVehicle     from "../pages/EditVehicle";
import OwnerDashboard  from "../pages/OwnerDashboard";
import Profile         from "../pages/Profile";
import AdminDashboard  from "../pages/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"                element={<Home />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/vehicles"        element={<Vehicles />} />
      <Route path="/vehicles/:id"    element={<VehicleDetails />} />

      {/* Protected routes — require login */}
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history"      element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/payment"      element={<ProtectedRoute><Payment /></ProtectedRoute>} />

      {/* Owner-only routes */}
      <Route path="/list-vehicle"          element={<ProtectedRoute requireOwner><ListVehicle /></ProtectedRoute>} />
      <Route path="/edit-vehicle/:id"      element={<ProtectedRoute requireOwner><EditVehicle /></ProtectedRoute>} />
      <Route path="/owner-dashboard"       element={<ProtectedRoute requireOwner><OwnerDashboard /></ProtectedRoute>} />

      {/* Admin-only route */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
}
