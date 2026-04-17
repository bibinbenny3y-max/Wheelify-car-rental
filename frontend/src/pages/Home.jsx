import { useNavigate } from "react-router-dom";
import bgImage from "../images/bg.png";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "24/7 Customer Support",
      desc: "We are available anytime to assist you.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 10a6 6 0 10-12 0v4a2 2 0 002 2h1v-6H8v-1a4 4 0 118 0v1h-1v6h1a2 2 0 002-2v-4z" />
        </svg>
      )
    },
    {
      title: "Well Maintained Vehicles",
      desc: "Clean and reliable rides every time.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 13l2-5h14l2 5v6h-2v-2H5v2H3v-6z" />
          <circle cx="7.5" cy="16.5" r="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" />
        </svg>
      )
    },
    {
      title: "Flexible Pickup Points",
      desc: "Pickup and drop at your convenience.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
        </svg>
      )
    },
    {
      title: "Doorstep Delivery",
      desc: "Get your vehicle delivered to you.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l9-9 9 9M9 21V9h6v12" />
        </svg>
      )
    },
    {
      title: "Low Security Deposits",
      desc: "Affordable and transparent pricing.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2m0-10v10m9-5H3" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col">

{/* HERO */}
<section
  className="h-[90vh] flex items-center justify-center relative overflow-hidden"
>
  {/* Background image with zoom */}
  <div
    className="absolute inset-0 bg-cover bg-center hero-zoom"
    style={{ backgroundImage: `url(${bgImage})` }}
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50" />
  
{/* Moving Car Silhouette */}
<div className="car-drive">
  <svg
    width="180"
    height="60"
    viewBox="0 0 512 256"
    fill="currentColor"
    className="text-white"
  >
    <path d="M96 176c0-26.5 21.5-48 48-48h160c26.5 0 48 21.5 48 48v16h16c8.8 0 16 7.2 16 16v16h-32c0 17.7-14.3 32-32 32s-32-14.3-32-32H176c0 17.7-14.3 32-32 32s-32-14.3-32-32H80v-16c0-8.8 7.2-16 16-16h16v-16zM144 144c-17.7 0-32 14.3-32 32h64c0-17.7-14.3-32-32-32zm208 0c-17.7 0-32 14.3-32 32h64c0-17.7-14.3-32-32-32z"/>
  </svg>
</div>

  <div className="relative z-10 text-center text-white px-6">
    
    <h3
      className="typing mx-auto text-xl md:text-2xl mb-2"
      style={{ fontFamily: "Orbitron, sans-serif", maxWidth: "fit-content" }}
    >
      Welcome To
    </h3>

    <h1
      className="text-5xl md:text-6xl font-bold text-[#d4af37] drop-shadow-lg fade-slide"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Wheelify
    </h1>

    <p className="mt-4 text-gray-200 fade-slide">
      Premium Cars & Bikes for Every Journey
    </p>

    <button
      onClick={() => navigate("/login")}
      className="mt-8 bg-[#d4af37] text-white px-8 py-3 rounded-lg shadow-lg 
      hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] 
      transition duration-300 fade-slide"
    >
      Get Started
    </button>
  </div>
</section>

 {/* WHY CHOOSE */}
<section className="bg-slate-950 py-20 text-center animate-fade-in">
  <h2 className="text-3xl font-semibold text-white">
    Why Choose Wheelify
  </h2>

  <p className="text-slate-400 mt-2">
    Experience premium vehicle rentals with unmatched convenience.
  </p>

  <div className="mt-12 flex flex-wrap justify-center gap-6">
    {features.map((item, i) => (
      <div
        key={i}
        className="bg-yellow-400 text-slate-900 w-[260px] p-6 rounded-xl border border-white/20 shadow-lg 
        transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl 
        animate-slide-up animate-glow"
        style={{ animationDelay: `${i * 0.12}s` }}
      >
        <div className="mb-3 flex justify-center text-slate-900 transition-transform duration-300 hover:scale-110">
          {item.icon}
        </div>

        <h3 className="font-semibold mb-1">
          {item.title}
        </h3>

        <p className="text-sm opacity-80">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>

{/* STATS */}
<section className="bg-gradient-to-r from-[#d4af37] to-[#c9a227] py-16 text-white">
  <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-16 text-center">
    {[
      { number: "1000+", label: "Vehicles Available" },
      { number: "40k+", label: "Happy Customers" },
      { number: "4.8/5", label: "Customer Rating" },
      { number: "24/7", label: "Customer Support" }
    ].map((stat, i) => (
      <div key={i} className="animate-pop" style={{ animationDelay: `${i * 0.15}s` }}>
        <h2 className="text-3xl font-semibold">{stat.number}</h2>
        <p className="opacity-90">{stat.label}</p>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
