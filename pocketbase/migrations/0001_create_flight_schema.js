migrate(
  (app) => {
    const airports = new Collection({
      name: 'airports',
      type: 'base',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'iata_code', type: 'text', required: true },
        { name: 'city_name', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_airports_iata ON airports (iata_code)'],
    })
    app.save(airports)

    const airlines = new Collection({
      name: 'airlines',
      type: 'base',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo_url', type: 'url' },
        { name: 'miles_per_1k', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(airlines)

    const flights = new Collection({
      name: 'flights',
      type: 'base',
      listRule: '',
      viewRule: '',
      fields: [
        {
          name: 'airline_id',
          type: 'relation',
          required: true,
          collectionId: airlines.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'origin_airport_id',
          type: 'relation',
          required: true,
          collectionId: airports.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'destination_airport_id',
          type: 'relation',
          required: true,
          collectionId: airports.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'departure_time', type: 'date', required: true },
        { name: 'arrival_time', type: 'date', required: true },
        { name: 'duration_minutes', type: 'number', required: true },
        { name: 'price_brl', type: 'number', required: true },
        { name: 'available_seats', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_flights_airline ON flights (airline_id)',
        'CREATE INDEX idx_flights_origin ON flights (origin_airport_id)',
        'CREATE INDEX idx_flights_destination ON flights (destination_airport_id)',
      ],
    })
    app.save(flights)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('flights'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('airlines'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('airports'))
    } catch (_) {}
  },
)
