================================================================================
  VEHICLE RENTAL APPLICATION — SETUP GUIDE
  BSc Computer Science Project by Bibin Benny
================================================================================

This is a full-stack web application with:
  - BACKEND : Ruby on Rails 7 (API) — runs on http://localhost:3000
  - FRONTEND: React + Vite              — runs on http://localhost:5173

Both must be running at the same time for the app to work.

================================================================================
  PART 1: INSTALL PREREQUISITES (Do this ONCE on your computer)
================================================================================

You need to install 3 things before anything else:

------------------------------------------------------------------------
1. Ruby 3.2 (with Devkit)
------------------------------------------------------------------------
   a) Go to: https://rubyinstaller.org/downloads/
   b) Download "Ruby+Devkit 3.2.x (x64)" — the one with DEVKIT in the name
   c) Run the installer. When it asks, tick ALL checkboxes.
   d) At the end, a black terminal window opens asking "Which components?".
      Type:  1
      Press Enter. Wait for it to finish. Close the window.
   e) Open a NEW Command Prompt and run:
        ruby --version
      You should see something like:  ruby 3.2.x ...

------------------------------------------------------------------------
2. PostgreSQL (Database)
------------------------------------------------------------------------
   a) Go to: https://www.postgresql.org/download/windows/
   b) Click "Download the installer" then download version 15 or 16.
   c) Run the installer. Use all the defaults.
   d) When it asks for a password, type:  postgres
      IMPORTANT: Remember this password. The app uses "postgres" by default.
   e) Leave the port as 5432 (default).
   f) Finish the installation. You do NOT need to open pgAdmin.

------------------------------------------------------------------------
3. Node.js (for the frontend)
------------------------------------------------------------------------
   a) Go to: https://nodejs.org/
   b) Download the "LTS" version (the green button).
   c) Run the installer with all defaults.
   d) Open a NEW Command Prompt and run:
        node --version
      You should see something like:  v20.x.x

------------------------------------------------------------------------
4. Install Rails (after Ruby is installed)
------------------------------------------------------------------------
   Open Command Prompt and run:
     gem install rails

   This may take a few minutes. When done, verify:
     rails --version
   You should see:  Rails 7.1.x


================================================================================
  PART 2: SET UP THE BACKEND (Rails API)
================================================================================

Open Command Prompt and run these commands ONE BY ONE. Wait for each to finish.

------------------------------------------------------------------------
Step 1: Go to the backend folder
------------------------------------------------------------------------
   cd "D:\LUCINTEL-PROJETCS\BIBBIN_\backend"

------------------------------------------------------------------------
Step 2: Install all Ruby dependencies
------------------------------------------------------------------------
   bundle install

   (This installs all gems listed in Gemfile. Takes 2-5 minutes.)

------------------------------------------------------------------------
Step 3: Set up Active Storage and RSpec (one-time)
------------------------------------------------------------------------
   rails active_storage:install
   rails generate rspec:install

   If asked "Overwrite spec/spec_helper.rb? (Y/n)" type Y and press Enter.

------------------------------------------------------------------------
Step 4: Create and set up the database
------------------------------------------------------------------------
   rails db:create
   rails db:migrate

   If you get a password error, open the file:
     D:\LUCINTEL-PROJETCS\BIBBIN_\backend\config\database.yml

   Find the line that says:  password: postgres
   Change "postgres" to whatever PostgreSQL password you set during install.

------------------------------------------------------------------------
Step 5: Add demo data (users + vehicles)
------------------------------------------------------------------------
   rails db:seed

   This creates 4 demo accounts and 11 sample vehicles automatically.

------------------------------------------------------------------------
Step 6: Start the backend server
------------------------------------------------------------------------
   rails server

   You should see:
     Listening on http://127.0.0.1:3000

   KEEP THIS WINDOW OPEN. Do NOT close it.


================================================================================
  PART 3: SET UP THE FRONTEND (React App)
================================================================================

Open a SECOND Command Prompt window (keep the first one running Rails).

------------------------------------------------------------------------
Step 1: Go to the frontend folder
------------------------------------------------------------------------
   cd "D:\LUCINTEL-PROJETCS\BIBBIN_\frontend"

------------------------------------------------------------------------
Step 2: Install all JavaScript dependencies
------------------------------------------------------------------------
   npm install

   (This installs all packages listed in package.json. Takes 1-3 minutes.)

------------------------------------------------------------------------
Step 3: Start the frontend
------------------------------------------------------------------------
   npm run dev

   You should see:
     Local:   http://localhost:5173/

   KEEP THIS WINDOW OPEN TOO.

------------------------------------------------------------------------
Step 4: Open the app in your browser
------------------------------------------------------------------------
   Open your browser and go to:
     http://localhost:5173

   The app should load. If you see a blank page or error, make sure
   the Rails server (Step 6 above) is still running.


================================================================================
  PART 4: DEMO ACCOUNTS (ready to use after db:seed)
================================================================================

  Role       | Email                        | Password
  -----------|------------------------------|------------
  Admin      | admin@vehiclerental.com      | password123
  Owner 1    | owner@vehiclerental.com      | password123
  Owner 2    | owner2@vehiclerental.com     | password123
  Customer   | customer@vehiclerental.com   | password123

Use these to log in and test all features.


================================================================================
  PART 5: WHAT EACH ROLE CAN DO
================================================================================

  CUSTOMER:
    - Browse all approved vehicles (cars & bikes)
    - Filter by type, location, and max price
    - View vehicle details with photos
    - Select rental dates and book a vehicle
    - Pay via simulated card payment (no real charges)
    - View booking history
    - Edit profile and upload avatar

  OWNER:
    - List new vehicles (add photos, price, description)
    - Edit or delete their own vehicle listings
    - View bookings made on their vehicles
    - View owner dashboard (earnings overview)
    - Cannot book/rent vehicles

  ADMIN:
    - View platform stats (users, vehicles, bookings, revenue)
    - Approve or reject vehicle listings submitted by owners
      (vehicles start as "pending" — customers only see approved ones)
    - View and delete any user
    - Cannot book or list vehicles


================================================================================
  PART 6: PAYMENT SYSTEM (Simulated — No Real Charges)
================================================================================

The payment page uses a simulated card form for demonstration purposes.
No real money is charged and no real card details are processed.

When you reach the payment page:
  1. Fill in the card details (any values work — it is a demo form)
  2. Click "Pay Now"
  3. A success message appears and the booking is confirmed
  4. The booking appears in your History page

This simulates a real payment flow without requiring a PayPal or
Stripe account, making it suitable for academic demonstration.


================================================================================
  PART 7: DEMO VEHICLES (created by db:seed)
================================================================================

  Owner 1 (owner@vehiclerental.com) lists:
    - BMW M4        (Car,  London,      £180/day)
    - BMW i4        (Car,  Manchester,  £150/day)
    - G-Wagon       (Car,  Birmingham,  £220/day)
    - Mustang GT    (Car,  Liverpool,   £140/day)
    - Kawasaki Ninja(Bike, Leeds,       £65/day)
    - Harley Davidson(Bike,Bristol,     £90/day)

  Owner 2 (owner2@vehiclerental.com) lists:
    - Porsche 911   (Car,  Edinburgh,   £250/day)
    - Tesla Model 3 (Car,  London,      £130/day)
    - Classic 350   (Bike, Manchester,  £45/day)
    - Hunter 350    (Bike, Birmingham,  £40/day)
    - Jawa Bobber   (Bike, Liverpool,   £50/day)

All vehicles are pre-approved and visible to customers immediately.
New vehicles listed by owners start as "pending" until admin approves.


================================================================================
  PART 8: TRANSFERRING TO ANOTHER PC (ZIP)
================================================================================

When zipping the project to run on another PC:

  INCLUDED IN THE ZIP (works automatically):
    - All vehicle images — stored inside backend/public/images/vehicles/
      Rails serves them automatically. No extra steps needed.
    - All source code (backend + frontend)

  MUST BE SET UP FRESH ON THE NEW PC:
    1. Install Ruby, PostgreSQL, Node.js, Rails (see Part 1)
    2. Inside backend folder: bundle install
    3. Inside frontend folder: npm install
    4. Inside backend folder: rails db:create
                              rails db:migrate
                              rails db:seed

  NOTE: The database does NOT transfer in the zip. It must be created
  fresh on each machine using the steps above. The seed command will
  recreate all demo accounts and vehicles automatically.

================================================================================
  PART 9: STOPPING AND RESTARTING
================================================================================

To STOP the app:
  In each Command Prompt window, press:  Ctrl + C

To START the app again next time:
  Terminal 1:  cd "D:\LUCINTEL-PROJETCS\BIBBIN_\backend"  then  rails server
  Terminal 2:  cd "D:\LUCINTEL-PROJETCS\BIBBIN_\frontend" then  npm run dev

  You do NOT need to run bundle install, db:migrate, or npm install again.
  You do NOT need to run db:seed again unless you want to reset all data.


================================================================================
  PART 10: TROUBLESHOOTING
================================================================================

Problem: "bundle install" fails with SSL error
  Fix: Run  gem update --system  then try again.

Problem: "rails db:create" says password authentication failed
  Fix: Open config/database.yml and change the password to match what
       you set when installing PostgreSQL.

Problem: Frontend shows "Network Error" or nothing loads
  Fix: Make sure the Rails server is running on port 3000.
       Check Terminal 1 — it should say "Listening on http://127.0.0.1:3000"

Problem: "rails server" says port 3000 already in use
  Fix: Run:  netstat -ano | findstr :3000
       Then: taskkill /PID <the number shown> /F
       Then try rails server again.

Problem: Vehicle images not showing
  Fix: Make sure the backend server is running. Images are served from
       the backend at http://localhost:3000/images/vehicles/

Problem: node_modules not found / npm error
  Fix: Make sure you ran  npm install  inside the frontend folder first.

Problem: Want to reset all demo data back to default
  Fix: Run  rails db:seed:replant  inside the backend folder.
       WARNING: This deletes all existing data and re-seeds from scratch.


================================================================================
  QUICK REFERENCE — BOTH SERVERS SIDE BY SIDE
================================================================================

  TERMINAL 1 (Backend)              TERMINAL 2 (Frontend)
  --------------------------------  --------------------------------
  cd .../BIBBIN_/backend            cd .../BIBBIN_/frontend
  rails server                      npm run dev

  Runs on: http://localhost:3000    Runs on: http://localhost:5173
  (API only — not for browser)      (Open THIS in your browser)

================================================================================
  Project: Vehicle Rental Application
  Author:  Bibin Benny (BSc Computer Science, SRN: 21073767)
  Stack:   Ruby on Rails 7.1 + PostgreSQL + React + Vite + Tailwind CSS
  Auth:    JWT (devise-jwt) with JTI revocation
  Tests:   RSpec (44 examples, 0 failures)
================================================================================
