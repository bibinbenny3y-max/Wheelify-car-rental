require "rails_helper"

RSpec.describe "Api::Admin", type: :request do
  let(:admin)    { create(:user, :admin) }
  let(:owner)    { create(:user, :owner) }
  let(:customer) { create(:user) }

  def auth_headers_for(user)
    post "/api/auth/login", params: { user: { email: user.email, password: "password123" } },
                            as: :json
    { "Authorization" => response.headers["Authorization"] }
  end

  describe "GET /api/admin/stats" do
    before do
      create(:vehicle, owner: owner, status: "approved")
      create(:booking, vehicle: create(:vehicle, owner: owner, status: "approved"), renter: customer)
    end

    it "returns platform stats for admin" do
      get "/api/admin/stats", headers: auth_headers_for(admin)

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body).to include("total_users", "total_vehicles", "total_bookings", "total_revenue")
      expect(body["total_users"]).to be >= 3
    end

    it "forbids non-admin access" do
      get "/api/admin/stats", headers: auth_headers_for(customer)
      expect(response).to have_http_status(:forbidden)
    end

    it "requires authentication" do
      get "/api/admin/stats"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/admin/users" do
    it "returns all users for admin" do
      customer # create
      get "/api/admin/users", headers: auth_headers_for(admin)

      expect(response).to have_http_status(:ok)
      users = JSON.parse(response.body)
      expect(users).to be_an(Array)
      expect(users.first).to include("id", "email", "name", "role")
    end

    it "forbids non-admin" do
      get "/api/admin/users", headers: auth_headers_for(owner)
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /api/admin/users/:id" do
    it "allows admin to delete a user" do
      user_to_delete = create(:user)
      delete "/api/admin/users/#{user_to_delete.id}", headers: auth_headers_for(admin)

      expect(response).to have_http_status(:ok)
      expect(User.exists?(user_to_delete.id)).to be false
    end

    it "prevents admin from deleting their own account" do
      delete "/api/admin/users/#{admin.id}", headers: auth_headers_for(admin)
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "forbids non-admin from deleting users" do
      target = create(:user)
      delete "/api/admin/users/#{target.id}", headers: auth_headers_for(customer)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
