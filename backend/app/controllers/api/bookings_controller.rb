module Api
  class BookingsController < BaseController

    # GET /api/bookings — current user's bookings as a renter
    def index
      bookings = current_user.bookings.includes(:vehicle, :payment).order(created_at: :desc)
      render json: bookings.map { |b| booking_json(b) }
    end

    # GET /api/bookings/owner — bookings for vehicles owned by current user
    def owner
      vehicle_ids = current_user.vehicles.pluck(:id)
      bookings    = Booking.where(vehicle_id: vehicle_ids)
                           .includes(:vehicle, :renter)
                           .order(created_at: :desc)

      render json: bookings.map { |b| booking_json(b, owner_view: true) }
    end

    # POST /api/bookings
    def create
      vehicle = Vehicle.find(params.dig(:booking, :vehicle_id) || params[:vehicle_id])
      booking = vehicle.bookings.build(booking_params)
      booking.renter = current_user

      if booking.save
        render json: booking_json(booking), status: :created
      else
        render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/bookings/:id — cancel own booking (renter)
    def destroy
      booking = current_user.bookings.find(params[:id])
      booking.update!(status: "cancelled")
      render json: { message: "Booking cancelled" }
    end

    # PUT /api/bookings/:id/cancel_by_owner — owner cancels a booking on their vehicle
    def cancel_by_owner
      vehicle_ids = current_user.vehicles.pluck(:id)
      booking = Booking.where(vehicle_id: vehicle_ids).find(params[:id])
      booking.update!(status: "cancelled")
      render json: { message: "Booking cancelled by owner" }
    end

    private

    def booking_params
      if params[:booking].present?
        params.require(:booking).permit(:start_date, :end_date)
      else
        params.permit(:start_date, :end_date)
      end
    end

    def booking_json(booking, owner_view: false)
      data = {
        id:          booking.id,
        start_date:  booking.start_date,
        end_date:    booking.end_date,
        total_price: booking.total_price,
        status:      booking.status,
        created_at:  booking.created_at,
        vehicle: {
          id:       booking.vehicle.id,
          name:     booking.vehicle.name,
          location: booking.vehicle.location
        }
      }

      # Add payment info if payment exists
      if booking.payment
        data[:payment] = {
          paypal_order_id: booking.payment.paypal_order_id,
          payer_name:      booking.payment.payer_name,
          status:          booking.payment.status
        }
      end

      # Owner view includes renter info
      data[:renter] = booking.renter.email if owner_view

      data
    end
  end
end
