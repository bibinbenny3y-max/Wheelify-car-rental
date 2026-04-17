class CreateBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :bookings do |t|
      t.references :vehicle, null: false, foreign_key: true
      t.references :renter,  null: false, foreign_key: { to_table: :users }
      t.date       :start_date,  null: false
      t.date       :end_date,    null: false
      t.decimal    :total_price, null: false, precision: 10, scale: 2
      t.string     :status,      null: false, default: "pending"

      t.timestamps
    end

    add_index :bookings, :status
    add_index :bookings, [:vehicle_id, :start_date, :end_date]
  end
end
