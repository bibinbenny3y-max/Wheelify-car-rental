import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const imgSrc = (url) =>
  url && url.startsWith("/") ? `http://localhost:3000${url}` : url;

export default function Vehicles() {
  const navigate = useNavigate();

  const [vehicles,       setVehicles]       = useState([]);
  const [allLocations,   setAllLocations]   = useState([]);
  const [loading,        setLoading]        = useState(true);

  const [search,         setSearch]         = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxPrice,       setMaxPrice]       = useState("");
  const [typeFilter,     setTypeFilter]     = useState("");

  // Fetch all locations once on mount (unaffected by filters)
  useEffect(() => {
    api.get("/vehicles")
      .then((res) => setAllLocations([...new Set(res.data.map((v) => v.location))]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (search)         params.search    = search;
    if (locationFilter) params.location  = locationFilter;
    if (maxPrice)       params.max_price = maxPrice;
    if (typeFilter)     params.type      = typeFilter;

    api.get("/vehicles", { params })
      .then((res) => setVehicles(res.data))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, [search, locationFilter, maxPrice, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Available Vehicles</h1>
        <p className="text-gray-500">Browse and rent cars & bikes across the UK</p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by vehicle name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
        />

        {/* Vehicle type — Cars or Bikes */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
        >
          <option value="">All Types (Cars & Bikes)</option>
          <option value="Car">Cars</option>
          <option value="Bike">Bikes</option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
        >
          <option value="">All Locations</option>
          {allLocations.map((loc, i) => (
            <option key={i} value={loc}>{loc}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max price (£/day)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4af37] outline-none"
        />
      </div>

      {/* VEHICLE GRID */}
      {loading ? (
        <div className="text-center text-gray-500">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center text-gray-500">No vehicles found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              <div className="w-full h-72 md:h-80 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={vehicle.image_url
                    ? imgSrc(vehicle.image_url)
                    : `https://picsum.photos/seed/vehicle-${vehicle.id}/800/500`}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition hover:scale-105 duration-300"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-800">{vehicle.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    vehicle.vehicle_type === "Bike"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {vehicle.vehicle_type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Model: {vehicle.model}</p>
                <p className="text-sm text-gray-500">Location: {vehicle.location}</p>
                <p className="text-[#d4af37] font-semibold mt-1">£{vehicle.rate} / day</p>

                <button
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  className="mt-auto w-full bg-[#d4af37] text-white py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
