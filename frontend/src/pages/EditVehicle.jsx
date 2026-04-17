import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditVehicle() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name: "",
    vehicle_type: "Car",
    model: "",
    location: "",
    rate: "",
    description: "",
  });

  const [imageFile,  setImageFile]  = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  // Load existing vehicle data
  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((res) => {
        const v = res.data;
        setForm({
          name:         v.name         || "",
          vehicle_type: v.vehicle_type || "Car",
          model:        v.model        || "",
          location:     v.location     || "",
          rate:         v.rate         || "",
          description:  v.description  || "",
        });
        if (v.image_url) setPreview(v.image_url);
      })
      .catch(() => setError("Could not load vehicle."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name",         form.name);
      formData.append("vehicle_type", form.vehicle_type);
      formData.append("model",        form.model);
      formData.append("location",     form.location);
      formData.append("rate",         form.rate);
      formData.append("description",  form.description);
      if (imageFile) {
        formData.append("images[]", imageFile);
      }

      await api.put(`/vehicles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/owner-dashboard"), 1500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(Array.isArray(errors) ? errors.join(", ") : "Failed to update vehicle.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading vehicle...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-slide">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold mb-8">Edit Vehicle</h1>

        {error && (
          <div className="mb-4 text-sm text-red-500 font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Vehicle Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          >
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>

          <input
            type="text"
            name="model"
            placeholder="Model Year (e.g., 2024)"
            required
            value={form.model}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <input
            type="text"
            name="location"
            placeholder="City Location"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <input
            type="number"
            name="rate"
            placeholder="Price per day (£)"
            required
            min="1"
            value={form.rate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <textarea
            name="description"
            placeholder="Vehicle Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <div>
            <label className="block mb-2 font-medium">Replace Vehicle Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full h-60 object-contain rounded-lg border"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/owner-dashboard")}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#d4af37] text-white py-3 rounded-lg shadow hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition duration-300 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-pop">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#d4af37] text-white text-3xl">
              ✓
            </div>
            <h3 className="text-lg font-semibold">Vehicle Updated!</h3>
          </div>
        </div>
      )}
    </div>
  );
}
