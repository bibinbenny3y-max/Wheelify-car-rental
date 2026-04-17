import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const imgSrc = (url) =>
  url && url.startsWith("/") ? `http://localhost:3000${url}` : url;

export default function ListVehicle() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(
    new URLSearchParams(location.search).get("tab") === "mylistings" ? "mylistings" : "list"
  );

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "", vehicle_type: "Car", model: "", location: "", rate: "", description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  // ── My listings state ─────────────────────────────────────────────────────
  const [myVehicles,     setMyVehicles]     = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const fetchMyVehicles = () => {
    setListingsLoading(true);
    api.get("/vehicles?mine=true")
      .then((res) => setMyVehicles(res.data))
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  };

  useEffect(() => {
    if (tab === "mylistings") fetchMyVehicles();
  }, [tab]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name",         form.name);
      formData.append("vehicle_type", form.vehicle_type);
      formData.append("model",        form.model);
      formData.append("location",     form.location);
      formData.append("rate",         form.rate);
      formData.append("description",  form.description);
      if (imageFile) formData.append("images[]", imageFile);

      await api.post("/vehicles", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setTimeout(() => navigate("/owner-dashboard"), 1500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(Array.isArray(errors) ? errors.join(", ") : "Failed to submit vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setMyVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("Failed to delete vehicle.");
    }
  };

  const statusColor = (s) =>
    s === "approved" ? "text-green-600" : s === "pending" ? "text-yellow-600" : "text-red-500";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-slide">

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("list")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition ${
            tab === "list" ? "bg-[#d4af37] text-white shadow" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          List New Vehicle
        </button>
        <button
          onClick={() => setTab("mylistings")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition ${
            tab === "mylistings" ? "bg-[#d4af37] text-white shadow" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          My Listings
        </button>
      </div>

      {/* ── List New Vehicle Tab ── */}
      {tab === "list" && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-8">List Your Vehicle</h1>

          {error && <div className="mb-4 text-sm text-red-500 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" placeholder="Vehicle Name" required
              value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />

            <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none">
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>

            <input type="text" name="model" placeholder="Model Year (e.g., 2024)" required
              value={form.model} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />

            <input type="text" name="location" placeholder="City Location" required
              value={form.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />

            <input type="number" name="rate" placeholder="Price per day (£)" required min="1"
              value={form.rate} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />

            <textarea name="description" placeholder="Vehicle Description" rows="4"
              value={form.description} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />

            <div>
              <label className="block mb-2 font-medium">Upload Vehicle Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
              {preview && (
                <img src={preview} alt="Preview"
                  className="mt-4 w-full h-60 object-contain rounded-lg border" />
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#d4af37] text-white py-3 rounded-lg shadow hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition duration-300 disabled:opacity-60">
              {loading ? "Submitting..." : "Submit Vehicle"}
            </button>
          </form>
        </div>
      )}

      {/* ── My Listings Tab ── */}
      {tab === "mylistings" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Listed Vehicles</h2>
            <button onClick={fetchMyVehicles}
              className="text-sm text-[#d4af37] hover:underline">Refresh</button>
          </div>

          {listingsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : myVehicles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-4">You haven't listed any vehicles yet.</p>
              <button onClick={() => setTab("list")}
                className="bg-[#d4af37] text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition">
                List Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myVehicles.map((v) => (
                <div key={v.id} className="bg-white rounded-xl shadow-md p-6 border">
                  {v.image_url && (
                    <img src={imgSrc(v.image_url)} alt={v.name}
                      className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="font-semibold text-lg">{v.name}</h3>
                  <p className="text-gray-500 text-sm">{v.vehicle_type} · {v.model} · {v.location}</p>
                  <p className="text-gray-600 mt-1">£{v.rate} / day</p>
                  <p className="text-sm mt-2">
                    Status:{" "}
                    <span className={`font-medium ${statusColor(v.status)}`}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                    {v.status === "pending" && (
                      <span className="ml-2 text-xs text-gray-400">(awaiting admin approval)</span>
                    )}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => navigate(`/edit-vehicle/${v.id}`)}
                      className="bg-[#d4af37] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(v.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Success popup ── */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">✓</div>
            <h3 className="text-lg font-semibold">Vehicle Submitted for Approval!</h3>
            <p className="text-sm text-gray-500 mt-1">Admin will review and approve your listing.</p>
          </div>
        </div>
      )}
    </div>
  );
}
