require "rails_helper"

RSpec.describe "Api::Payments", type: :request do
  let(:owner)    { create(:user, :owner) }
  let(:customer) { create(:user) }
  let(:vehicle)  { create(:vehicle, owner: owner, status: "approved") }

  def auth_headers_for(user)
    post "/api/auth/login", params: { user: { email: user.email, password: "password123" } },
                            as: :json
    { "Authorization" => response.headers["Authorization"] }
  end

  describe "POST /api/payments/capture" do
    let(:valid_params) do
      {
        vehicle_id:      vehicle.id,
        start_date:      Date.today + 1,
        end_date:        Date.today + 4,
        total_price:     vehicle.rate * 3,
        paypal_order_id: "DEMO-TESTORDER123",
        payer_name:      "John Demo"
      }
    end

    it "creates a confirmed booking and payment record" do
      post "/api/payments/capture",
           params: valid_params,
           headers: auth_headers_for(customer),
           as: :json

      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)
      expect(body["booking"]["status"]).to eq("confirmed")
      expect(body["booking"]["payer_name"]).to eq("John Demo")
    end

    it "requires authentication" do
      post "/api/payments/capture", params: valid_params, as: :json
      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects overlapping dates on the same vehicle" do
      # Create an existing confirmed booking
      create(:booking, vehicle: vehicle, renter: customer,
             start_date: Date.today + 2, end_date: Date.today + 6, status: "confirmed")

      post "/api/payments/capture",
           params: valid_params.merge(start_date: Date.today + 3, end_date: Date.today + 7),
           headers: auth_headers_for(customer),
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "calculates total_price automatically from dates and vehicle rate" do
      post "/api/payments/capture",
           params: valid_params,
           headers: auth_headers_for(customer),
           as: :json

      body = JSON.parse(response.body)
      expected_price = (3 * vehicle.rate).to_f
      expect(body["booking"]["total_price"].to_f).to eq(expected_price)
    end
  end
end
