import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [myVehicles,    setMyVehicles]    = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading,       setLoading]       = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get("/vehicles?mine=true"),
      api.get("/bookings/owner"),
    ])
      .then(([vehiclesRes, bookingsRes]) => {
        setMyVehicles(vehiclesRes.data);
        setNotifications(bookingsRes.data);
        const earned = bookingsRes.data.reduce(
          (sum, b) => (b.status === "confirmed" ? sum + Number(b.total_price) : sum),
          0
        );
        setTotalEarnings(earned);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setMyVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("Failed to delete vehicle.");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel_by_owner`);
      setNotifications((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch {
      alert("Failed to cancel booking.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">Owner Dashboard</h1>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate("/list-vehicle")}
          className="bg-[#d4af37] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + List New Vehicle
        </button>
        <button
          onClick={() => navigate("/list-vehicle?tab=mylistings")}
          className="border border-[#d4af37] text-[#d4af37] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#d4af37]/10 transition"
        >
          View My Listings
        </button>
      </div>

      {/* BOOKING NOTIFICATIONS */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Booking Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-400">No bookings on your vehicles yet.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {note.renter} booked your {note.vehicle?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {note.start_date} → {note.end_date}
                    </p>
                    <p className="text-sm font-semibold text-[#d4af37]">
                      £{note.total_price}
                    </p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={
                        note.status === "confirmed"  ? "text-green-600 font-medium" :
                        note.status === "pending"    ? "text-yellow-600 font-medium" :
                                                       "text-red-500 font-medium"
                      }>
                        {note.status}
                      </span>
                    </p>
                  </div>

                  {/* Owner can cancel confirmed bookings */}
                  {note.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(note.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EARNINGS */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold">Total Earnings</h2>
        <p className="text-2xl text-[#d4af37] mt-2">£{totalEarnings.toFixed(2)}</p>
        <p className="text-sm text-gray-400 mt-1">From confirmed bookings only</p>
      </div>

      {/* MY VEHICLES */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Listed Vehicles</h2>
          <button
            onClick={() => navigate("/list-vehicle")}
            className="bg-[#d4af37] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            + Add Vehicle
          </button>
        </div>

        {myVehicles.length === 0 ? (
          <p className="text-gray-400">You haven't listed any vehicles yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {myVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-md p-6 border">
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                <p className="text-gray-500 text-sm">{vehicle.vehicle_type} · {vehicle.location}</p>
                <p className="text-gray-500">£{vehicle.rate} / day</p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className={
                    vehicle.status === "approved"  ? "text-green-600 font-medium" :
                    vehicle.status === "pending"   ? "text-yellow-600 font-medium" :
                                                     "text-red-500 font-medium"
                  }>
                    {vehicle.status}
                  </span>
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
                    className="bg-[#d4af37] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
