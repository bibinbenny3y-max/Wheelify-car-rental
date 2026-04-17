Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = false

  config.consider_all_requests_local = true
  config.cache_store = :null_store

  # Active Storage — use disk for test
  config.active_storage.service = :test

  # Action Mailer
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :test

  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []

  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = false
end
