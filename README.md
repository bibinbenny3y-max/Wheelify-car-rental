# Wheelify — Vehicle Rental Platform

A full-stack vehicle rental web application built as a BSc Computer Science final year project.

**Author:** Bibin Benny  
**Stack:** Ruby on Rails 7.1 (API) · React + Vite · PostgreSQL · Tailwind CSS · JWT Auth

---

## Features

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse & filter vehicles, book rentals, simulated payment, booking history, profile |
| **Owner** | List vehicles with photos, manage listings, view bookings & earnings dashboard |
| **Admin** | Approve/reject vehicle listings, manage users, view platform stats |

---

## Tech Stack

**Backend**
- Ruby on Rails 7.1 (API-only mode)
- PostgreSQL
- Devise + devise-jwt (JWT authentication with JTI revocation)
- Active Storage (vehicle image uploads)
- RSpec (44 examples, 0 failures)

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Zustand (state management)
- Axios (API calls)

---

## Getting Started

### Prerequisites

Install these once on your machine:
- [Ruby 3.2 + Devkit](https://rubyinstaller.org/downloads/) — pick the one with **DEVKIT**
- [PostgreSQL 15/16](https://www.postgresql.org/download/windows/) — set password to `postgres`
- [Node.js LTS](https://nodejs.org/)
- Rails: `gem install rails`

### Setup

**Terminal 1 — Backend**
```bash
cd backend
bundle install
rails active_storage:install
rails db:create
rails db:migrate
rails db:seed
rails server
# Runs on http://localhost:3000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

> If `rails db:create` fails with a password error, edit `backend/config/database.yml` and set `password:` to match your PostgreSQL install password.

---

## Demo Accounts

After running `rails db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vehiclerental.com | password123 |
| Owner 1 | owner@vehiclerental.com | password123 |
| Owner 2 | owner2@vehiclerental.com | password123 |
| Customer | customer@vehiclerental.com | password123 |

---

## Demo Vehicles (pre-seeded)

| Vehicle | Type | Location | Price/day |
|---------|------|----------|-----------|
| BMW M4 | Car | London | £180 |
| BMW i4 | Car | Manchester | £150 |
| G-Wagon | Car | Birmingham | £220 |
| Mustang GT | Car | Liverpool | £140 |
| Porsche 911 | Car | Edinburgh | £250 |
| Tesla Model 3 | Car | London | £130 |
| Kawasaki Ninja | Bike | Leeds | £65 |
| Harley Davidson | Bike | Bristol | £90 |
| Royal Enfield Classic 350 | Bike | Manchester | £45 |
| Royal Enfield Hunter 350 | Bike | Birmingham | £40 |
| Jawa Bobber | Bike | Liverpool | £50 |

---

## Payment

The payment page uses a **simulated card form** — no real charges are made. Enter any card details to complete a booking (demo only).

---

## Project Structure

```
Wheelify-car-rental/
├── backend/          # Rails 7.1 API
│   ├── app/
│   │   ├── controllers/api/
│   │   └── models/
│   ├── config/
│   ├── db/
│   │   ├── migrate/
│   │   └── seeds.rb
│   └── spec/         # RSpec tests
└── frontend/         # React + Vite
    └── src/
        ├── components/
        ├── pages/
        ├── store/    # Zustand
        └── services/ # Axios API layer
```

---

## API

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign_in` | Login |
| DELETE | `/auth/sign_out` | Logout |
| POST | `/auth` | Register |
| GET | `/vehicles` | List vehicles |
| POST | `/vehicles` | Create vehicle (owner) |
| GET | `/bookings` | List bookings |
| POST | `/bookings` | Create booking |
| GET | `/admin/dashboard` | Admin stats |

---

## Running Tests

```bash
cd backend
bundle exec rspec
```
