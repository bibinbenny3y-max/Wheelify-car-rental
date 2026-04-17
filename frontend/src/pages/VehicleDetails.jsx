import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuthStore } from "../app/authStore";

const imgSrc = (url) =>
  url && url.startsWith("/") ? `http://localhost:3000${url}` : url;

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data))
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Vehicle Not Found</h2>
        <button
          onClick={() => navigate("/vehicles")}
          className="mt-4 bg-[#d4af37] text-white px-6 py-2 rounded-lg"
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const isDateBlocked = () => {
    if (!startDate || !endDate) return false;
    return vehicle.bookings?.some((booking) => {
      const existingStart = new Date(booking.start_date);
      const existingEnd   = new Date(booking.end_date);
      const newStart      = new Date(startDate);
      const newEnd        = new Date(endDate);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  const calculatePrice = () => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days * vehicle.rate : 0;
  };

  const totalPrice = calculatePrice();

  const handleConfirm = () => {
    if (!user) {
      // Save intended destination so login can redirect back here
      navigate("/login", { state: { from: `/vehicles/${id}` } });
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select valid dates.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }
    if (isDateBlocked()) {
      setError("Selected dates are already booked.");
      return;
    }

    setError("");
    navigate("/payment", {
      state: {
        name:       vehicle.name,
        location:   vehicle.location,
        startDate,
        endDate,
        totalPrice,
        vehicleId:  vehicle.id
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/vehicles")}
        className="mb-6 text-[#d4af37] hover:underline"
      >
        ← Back to Vehicles
      </button>

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img
            src={vehicle.image_url
              ? imgSrc(vehicle.image_url)
              : `https://picsum.photos/seed/vehicle-${vehicle.id}/800/500`}
            alt={vehicle.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{vehicle.name}</h1>
          <p className="text-gray-500 mt-2">Model: {vehicle.model}</p>
          <p className="text-gray-500">Location: {vehicle.location}</p>
          <p className="text-2xl text-[#d4af37] font-semibold mt-4">£{vehicle.rate} / day</p>

          {/* DATE PICKERS */}
          <div className="mt-6 space-y-4">
            {user?.role === "owner" ? (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                Owner accounts cannot book vehicles. Switch to a customer account to rent.
              </p>
            ) : (
              <>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#d4af37]"
                />

                <input
                  type="date"
                  value={endDate}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#d4af37]"
                />

                <div className="text-lg font-semibold text-[#d4af37]">
                  Total Price: £{totalPrice}
                </div>

                {error && <div className="text-red-500 font-medium">{error}</div>}

                {!user && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                    Please <button onClick={() => navigate("/login", { state: { from: `/vehicles/${id}` } })} className="underline font-medium">log in</button> or <button onClick={() => navigate("/register")} className="underline font-medium">register</button> to book this vehicle.
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={totalPrice === 0}
                  className="w-full bg-[#d4af37] text-white py-3 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
                >
                  {user ? "Confirm Booking" : "Login to Book"}
                </button>
              </>
            )}
          </div>

          {/* UNAVAILABLE DATES */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 text-gray-800">Unavailable Dates</h3>
            {vehicle.bookings?.length > 0 ? (
              vehicle.bookings.map((booking) => (
                <p key={booking.id} className="text-sm text-red-500">
                  {booking.start_date} → {booking.end_date}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
