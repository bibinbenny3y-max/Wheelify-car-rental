class Vehicle < ApplicationRecord
  belongs_to :owner, class_name: "User", foreign_key: :owner_id
  has_many   :bookings, dependent: :destroy
  has_many_attached :images

  STATUSES = %w[pending approved rejected].freeze
  TYPES    = %w[Car Bike].freeze

  validates :name,         presence: true
  validates :vehicle_type, inclusion: { in: TYPES }
  validates :location,     presence: true
  validates :rate,         presence: true, numericality: { greater_than: 0 }
  validates :status,       inclusion: { in: STATUSES }

  before_validation :set_default_status

  scope :approved, -> { where(status: "approved") }
  scope :pending,  -> { where(status: "pending") }

  def approve!
    update!(status: "approved")
  end

  def reject!
    update!(status: "rejected")
  end

  private

  def set_default_status
    self.status ||= "pending"
  end
end
