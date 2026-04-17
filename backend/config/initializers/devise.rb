Devise.setup do |config|
  config.mailer_sender = "noreply@vehiclerental.com"

  require "devise/orm/active_record"

  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = false
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  # JWT configuration
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.secret_key_base ||
                 ENV.fetch("DEVISE_JWT_SECRET_KEY", "fallback_secret_key_for_development_only")
    jwt.dispatch_requests = [
      ["POST", %r{^/api/auth/login$}]
    ]
    # Revocation handled manually in SessionsController#destroy via JTI rotation.
    # Leaving revocation_requests empty avoids a Warden middleware 500 in API-only mode.
    jwt.revocation_requests = []
    jwt.expiration_time = 24.hours.to_i
  end
end
