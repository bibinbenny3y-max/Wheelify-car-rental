# Backend Setup Guide

## Prerequisites (install these first)
1. Ruby+Devkit 3.2.x — https://rubyinstaller.org/downloads/
2. PostgreSQL 15/16 — https://www.postgresql.org/download/windows/
3. Node.js LTS — https://nodejs.org/
4. Run `gem install rails` in terminal after Ruby is installed

## One-time Setup

```bash
# 1. Navigate to backend folder
cd D:/LUCINTEL-PROJETCS/BIBBIN_/backend

# 2. Install all gems
bundle install

# 3. Setup Active Storage tables + RSpec
rails active_storage:install
rails generate rspec:install

# 4. Create and migrate the database
rails db:create
rails db:migrate

# 5. Seed demo data (4 users + 11 vehicles with images)
rails db:seed

# 6. Start the server
rails server
# → Running on http://localhost:3000
```

## Demo Accounts (created by seed)

| Role     | Email                        | Password    |
|----------|------------------------------|-------------|
| Admin    | admin@vehiclerental.com      | password123 |
| Owner 1  | owner@vehiclerental.com      | password123 |
| Owner 2  | owner2@vehiclerental.com     | password123 |
| Customer | customer@vehiclerental.com   | password123 |

## Role Permissions

| Action                  | Customer | Owner | Admin |
|-------------------------|----------|-------|-------|
| Browse vehicles         | ✓        | ✓     | ✓     |
| Book / rent a vehicle   | ✓        | ✗     | ✗     |
| List / manage vehicles  | ✗        | ✓     | ✓     |
| Approve / reject listings | ✗      | ✗     | ✓     |
| Delete users            | ✗        | ✗     | ✓     |
| View platform stats     | ✗        | ✗     | ✓     |

## Run Tests
```bash
bundle exec rspec
# 44 examples, 0 failures
```

## Reset Demo Data
```bash
rails db:seed:replant
# Clears all data and re-seeds from scratch
```

## API Base URL
All endpoints: `http://localhost:3000/api`

## Key API Endpoints

| Method | Path                      | Auth         | Description                          |
|--------|---------------------------|--------------|--------------------------------------|
| POST   | /api/auth/register        | Public       | Register (role: customer or owner)   |
| POST   | /api/auth/login           | Public       | Login — returns JWT in header        |
| DELETE | /api/auth/logout          | JWT          | Logout / revoke token (JTI rotation) |
| GET    | /api/vehicles             | Public       | Browse approved vehicles             |
| GET    | /api/vehicles?mine=true   | JWT (owner)  | Owner's own vehicle listings         |
| GET    | /api/vehicles?all=true    | JWT (admin)  | All vehicles regardless of status    |
| POST   | /api/vehicles             | JWT (owner)  | Create vehicle listing (pending)     |
| PUT    | /api/vehicles/:id         | JWT (owner)  | Update own vehicle                   |
| DELETE | /api/vehicles/:id         | JWT (owner)  | Delete own vehicle                   |
| PUT    | /api/vehicles/:id/approve | JWT (admin)  | Approve a vehicle listing            |
| PUT    | /api/vehicles/:id/reject  | JWT (admin)  | Reject a vehicle listing             |
| GET    | /api/bookings             | JWT          | My bookings as renter                |
| GET    | /api/bookings/owner       | JWT (owner)  | Bookings made on my vehicles         |
| DELETE | /api/bookings/:id         | JWT          | Cancel a booking                     |
| POST   | /api/payments/capture     | JWT (customer)| Confirm payment + save booking      |
| GET    | /api/profile              | JWT          | Get my profile                       |
| PUT    | /api/profile              | JWT          | Update name / phone / avatar         |
| PUT    | /api/profile/password     | JWT          | Change password                      |
| GET    | /api/admin/stats          | JWT (admin)  | Platform stats                       |
| GET    | /api/admin/users          | JWT (admin)  | List all users                       |
| DELETE | /api/admin/users/:id      | JWT (admin)  | Delete a user                        |

## Transferring to Another PC (Zip)

When zipping the project to run on another PC:

**What is included in the zip (no extra steps needed):**
- All vehicle images — stored in `backend/public/images/vehicles/`
  and served automatically by Rails. Images will appear on first run.
- All source code (backend + frontend)

**What must be set up fresh on the new PC:**
- Install prerequisites (Ruby, PostgreSQL, Node.js, Rails gem)
- Run `bundle install` inside the backend folder
- Run `npm install` inside the frontend folder
- Run `rails db:create && rails db:migrate && rails db:seed` to create the database

The database does NOT transfer in the zip — it must always be created
fresh on each machine using the seed command above.

## Notes
- JWT tokens expire after 24 hours
- Logout rotates the user's JTI so old tokens are immediately invalid
- Vehicle images are served as static files from `public/images/vehicles/`
- Owners can upload custom images when listing; seeded vehicles use bundled images
- Default PostgreSQL password is "postgres" — change in `config/database.yml` if needed
