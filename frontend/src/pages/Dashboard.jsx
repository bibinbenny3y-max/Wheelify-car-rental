import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../app/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 animate-fade-in">

      {/* Welcome */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          What would you like to do today?
        </p>
      </div>

      {/* OPTIONS */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-3xl">

        {/* RENT VEHICLE — customers only */}
        {user?.role === "customer" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition duration-300 w-72">
            <div className="text-5xl mb-4">🚗</div>

            <h2 className="text-xl font-semibold text-gray-800">
              Rent a Vehicle
            </h2>

            <p className="text-gray-500 mt-2">
              Browse and book cars & bikes easily
            </p>

            <button
              onClick={() => navigate("/vehicles")}
              className="mt-5 bg-[#d4af37] text-white px-5 py-2 rounded-lg shadow hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition duration-300"
            >
              Explore Vehicles
            </button>
          </div>
        )}

        {/* LIST VEHICLE — owners/admins only */}
        {user?.role === "owner" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition duration-300 w-72">
            <div className="text-5xl mb-4">🏷️</div>

            <h2 className="text-xl font-semibold text-gray-800">
              List Your Vehicle
            </h2>

            <p className="text-gray-500 mt-2">
              Earn money by renting your vehicle
            </p>

            <button
              onClick={() => navigate("/list-vehicle")}
              className="mt-5 bg-[#d4af37] text-white px-5 py-2 rounded-lg shadow hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition duration-300"
            >
              Start Listing
            </button>
          </div>
        )}

      </div>
    </div>
  );
}