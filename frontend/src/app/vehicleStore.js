import { create } from "zustand";
import toyota from "../images/toyota.jpg";
import bmw from "../images/bmw.avif";
import ford from "../images/ford.avif";
import audi from "../images/audi.avif";
import golf from "../images/golf.avif";
import benz from "../images/benz.avif";

export const useVehicleStore = create((set) => ({
  vehicles: [
    {
      id: "1",
      name: "Toyota Corolla",
      model: "2023",
      rate: 65,
      location: "London",
      image: toyota,
      bookings: [],
      status: "approved"
    },
    {
      id: "2",
      name: "BMW 3 Series",
      model: "2022",
      rate: 120,
      location: "Manchester",
      image: bmw,
      bookings: [],
      status: "approved"
    },
    {
      id: "3",
      name: "Ford Fiesta",
      model: "2023",
      rate: 55,
      location: "Birmingham",
      image: ford,
      bookings: [],
      status: "approved"
    },
    {
      id: "4",
      name: "Audi Q5",
      model: "2024",
      rate: 140,
      location: "Liverpool",
      image: audi,
      bookings: [],
      status: "approved"
    },
    {
      id: "5",
      name: "Volkswagen Golf",
      model: "2023",
      rate: 70,
      location: "Leeds",
      image: golf,
      bookings: [],
      status: "approved"
    },
    {
      id: "6",
      name: "Mercedes C-Class",
      model: "2022",
      rate: 130,
      location: "Edinburgh",
      image: benz,
      bookings: [],
      status: "approved"
    }
  ],

  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [
        ...state.vehicles,
        { ...vehicle, status: "pending", bookings: [] }
      ],
    })),

  approveVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, status: "approved" } : v
      ),
    })),

  rejectVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, status: "rejected" } : v
      ),
    })),

  deleteVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })),
}));        