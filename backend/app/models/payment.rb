class Payment < ApplicationRecord
  belongs_to :booking

  STATUSES = %w[pending completed failed].freeze

  validates :amount,           presence: true, numericality: { greater_than: 0 }
  validates :currency,         presence: true
  validates :status,           inclusion: { in: STATUSES }
  validates :paypal_order_id,  presence: true

  before_validation :set_defaults

  private

  def set_defaults
    self.currency ||= "GBP"
    self.status   ||= "pending"
  end
end
