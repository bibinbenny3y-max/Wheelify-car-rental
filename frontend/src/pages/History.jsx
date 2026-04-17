import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading history...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-slide">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Booking History</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-[#d4af37]">
                {booking.vehicle?.name}
              </h2>

              <div className="mt-3 text-gray-600 space-y-1">
                <p><strong>Location:</strong> {booking.vehicle?.location}</p>
                <p><strong>Start:</strong> {booking.start_date}</p>
                <p><strong>End:</strong> {booking.end_date}</p>
                <p><strong>Total Paid:</strong> £{booking.total_price}</p>
                {booking.payment && (
                  <>
                    <p><strong>Payment ID:</strong> {booking.payment.paypal_order_id}</p>
                    <p><strong>Payer:</strong> {booking.payment.payer_name}</p>
                  </>
                )}
              </div>

              <div className="mt-4 text-sm text-green-600 font-medium">
                ✓ Payment Completed
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
