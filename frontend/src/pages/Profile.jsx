import { useState, useEffect } from "react";
import { useAuthStore } from "../app/authStore";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const logout   = useAuthStore((state) => state.logout);
  const setAuth  = useAuthStore((state) => state.setAuth);
  const token    = useAuthStore((state) => state.token);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [imagePreview,  setImagePreview]  = useState(null);
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [success,       setSuccess]       = useState("");
  const [passwordData,  setPasswordData]  = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");

  // Load profile from backend on mount
  useEffect(() => {
    api.get("/profile").then((res) => {
      const u = res.data;
      setForm({ name: u.name || "", email: u.email || "", phone: u.phone || "" });
      if (u.avatar_url) setImagePreview(u.avatar_url);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name",  form.name);
    formData.append("phone", form.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAuth(res.data, token);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setSuccess("Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    try {
      await api.put("/profile/password", {
        current_password: passwordData.currentPassword,
        new_password:     passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      setPasswordMessage("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMessage(err.response?.data?.error || "Failed to update password.");
    }

    setTimeout(() => setPasswordMessage(""), 3000);
  };

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
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-slide">
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-semibold mb-10">My Profile</h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37] shadow-md">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">👤</div>
            )}
          </div>
          <label className="mt-4 cursor-pointer bg-[#d4af37] text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            Upload Photo
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* BASIC INFO */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input type="email" value={form.email} disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none" />
          </div>

          <button type="submit"
            className="bg-[#d4af37] text-white px-6 py-2 rounded-lg shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition">
            Save Profile
          </button>

          {success && <div className="text-green-600 font-medium">{success}</div>}
        </form>

        {/* PASSWORD */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <input type="password" placeholder="Current Password" value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37]" />
            <input type="password" placeholder="New Password" value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37]" />
            <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37]" />

            <button type="submit"
              className="bg-[#d4af37] text-white px-6 py-2 rounded-lg shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition">
              Update Password
            </button>

            {passwordMessage && (
              <div className={`font-medium ${passwordMessage.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {passwordMessage}
              </div>
            )}
          </form>
        </div>

        {/* LOGOUT */}
        <div className="mt-12">
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
