# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_03_06_061907) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookings", force: :cascade do |t|
    t.bigint "vehicle_id", null: false
    t.bigint "renter_id", null: false
    t.date "start_date", null: false
    t.date "end_date", null: false
    t.decimal "total_price", precision: 10, scale: 2, null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["renter_id"], name: "index_bookings_on_renter_id"
    t.index ["status"], name: "index_bookings_on_status"
    t.index ["vehicle_id", "start_date", "end_date"], name: "index_bookings_on_vehicle_id_and_start_date_and_end_date"
    t.index ["vehicle_id"], name: "index_bookings_on_vehicle_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "booking_id", null: false
    t.string "paypal_order_id", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "currency", default: "GBP", null: false
    t.string "payer_name"
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_payments_on_booking_id"
    t.index ["paypal_order_id"], name: "index_payments_on_paypal_order_id", unique: true
    t.index ["status"], name: "index_payments_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "role", default: "customer", null: false
    t.string "phone"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "jti", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "vehicles", force: :cascade do |t|
    t.string "name", null: false
    t.string "vehicle_type", default: "Car", null: false
    t.string "model"
    t.string "location", null: false
    t.decimal "rate", precision: 10, scale: 2, null: false
    t.text "description"
    t.string "status", default: "pending", null: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location"], name: "index_vehicles_on_location"
    t.index ["owner_id"], name: "index_vehicles_on_owner_id"
    t.index ["status"], name: "index_vehicles_on_status"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookings", "users", column: "renter_id"
  add_foreign_key "bookings", "vehicles"
  add_foreign_key "payments", "bookings"
  add_foreign_key "vehicles", "users", column: "owner_id"
end
