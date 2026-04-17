class CreatePayments < ActiveRecord::Migration[7.1]
  def change
    create_table :payments do |t|
      t.references :booking,        null: false, foreign_key: true
      t.string     :paypal_order_id, null: false
      t.decimal    :amount,          null: false, precision: 10, scale: 2
      t.string     :currency,        null: false, default: "GBP"
      t.string     :payer_name
      t.string     :status,          null: false, default: "pending"

      t.timestamps
    end

    add_index :payments, :paypal_order_id, unique: true
    add_index :payments, :status
  end
end
