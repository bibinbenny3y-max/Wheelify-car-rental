module Api
  class VehiclesController < BaseController
    # Public routes — no auth required for browsing
    skip_before_action :authenticate_user!, only: [:index, :show]
    before_action :try_authenticate_user,   only: [:index, :show]

    before_action :set_vehicle,           only: [:show, :update, :destroy, :approve, :reject]
    before_action :authorize_owner!,      only: [:update, :destroy]
    before_action :authorize_admin!,      only: [:approve, :reject]

    # GET /api/vehicles
    # Supports:
    #   ?all=true   → admin only, returns all vehicles regardless of status
    #   ?mine=true  → authenticated owner, returns only their own vehicles
    def index
      vehicles = if params[:all].present? && current_user&.admin?
                   Vehicle.all
                 elsif params[:mine].present? && current_user
                   current_user.vehicles
                 else
                   Vehicle.approved
                 end

      vehicles = vehicles.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
      vehicles = vehicles.where(location: params[:location])            if params[:location].present?
      vehicles = vehicles.where("rate <= ?", params[:max_price])        if params[:max_price].present?
      vehicles = vehicles.where(vehicle_type: params[:type])            if params[:type].present?

      render json: vehicles.map { |v| vehicle_json(v) }
    end

    # GET /api/vehicles/:id
    def show
      render json: vehicle_json(@vehicle, include_bookings: true)
    end

    # POST /api/vehicles
    def create
      unless current_user.owner?
        return render json: { error: "Only owners can list vehicles" }, status: :forbidden
      end

      vehicle = current_user.vehicles.build(vehicle_params)
      vehicle.status = "pending"

      if vehicle.save
        # Attach images if provided
        if params[:images].present?
          params[:images].each { |img| vehicle.images.attach(img) }
        end
        render json: vehicle_json(vehicle), status: :created
      else
        render json: { errors: vehicle.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PUT /api/vehicles/:id
    def update
      if @vehicle.update(vehicle_params)
        if params[:images].present?
          @vehicle.images.purge
          params[:images].each { |img| @vehicle.images.attach(img) }
        end
        render json: vehicle_json(@vehicle)
      else
        render json: { errors: @vehicle.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/vehicles/:id
    def destroy
      @vehicle.destroy
      render json: { message: "Vehicle deleted" }
    end

    # PUT /api/vehicles/:id/approve
    def approve
      @vehicle.approve!
      render json: { message: "Vehicle approved", vehicle: vehicle_json(@vehicle) }
    end

    # PUT /api/vehicles/:id/reject
    def reject
      @vehicle.reject!
      render json: { message: "Vehicle rejected", vehicle: vehicle_json(@vehicle) }
    end

    private

    def set_vehicle
      @vehicle = Vehicle.find(params[:id])
    end

    # Owner can only modify their own vehicles
    def authorize_owner!
      unless @vehicle.owner == current_user || current_user.admin?
        render json: { error: "Forbidden" }, status: :forbidden
      end
    end

    def vehicle_params
      params.permit(:name, :vehicle_type, :model, :location, :rate, :description)
    end

    VEHICLE_IMAGES = {
      "BMW M4"          => "/images/vehicles/BMW-M4.png",
      "BMW i4"          => "/images/vehicles/BMW-i4.png",
      "G-Wagon"         => "/images/vehicles/G-WAGON.png",
      "Mustang GT"      => "/images/vehicles/MUSTANG GT.png",
      "Porsche 911"     => "/images/vehicles/PORSCHE-911.png",
      "Tesla Model 3"   => "/images/vehicles/TESLA-MODEL3.png",
      "Kawasaki Ninja"  => "/images/vehicles/KAWASAKI-NINJA.png",
      "Harley Davidson" => "/images/vehicles/HARLEY-DAVIDSON.png",
      "Classic 350"     => "/images/vehicles/CLASSIC-350.png",
      "Hunter 350"      => "/images/vehicles/Hunter-350.png",
      "Jawa Bobber"     => "/images/vehicles/JAWA-BOBBER.png",
    }.freeze

    def vehicle_image(vehicle)
      return url_for(vehicle.images.first) if vehicle.images.attached?

      VEHICLE_IMAGES[vehicle.name] ||
        (vehicle.vehicle_type == "Bike" ? "/images/vehicles/KAWASAKI-NINJA.png" : "/images/vehicles/BMW-M4.png")
    end

    def vehicle_json(vehicle, include_bookings: false)
      data = {
        id:           vehicle.id,
        name:         vehicle.name,
        vehicle_type: vehicle.vehicle_type,
        model:        vehicle.model,
        location:     vehicle.location,
        rate:         vehicle.rate,
        description:  vehicle.description,
        status:       vehicle.status,
        owner_id:     vehicle.owner_id,
        image_url:    vehicle_image(vehicle),
        created_at:   vehicle.created_at
      }

      if include_bookings
        data[:bookings] = vehicle.bookings.confirmed.map do |b|
          { id: b.id, start_date: b.start_date, end_date: b.end_date }
        end
      end

      data
    end
  end
end
