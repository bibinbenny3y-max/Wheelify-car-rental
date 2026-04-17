class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :vehicles, foreign_key: :owner_id, dependent: :destroy
  has_many :bookings, foreign_key: :renter_id, dependent: :destroy
  has_one_attached :avatar

  ROLES = %w[customer owner admin].freeze

  validates :name,  presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :role,  inclusion: { in: ROLES }

  before_validation :set_default_role

  def admin?
    role == "admin"
  end

  def owner?
    role == "owner" || role == "admin"
  end

  private

  def set_default_role
    self.role ||= "customer"
  end
end
