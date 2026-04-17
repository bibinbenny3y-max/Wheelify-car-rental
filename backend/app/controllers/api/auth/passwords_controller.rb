module Api
  module Auth
    class PasswordsController < ApplicationController
      skip_before_action :authenticate_user!

      # POST /api/auth/password/reset
      # Direct password reset — no email required (demo mode)
      def reset
        user = User.find_by(email: params.dig(:user, :email).to_s.downcase.strip)

        unless user
          return render json: { error: "No account found with that email" }, status: :not_found
        end

        new_password = params.dig(:user, :password)

        if new_password.blank? || new_password.length < 6
          return render json: { error: "Password must be at least 6 characters" }, status: :unprocessable_entity
        end

        user.password = new_password
        if user.save
          render json: { message: "Password updated successfully" }, status: :ok
        else
          render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end
    end
  end
end
