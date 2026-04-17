renames = {
  'Audi Q5'          => { name: 'Audi R8',        vehicle_type: 'Car',  model: '2023' },
  'Volkswagen Golf'  => { name: 'Mustang GT',      vehicle_type: 'Car',  model: '2022' },
  'Yamaha MT-07'     => { name: 'Audi A3',         vehicle_type: 'Car',  model: '2023' },
  'Mercedes C-Class' => { name: 'Porsche 911',     vehicle_type: 'Car',  model: '2022' },
  'Kawasaki Z650'    => { name: 'R15',             vehicle_type: 'Bike', model: '2023' },
  'Honda CB500F'     => { name: 'KTM RC 390',      vehicle_type: 'Bike', model: '2023' },
  'Ford Fiesta'      => { name: 'Volkswagen Polo', vehicle_type: 'Car',  model: '2023' },
}

renames.each do |old_name, attrs|
  v = Vehicle.find_by(name: old_name)
  if v
    v.update!(attrs)
    STDOUT.puts "Updated: #{old_name} -> #{attrs[:name]}"
  else
    STDOUT.puts "Not found: #{old_name}"
  end
  STDOUT.flush
end

STDOUT.puts "\nFinal vehicle list:"
Vehicle.order(:id).each { |v| STDOUT.puts "  #{v.name} (#{v.vehicle_type}) #{v.model}" }
STDOUT.flush
