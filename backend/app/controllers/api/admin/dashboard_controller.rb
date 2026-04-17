module Api
  module Admin
    class DashboardController < Api::BaseController
      before_action :authorize_admin!

      # GET /api/admin/stats
      def stats
        total_revenue = Payment.where(status: "completed").sum(:amount)

        render json: {
          total_users:    User.count,
          total_vehicles: Vehicle.count,
          total_bookings: Booking.where(status: "confirmed").count,
          total_revenue:  total_revenue
        }
      end
    end
  end
end
