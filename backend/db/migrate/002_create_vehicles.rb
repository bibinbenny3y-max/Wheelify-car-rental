class CreateVehicles < ActiveRecord::Migration[7.1]
  def change
    create_table :vehicles do |t|
      t.string     :name,         null: false
      t.string     :vehicle_type, null: false, default: "Car"
      t.string     :model
      t.string     :location,     null: false
      t.decimal    :rate,         null: false, precision: 10, scale: 2
      t.text       :description
      t.string     :status,       null: false, default: "pending"
      t.references :owner,        null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :vehicles, :status
    add_index :vehicles, :location
  end
end
