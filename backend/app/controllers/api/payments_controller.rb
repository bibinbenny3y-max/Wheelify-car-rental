module Api
  class PaymentsController < BaseController

    # POST /api/payments/capture
    # Called after PayPal approves the payment on the frontend.
    # Saves the confirmed booking + payment to the database.
    def capture
      if current_user.role == "owner"
        return render json: { error: "Owners cannot book vehicles" }, status: :forbidden
      end

      vehicle = Vehicle.find(params[:vehicle_id])

      # Build booking
      booking = vehicle.bookings.build(
        renter:      current_user,
        start_date:  params[:start_date],
        end_date:    params[:end_date],
        status:      "confirmed"
      )

      # Build payment record
      payment = booking.build_payment(
        paypal_order_id: params[:paypal_order_id],
        amount:          params[:total_price],
        currency:        "GBP",
        payer_name:      params[:payer_name],
        status:          "completed"
      )

      if booking.save
        render json: {
          message: "Booking confirmed",
          booking: {
            id:          booking.id,
            start_date:  booking.start_date,
            end_date:    booking.end_date,
            total_price: booking.total_price,
            status:      booking.status,
            payment_id:  payment.paypal_order_id,
            payer_name:  payment.payer_name
          }
        }, status: :created
      else
        render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
