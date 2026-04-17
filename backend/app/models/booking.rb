class Booking < ApplicationRecord
  belongs_to :vehicle
  belongs_to :renter, class_name: "User", foreign_key: :renter_id
  has_one    :payment, dependent: :destroy

  STATUSES = %w[pending confirmed cancelled].freeze

  validates :start_date,   presence: true
  validates :end_date,     presence: true
  validates :total_price,  presence: true, numericality: { greater_than: 0 }
  validates :status,       inclusion: { in: STATUSES }
  validate  :end_date_after_start_date
  validate  :dates_must_not_overlap

  before_validation :set_default_status
  before_validation :calculate_total_price

  scope :confirmed, -> { where(status: "confirmed") }

  private

  def set_default_status
    self.status ||= "pending"
  end

  def calculate_total_price
    return unless start_date && end_date && vehicle
    days = (end_date - start_date).to_i
    self.total_price = days * vehicle.rate if days > 0
  end

  def end_date_after_start_date
    return unless start_date && end_date
    errors.add(:end_date, "must be after start date") if end_date <= start_date
  end

  def dates_must_not_overlap
    return unless start_date && end_date && vehicle

    overlap = vehicle.bookings.confirmed
                     .where.not(id: id)
                     .where("start_date < ? AND end_date > ?", end_date, start_date)

    errors.add(:base, "Selected dates are already booked") if overlap.exists?
  end
end
