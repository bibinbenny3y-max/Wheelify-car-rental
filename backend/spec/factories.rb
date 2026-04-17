FactoryBot.define do

  factory :user do
    name     { "Test User" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    role     { "customer" }

    trait :owner do
      role { "owner" }
    end

    trait :admin do
      role { "admin" }
    end
  end

  factory :vehicle do
    association :owner, factory: [:user, :owner]
    name         { "Toyota Corolla" }
    vehicle_type { "Car" }
    model        { "2023" }
    location     { "London" }
    rate         { 65.0 }
    status       { "approved" }
  end

  factory :booking do
    association :vehicle
    association :renter, factory: :user
    start_date  { Date.today + 1 }
    end_date    { Date.today + 5 }
    total_price { 260.0 }
    status      { "confirmed" }
  end

  factory :payment do
    association :booking
    paypal_order_id { "PAYPAL-#{SecureRandom.hex(8).upcase}" }
    amount          { 260.0 }
    currency        { "GBP" }
    payer_name      { "John Doe" }
    status          { "completed" }
  end

end
