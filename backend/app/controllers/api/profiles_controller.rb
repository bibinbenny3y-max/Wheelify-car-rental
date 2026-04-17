module Api
  class ProfilesController < BaseController

    # GET /api/profile
    def show
      render json: profile_json(current_user)
    end

    # PUT /api/profile
    def update
      if current_user.update(profile_params)
        current_user.avatar.attach(params[:avatar]) if params[:avatar].present?
        render json: profile_json(current_user)
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PUT /api/profile/password
    def password
      unless current_user.valid_password?(params[:current_password])
        return render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
      end

      if params[:new_password].length < 6
        return render json: { error: "New password must be at least 6 characters" }, status: :unprocessable_entity
      end

      if params[:new_password] != params[:confirm_password]
        return render json: { error: "Passwords do not match" }, status: :unprocessable_entity
      end

      current_user.update!(password: params[:new_password])
      render json: { message: "Password updated successfully" }
    end

    private

    def profile_params
      params.permit(:name, :phone)
    end

    def profile_json(user)
      {
        id:         user.id,
        email:      user.email,
        name:       user.name,
        phone:      user.phone,
        role:       user.role,
        avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
      }
    end
  end
end
