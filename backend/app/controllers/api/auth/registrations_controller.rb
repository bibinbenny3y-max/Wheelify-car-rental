module Api
  module Auth
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      # Override create to avoid Devise's auto-sign-in (which needs sessions)
      def create
        build_resource(sign_up_params)

        if resource.save
          render json: {
            message: "Registration successful",
            user: {
              id:    resource.id,
              email: resource.email,
              name:  resource.name,
              role:  resource.role
            }
          }, status: :created
        else
          render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def sign_up_params
        permitted = params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
        # Only allow customer/owner roles during self-registration — admin must be assigned manually
        permitted[:role] = "customer" unless %w[customer owner].include?(permitted[:role])
        permitted
      end
    end
  end
end
