# Seeds — creates demo users and vehicles for development/testing

puts "Seeding database..."

# ── Users ──────────────────────────────────────────────────────────────────────

admin = User.find_or_create_by!(email: "admin@vehiclerental.com") do |u|
  u.name     = "Admin User"
  u.password = "password123"
  u.role     = "admin"
end
puts "Admin: admin@vehiclerental.com / password123"

owner = User.find_or_create_by!(email: "owner@vehiclerental.com") do |u|
  u.name     = "John Owner"
  u.password = "password123"
  u.role     = "owner"
end
puts "Owner 1: owner@vehiclerental.com / password123"

owner2 = User.find_or_create_by!(email: "owner2@vehiclerental.com") do |u|
  u.name     = "Emma Owner"
  u.password = "password123"
  u.role     = "owner"
end
puts "Owner 2: owner2@vehiclerental.com / password123"

customer = User.find_or_create_by!(email: "customer@vehiclerental.com") do |u|
  u.name     = "Sarah Customer"
  u.password = "password123"
  u.role     = "customer"
end
puts "Customer: customer@vehiclerental.com / password123"

# ── Vehicles ───────────────────────────────────────────────────────────────────

vehicles_data = [
  # Cars — Owner 1
  { name: "BMW M4",         vehicle_type: "Car",  model: "2023", location: "London",     rate: 180, owner: owner,  description: "High-performance BMW M4 coupe. Twin-turbo inline-6, pure driving thrill." },
  { name: "BMW i4",         vehicle_type: "Car",  model: "2024", location: "Manchester", rate: 150, owner: owner,  description: "All-electric BMW i4 Gran Coupe. 0-60 in 3.9s, 300mi range." },
  { name: "G-Wagon",        vehicle_type: "Car",  model: "2023", location: "Birmingham", rate: 220, owner: owner,  description: "Iconic Mercedes-Benz G-Class. Luxury meets unstoppable off-road capability." },
  { name: "Mustang GT",     vehicle_type: "Car",  model: "2023", location: "Liverpool",  rate: 140, owner: owner,  description: "Ford Mustang GT with 5.0L V8. Classic American muscle, roaring performance." },
  # Cars — Owner 2
  { name: "Porsche 911",    vehicle_type: "Car",  model: "2024", location: "Edinburgh",  rate: 250, owner: owner2, description: "The legendary Porsche 911 Carrera. Rear-engine sports car perfection." },
  { name: "Tesla Model 3",  vehicle_type: "Car",  model: "2024", location: "London",     rate: 130, owner: owner2, description: "Tesla Model 3 Performance. Fully electric, autopilot, zero emissions." },
  # Bikes — Owner 1
  { name: "Kawasaki Ninja", vehicle_type: "Bike", model: "2023", location: "Leeds",      rate: 65,  owner: owner,  description: "Kawasaki Ninja 400 — lightweight sportbike, perfect for city and track." },
  { name: "Harley Davidson",vehicle_type: "Bike", model: "2022", location: "Bristol",    rate: 90,  owner: owner,  description: "Harley-Davidson Street Glide. Classic cruiser with thundering V-Twin engine." },
  # Bikes — Owner 2
  { name: "Classic 350",    vehicle_type: "Bike", model: "2023", location: "Manchester", rate: 45,  owner: owner2, description: "Royal Enfield Classic 350. Timeless retro styling with modern reliability." },
  { name: "Hunter 350",     vehicle_type: "Bike", model: "2023", location: "Birmingham", rate: 40,  owner: owner2, description: "Royal Enfield Hunter 350. Agile urban roadster, smooth and stylish." },
  { name: "Jawa Bobber",    vehicle_type: "Bike", model: "2022", location: "Liverpool",  rate: 50,  owner: owner2, description: "Jawa 42 Bobber. Retro-inspired cruiser with a low, aggressive stance." },
]

vehicles_data.each do |attrs|
  vehicle = Vehicle.find_or_initialize_by(name: attrs[:name], owner: attrs[:owner])
  vehicle.assign_attributes(
    vehicle_type: attrs[:vehicle_type],
    model:        attrs[:model],
    location:     attrs[:location],
    rate:         attrs[:rate],
    status:       "approved",
    description:  attrs[:description]
  )
  vehicle.save!
end

puts "Created #{Vehicle.count} vehicles (#{Vehicle.where(owner: owner).count} by owner1, #{Vehicle.where(owner: owner2).count} by owner2)"
puts "Done! ✓"
