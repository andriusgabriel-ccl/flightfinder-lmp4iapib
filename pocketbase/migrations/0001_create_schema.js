migrate(
  (app) => {
    // Airports
    const airports = new Collection({
      name: 'airports',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(airports)

    // Airlines
    const airlines = new Collection({
      name: 'airlines',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'url', required: true },
        { name: 'miles_rate_per_1k', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(airlines)

    const airportsId = app.findCollectionByNameOrId('airports').id
    const airlinesId = app.findCollectionByNameOrId('airlines').id

    // Flights
    const flights = new Collection({
      name: 'flights',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'airline',
          type: 'relation',
          required: true,
          collectionId: airlinesId,
          maxSelect: 1,
        },
        {
          name: 'origin',
          type: 'relation',
          required: true,
          collectionId: airportsId,
          maxSelect: 1,
        },
        {
          name: 'destination',
          type: 'relation',
          required: true,
          collectionId: airportsId,
          maxSelect: 1,
        },
        { name: 'departure_time', type: 'date', required: true },
        { name: 'arrival_time', type: 'date', required: true },
        { name: 'price_brl', type: 'number', required: true },
        { name: 'price_miles', type: 'number', required: true },
        { name: 'stops', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
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
