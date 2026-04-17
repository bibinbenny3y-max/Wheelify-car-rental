require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module VehicleRental
  class Application < Rails::Application
    config.load_defaults 7.1

    # API-only — no views, sessions, or cookies
    config.api_only = true

    config.time_zone = "UTC"

    # Active Storage: use local disk in dev/test
    config.active_storage.service = :local

  end
end
