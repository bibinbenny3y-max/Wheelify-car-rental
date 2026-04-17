Rails.application.routes.draw do
  namespace :api do
    # ── Auth ──────────────────────────────────────────────────────────────────
    devise_for :users,
      path: "auth",
      path_names: {
        sign_in:  "login",
        sign_out: "logout",
        registration: "register"
      },
      controllers: {
        sessions:      "api/auth/sessions",
        registrations: "api/auth/registrations"
      }

    # ── Vehicles ───────────────────────────────────────────────────────────────
    resources :vehicles do
      member do
        put :approve
        put :reject
      end
    end

    # ── Bookings ───────────────────────────────────────────────────────────────
    resources :bookings, only: [:index, :create, :destroy] do
      collection { get :owner }
      member     { put :cancel_by_owner }
    end

    # ── Payments ───────────────────────────────────────────────────────────────
    scope :payments do
      post "capture", to: "payments#capture"
    end

    # ── Profile ────────────────────────────────────────────────────────────────
    resource :profile, only: [:show, :update] do
      put :password, on: :collection
    end

    # ── Admin ──────────────────────────────────────────────────────────────────
    namespace :admin do
      resources :users, only: [:index, :destroy]
      get "stats", to: "dashboard#stats"
    end
  end
end
