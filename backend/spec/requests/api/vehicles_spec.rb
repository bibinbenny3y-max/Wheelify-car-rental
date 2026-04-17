require "rails_helper"

RSpec.describe "Api::Vehicles", type: :request do
  let(:owner)    { create(:user, :owner) }
  let(:admin)    { create(:user, :admin) }
  let(:customer) { create(:user) }

  # Helper — log in and return the JWT Authorization header value
  def auth_headers_for(user)
    post "/api/auth/login", params: { user: { email: user.email, password: "password123" } },
                            as: :json
    { "Authorization" => response.headers["Authorization"] }
  end

  describe "GET /api/vehicles" do
    before { create_list(:vehicle, 3, owner: owner, status: "approved") }

    it "returns approved vehicles without auth" do
      get "/api/vehicles"
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(3)
    end

    it "filters by location" do
      create(:vehicle, owner: owner, location: "Manchester", status: "approved")
      get "/api/vehicles", params: { location: "Manchester" }
      expect(JSON.parse(response.body).length).to eq(1)
    end

    it "does not return pending vehicles by default" do
      create(:vehicle, owner: owner, status: "pending")
      get "/api/vehicles"
      expect(JSON.parse(response.body).length).to eq(3)
    end

    it "returns all vehicles with ?all=true when admin" do
      create(:vehicle, owner: owner, status: "pending")
      get "/api/vehicles", params: { all: true }, headers: auth_headers_for(admin)
      expect(JSON.parse(response.body).length).to eq(4)
    end

    it "returns only owner's vehicles with ?mine=true" do
      other_owner = create(:user, :owner)
      create(:vehicle, owner: other_owner, status: "approved")
      get "/api/vehicles", params: { mine: true }, headers: auth_headers_for(owner)
      expect(JSON.parse(response.body).length).to eq(3)
    end
  end

  describe "POST /api/vehicles" do
    it "creates a vehicle with status pending" do
      post "/api/vehicles",
           params: { name: "Test Car", vehicle_type: "Car", location: "London", rate: 80, model: "2023" },
           headers: auth_headers_for(owner),
           as: :json
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["status"]).to eq("pending")
    end
  end

  describe "PUT /api/vehicles/:id/approve" do
    let(:vehicle) { create(:vehicle, owner: owner, status: "pending") }

    it "approves vehicle when admin" do
      put "/api/vehicles/#{vehicle.id}/approve", headers: auth_headers_for(admin)
      expect(response).to have_http_status(:ok)
      expect(vehicle.reload.status).to eq("approved")
    end

    it "forbids approval when not admin" do
      put "/api/vehicles/#{vehicle.id}/approve", headers: auth_headers_for(owner)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
