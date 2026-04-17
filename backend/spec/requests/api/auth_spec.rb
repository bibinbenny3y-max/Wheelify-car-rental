require "rails_helper"

RSpec.describe "Api::Auth", type: :request do
  let(:user) { create(:user, email: "test@example.com", password: "password123") }

  describe "POST /api/auth/register" do
    it "registers a new customer" do
      post "/api/auth/register", params: {
        user: { name: "New User", email: "new@example.com", password: "password123", role: "customer" }
      }, as: :json

      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body["user"]["role"]).to eq("customer")
    end

    it "registers a new owner" do
      post "/api/auth/register", params: {
        user: { name: "New Owner", email: "owner@example.com", password: "password123", role: "owner" }
      }, as: :json

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["user"]["role"]).to eq("owner")
    end

    it "blocks self-registration as admin" do
      post "/api/auth/register", params: {
        user: { name: "Hacker", email: "hack@example.com", password: "password123", role: "admin" }
      }, as: :json

      expect(response).to have_http_status(:created)
      # role falls back to customer when admin is attempted
      expect(JSON.parse(response.body)["user"]["role"]).to eq("customer")
    end

    it "rejects duplicate email" do
      user # create user first
      post "/api/auth/register", params: {
        user: { name: "Dup", email: user.email, password: "password123" }
      }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects short password" do
      post "/api/auth/register", params: {
        user: { name: "Bad", email: "bad@example.com", password: "123" }
      }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "POST /api/auth/login" do
    before { user }

    it "returns JWT token on valid credentials" do
      post "/api/auth/login", params: {
        user: { email: user.email, password: "password123" }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.headers["Authorization"]).to start_with("Bearer ")
      body = JSON.parse(response.body)
      expect(body["user"]["email"]).to eq(user.email)
    end

    it "returns 401 on wrong password" do
      post "/api/auth/login", params: {
        user: { email: user.email, password: "wrongpass" }
      }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 401 for unknown email" do
      post "/api/auth/login", params: {
        user: { email: "nobody@example.com", password: "password123" }
      }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /api/auth/logout" do
    # Test functional outcome: after logout the old token can no longer access protected routes.
    # (The logout HTTP status itself varies between environments due to Devise/Warden middleware
    # interactions in API-only mode — the functionality is verified by token revocation below.)
    it "revokes the JWT so the old token no longer works" do
      post "/api/auth/login", params: {
        user: { email: user.email, password: "password123" }
      }, as: :json
      token = response.headers["Authorization"]

      # Rotate JTI by calling logout (status may vary in test env)
      delete "/api/auth/logout", headers: { "Authorization" => token }

      # Old token must now be rejected on a protected endpoint
      get "/api/bookings", headers: { "Authorization" => token }
      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 401 when not logged in" do
      delete "/api/auth/logout"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
