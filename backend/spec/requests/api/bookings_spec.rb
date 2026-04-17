require "rails_helper"

RSpec.describe "Api::Bookings", type: :request do
  let(:owner)    { create(:user, :owner) }
  let(:customer) { create(:user) }
  let(:vehicle)  { create(:vehicle, owner: owner, status: "approved") }

  def auth_headers_for(user)
    post "/api/auth/login", params: { user: { email: user.email, password: "password123" } },
                            as: :json
    { "Authorization" => response.headers["Authorization"] }
  end

  describe "GET /api/bookings" do
    before do
      create(:booking, vehicle: vehicle, renter: customer)
    end

    it "returns current user's bookings" do
      get "/api/bookings", headers: auth_headers_for(customer)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(1)
    end

    it "requires authentication" do
      get "/api/bookings"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/bookings/owner" do
    before do
      create(:booking, vehicle: vehicle, renter: customer)
    end

    it "returns bookings on owner's vehicles" do
      get "/api/bookings/owner", headers: auth_headers_for(owner)
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data.length).to eq(1)
      expect(data.first["renter"]).to eq(customer.email)
    end
  end

  describe "POST /api/bookings" do
    it "creates a booking" do
      post "/api/bookings",
           params: { vehicle_id: vehicle.id, start_date: Date.today + 1, end_date: Date.today + 3 },
           headers: auth_headers_for(customer),
           as: :json
      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body["total_price"]).to eq("#{(2 * vehicle.rate).to_f}")
    end

    it "rejects overlapping dates" do
      create(:booking, vehicle: vehicle, renter: customer,
             start_date: Date.today + 1, end_date: Date.today + 5, status: "confirmed")

      post "/api/bookings",
           params: { vehicle_id: vehicle.id, start_date: Date.today + 3, end_date: Date.today + 7 },
           headers: auth_headers_for(customer),
           as: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/bookings/:id" do
    let(:booking) { create(:booking, vehicle: vehicle, renter: customer) }

    it "allows renter to cancel their booking" do
      delete "/api/bookings/#{booking.id}", headers: auth_headers_for(customer)
      expect(response).to have_http_status(:ok)
      expect(booking.reload.status).to eq("cancelled")
    end
  end

  describe "PUT /api/bookings/:id/cancel_by_owner" do
    let(:booking) { create(:booking, vehicle: vehicle, renter: customer, status: "confirmed") }

    it "allows vehicle owner to cancel a booking" do
      put "/api/bookings/#{booking.id}/cancel_by_owner", headers: auth_headers_for(owner)
      expect(response).to have_http_status(:ok)
      expect(booking.reload.status).to eq("cancelled")
    end

    it "does not allow a different user to cancel" do
      other_customer = create(:user)
      put "/api/bookings/#{booking.id}/cancel_by_owner", headers: auth_headers_for(other_customer)
      expect(response).to have_http_status(:not_found)
    end
  end
end
