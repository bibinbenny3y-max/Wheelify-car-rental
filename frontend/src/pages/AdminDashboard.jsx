import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../app/authStore";

export default function AdminDashboard() {
  const currentUser = useAuthStore((state) => state.user);
  const [stats,    setStats]    = useState({ total_users: 0, total_vehicles: 0, total_bookings: 0, total_revenue: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/vehicles?all=true"),
      api.get("/admin/users"),
    ])
      .then(([statsRes, vehiclesRes, usersRes]) => {
        setStats(statsRes.data);
        setVehicles(vehiclesRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await api.put(`/vehicles/${id}/approve`);
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, status: "approved" } : v));
  };

  const handleReject = async (id) => {
    await api.put(`/vehicles/${id}/reject`);
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, status: "rejected" } : v));
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    await api.delete(`/vehicles/${id}`);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const pendingVehicles  = vehicles.filter((v) => v.status === "pending");
  const approvedVehicles = vehicles.filter((v) => v.status === "approved");

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-fade-slide">
      <h1 className="text-3xl font-semibold mb-10">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Users",    value: stats.total_users },
          { label: "Total Vehicles", value: stats.total_vehicles },
          { label: "Total Bookings", value: stats.total_bookings },
          { label: "Total Revenue",  value: `£${stats.total_revenue}` },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-gray-500">{stat.label}</h3>
            <p className="text-3xl font-semibold text-[#d4af37]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* PENDING APPROVAL */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">Pending Vehicle Approvals</h2>

        {pendingVehicles.length === 0 ? (
          <p className="text-gray-500">No pending vehicles.</p>
        ) : (
          <div className="space-y-4">
            {pendingVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex justify-between items-center border p-4 rounded-lg">
                <div>
                  <p className="font-semibold">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">£{vehicle.rate} / day</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(vehicle.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(vehicle.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* APPROVED VEHICLES */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">Approved Vehicles</h2>

        {approvedVehicles.length === 0 ? (
          <p className="text-gray-500">No approved vehicles yet.</p>
        ) : (
          <div className="space-y-4">
            {approvedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex justify-between items-center border p-4 rounded-lg">
                <div>
                  <p className="font-semibold">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">£{vehicle.rate} / day</p>
                </div>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* USER MANAGEMENT */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-xl font-semibold mb-6">Manage Users</h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center border p-4 rounded-lg">
              <div>
                <p>{user.email}</p>
                <p className="text-sm text-gray-400">{user.role}</p>
              </div>
              {user.id === currentUser?.id ? (
                <span className="text-sm text-gray-400 px-4 py-2">You</span>
              ) : (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
