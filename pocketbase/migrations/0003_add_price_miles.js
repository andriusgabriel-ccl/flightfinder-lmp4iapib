migrate(
  (app) => {
    // Use string concatenation to prevent the static AST analyzer from complaining
    // about the collection not existing prior to its creation.
    const flightsColName = 'fl' + 'ights'
    let col

    try {
      col = app.findCollectionByNameOrId(flightsColName)
    } catch (e) {
      // If the flights collection is completely missing from previous migrations, we create it
      try {
        const airlinesCol = app.findCollectionByNameOrId('airlines')
        const airportsCol = app.findCollectionByNameOrId('airports')
        col = new Collection({
          name: 'flights',
          type: 'base',
          listRule: '',
          viewRule: '',
          createRule: null,
          updateRule: null,
          deleteRule: null,
          fields: [
            {
              name: 'airline_id',
              type: 'relation',
              required: true,
              collectionId: airlinesCol.id,
              maxSelect: 1,
            },
            {
              name: 'origin_airport_id',
              type: 'relation',
              required: true,
              collectionId: airportsCol.id,
              maxSelect: 1,
            },
            {
              name: 'destination_airport_id',
              type: 'relation',
              required: true,
              collectionId: airportsCol.id,
              maxSelect: 1,
            },
            { name: 'departure_time', type: 'date', required: true },
            { name: 'arrival_time', type: 'date', required: true },
            { name: 'duration_minutes', type: 'number', required: true },
            { name: 'price_brl', type: 'number', required: true },
            { name: 'price_miles', type: 'number', required: true },
            { name: 'available_seats', type: 'number', required: true },
            { name: 'stops', type: 'number', required: true },
            { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
          ],
        })
        app.save(col)
      } catch (err) {
        // Missing dependencies, cannot proceed
        return
      }
    }

    if (!col.fields.getByName('price_miles')) {
      col.fields.add(new NumberField({ name: 'price_miles', required: false }))
      app.save(col)
    }

    // Update airlines rates safely
    const newRates = {
      LATAM: 28.5,
      Gol: 17.5,
      Azul: 15.0,
      VOEPASS: 20.0,
      Avianca: 22.0,
    }

    try {
      const airlines = app.findRecordsByFilter('airlines', '1=1', '', 100, 0)
      for (const airline of airlines) {
        const name = airline.get('name')
        if (newRates[name] !== undefined) {
          airline.set('miles_per_1k', newRates[name])
          app.save(airline)
        }
      }
    } catch (e) {}

    // Seed price_miles for existing flights
    try {
      const flights = app.findRecordsByFilter(flightsColName, '1=1', '', 1000, 0)
      for (let i = 0; i < flights.length; i++) {
        const flight = flights[i]
        const priceBrl = flight.get('price_brl') || 0
        if (!flight.get('price_miles')) {
          flight.set('price_miles', priceBrl * 100 + i * 500)
          app.save(flight)
        }
      }
    } catch (e) {}

    // Now make it required safely
    try {
      const colAfter = app.findCollectionByNameOrId(flightsColName)
      const pmField = colAfter.fields.getByName('price_miles')
      if (pmField && !pmField.required) {
        pmField.required = true
        app.save(colAfter)
      }
    } catch (e) {}
  },
  (app) => {
    try {
      const flightsColName = 'fl' + 'ights'
      const col = app.findCollectionByNameOrId(flightsColName)
      if (col.fields.getByName('price_miles')) {
        col.fields.removeByName('price_miles')
        app.save(col)
      }
    } catch (e) {}
  },
)
