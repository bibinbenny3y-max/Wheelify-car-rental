module Api
  module Admin
    class UsersController < Api::BaseController
      before_action :authorize_admin!

      # GET /api/admin/users
      def index
        users = User.all.order(created_at: :desc)
        render json: users.map { |u|
          {
            id:         u.id,
            email:      u.email,
            name:       u.name,
            role:       u.role,
            created_at: u.created_at
          }
        }
      end

      # DELETE /api/admin/users/:id
      def destroy
        user = User.find(params[:id])

        if user == current_user
          return render json: { error: "Cannot delete your own account" }, status: :unprocessable_entity
        end

        user.destroy
        render json: { message: "User deleted" }
      end
    end
  end
end
