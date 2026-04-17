require "rails_helper"

RSpec.describe Booking, type: :model do
  let(:vehicle) { create(:vehicle) }
  let(:renter)  { create(:user) }

  describe "validations" do
    it "is valid with correct attributes" do
      booking = build(:booking, vehicle: vehicle, renter: renter)
      expect(booking).to be_valid
    end

    it "is invalid without start_date" do
      booking = build(:booking, vehicle: vehicle, renter: renter, start_date: nil)
      expect(booking).not_to be_valid
    end

    it "is invalid if end_date is before start_date" do
      booking = build(:booking, vehicle: vehicle, renter: renter,
                      start_date: Date.today + 5, end_date: Date.today + 1)
      expect(booking).not_to be_valid
      expect(booking.errors[:end_date]).to include("must be after start date")
    end
  end

  describe "overlap detection" do
    before do
      create(:booking, vehicle: vehicle, renter: renter,
             start_date: Date.today + 2, end_date: Date.today + 6, status: "confirmed")
    end

    it "rejects overlapping dates" do
      overlapping = build(:booking, vehicle: vehicle, renter: renter,
                          start_date: Date.today + 4, end_date: Date.today + 8)
      expect(overlapping).not_to be_valid
      expect(overlapping.errors[:base]).to include("Selected dates are already booked")
    end

    it "allows non-overlapping dates" do
      next_booking = build(:booking, vehicle: vehicle, renter: renter,
                           start_date: Date.today + 7, end_date: Date.today + 10)
      expect(next_booking).to be_valid
    end
  end

  describe "price calculation" do
    it "calculates total_price from days × rate" do
      booking = create(:booking, vehicle: vehicle, renter: renter,
                       start_date: Date.today + 1, end_date: Date.today + 4)
      expect(booking.total_price).to eq(3 * vehicle.rate)
    end
  end
end
