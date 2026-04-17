export default function VehicleCard({ vehicle }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        width: "250px",
        transition: "0.3s"
      }}
    >
      <h3 style={{ color: "var(--accent)" }}>{vehicle.name}</h3>
      <p>Type: {vehicle.type}</p>
      <p>Price per day: £{vehicle.price}</p>
    </div>
  );
}
