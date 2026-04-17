module Api
  module Auth
    class SessionsController < Devise::SessionsController
      respond_to :json

      # Override create — authenticate without session (API-only mode has no session middleware).
      # Manually generate JWT via warden-jwt_auth and set Authorization header.
      def create
        user = User.find_by(email: params.dig(:user, :email).to_s.downcase.strip)

        if user&.valid_password?(params.dig(:user, :password))
          token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
          response.set_header("Authorization", "Bearer #{token}")
          render json: { message: "Login successful", user: user_json(user) }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      # Override destroy — revoke JWT by rotating user's JTI.
      # Uses Warden::JWTAuth::UserDecoder (same path used for all other auth) to find the user,
      # then rotates their JTI so the old token is immediately invalid.
      def destroy
        token = request.headers["Authorization"]&.split(" ")&.last

        if token.blank?
          return render json: { message: "No active session" }, status: :unauthorized
        end

        begin
          payload = Warden::JWTAuth::TokenDecoder.new.call(token)
          user    = User.find_by(id: payload["sub"])
        rescue StandardError
          user = nil
        end

        if user
          user.update_column(:jti, SecureRandom.uuid)
          render json: { message: "Logged out successfully" }, status: :ok
        else
          render json: { message: "No active session" }, status: :unauthorized
        end
      end

      private

      # Override Devise hook — disables the "already signed out" check which calls
      # redirect/flash helpers incompatible with API-only mode.
      def verify_signed_out_user
        # no-op in API mode
      end

      def user_json(user)
        {
          id:         user.id,
          email:      user.email,
          name:       user.name,
          role:       user.role,
          phone:      user.respond_to?(:phone) ? user.phone : nil,
          avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
        }
      end
    end
  end
end
