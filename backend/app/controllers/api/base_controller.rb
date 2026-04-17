module Api
  class BaseController < ApplicationController
    before_action :authenticate_user!

    rescue_from ActiveRecord::RecordNotFound do |e|
      render json: { error: e.message }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    private

    def authorize_admin!
      render json: { error: "Forbidden" }, status: :forbidden unless current_user.admin?
    end

    def authorize_owner_or_admin!
      render json: { error: "Forbidden" }, status: :forbidden unless current_user.owner?
    end
  end
end
