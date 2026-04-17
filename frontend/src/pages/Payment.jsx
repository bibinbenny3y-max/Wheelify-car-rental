import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

// Generates a fake PayPal-style order ID for demo purposes
const fakeTxnId = () => "DEMO-" + Math.random().toString(36).substring(2, 10).toUpperCase();

export default function Payment() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const bookingData = location.state;

  const [paid, setPaid]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Card form state (UI only — not sent to backend)
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (!bookingData) navigate("/vehicles");
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const { name, location: loc, startDate, endDate, totalPrice, vehicleId } = bookingData;

  const isValid =
    startDate &&
    endDate &&
    totalPrice > 0 &&
    new Date(endDate) > new Date(startDate);

  const handlePay = async (e) => {
    e.preventDefault();

    if (!card.name || !card.number || !card.expiry || !card.cvv) {
      setError("Please fill in all card details.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/payments/capture", {
        vehicle_id:      vehicleId,
        start_date:      startDate,
        end_date:        endDate,
        total_price:     totalPrice,
        paypal_order_id: fakeTxnId(),
        payer_name:      card.name,
      });

      setPaid(true);
      setTimeout(() => navigate("/history"), 2500);
    } catch (err) {
      setError(err.response?.data?.errors?.join(", ") || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-slide">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Complete Your Payment</h1>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-1 text-gray-600 text-sm">
          <p><strong>Vehicle:</strong> {name}</p>
          <p><strong>Location:</strong> {loc}</p>
          <p><strong>Start Date:</strong> {startDate}</p>
          <p><strong>End Date:</strong> {endDate}</p>
          <p className="text-lg font-semibold text-[#d4af37] mt-2">Total: £{totalPrice}</p>
        </div>

        {/* Simulated Card Form */}
        {isValid && !paid && (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Smith"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="4111 1111 1111 1111"
                maxLength={19}
                value={card.number}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  setCard({ ...card, number: v.replace(/(.{4})/g, "$1 ").trim() });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={card.expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                    setCard({ ...card, expiry: v });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
              </div>
            </div>

            {error && <p className="text-red-500 font-medium text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#d4af37] text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : `Pay £${totalPrice}`}
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              Demo payment — no real charges are made
            </p>
          </form>
        )}
      </div>

      {/* SUCCESS POPUP */}
      {paid && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Payment Successful!</h3>
            <p className="text-sm text-gray-500 mt-2">Redirecting to your history...</p>
          </div>
        </div>
      )}
    </div>
  );
}
