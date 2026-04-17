import { create } from "zustand";

export const useBookingStore = create((set) => ({
  bookings: [],

  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),

  clearBookings: () => set({ bookings: [] }),
}));