class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  private

  def authenticate_user!
    token = request.headers["Authorization"]&.split(" ")&.last
    return render json: { error: "Unauthorized" }, status: :unauthorized unless token

    begin
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      user = User.find(payload["sub"])
      raise "revoked" unless user.jti == payload["jti"]
      @current_user = user
    rescue StandardError
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  # Optional — sets current_user from JWT if present, silently skips if not
  def try_authenticate_user
    token = request.headers["Authorization"]&.split(" ")&.last
    return unless token

    begin
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      user = User.find(payload["sub"])
      @current_user = user if user.jti == payload["jti"]
    rescue StandardError
      # no-op — unauthenticated access is allowed
    end
  end

  def current_user
    @current_user
  end
end
