migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('flights')

    if (!col.fields.getByName('price_miles')) {
      col.fields.add(new NumberField({ name: 'price_miles', required: false }))
      app.save(col)
    }

    // Update airlines rates
    const newRates = {
      LATAM: 28.5,
      Gol: 17.5,
      Azul: 15.0,
      VOEPASS: 20.0,
      Avianca: 22.0,
    }

    const airlines = app.findRecordsByFilter('airlines', '1=1', '', 100, 0)
    for (const airline of airlines) {
      const name = airline.get('name')
      if (newRates[name] !== undefined) {
        airline.set('miles_per_1k', newRates[name])
        app.save(airline)
      }
    }

    // Seed price_miles for existing flights
    const flights = app.findRecordsByFilter('flights', '1=1', '', 1000, 0)
    for (let i = 0; i < flights.length; i++) {
      const flight = flights[i]
      const priceBrl = flight.get('price_brl') || 0
      // Generate a somewhat realistic miles value for the flight
      flight.set('price_miles', priceBrl * 100 + i * 500)
      app.save(flight)
    }

    // Now make it required safely
    const colAfter = app.findCollectionByNameOrId('flights')
    const pmField = colAfter.fields.getByName('price_miles')
    if (pmField) {
      pmField.required = true
      app.save(colAfter)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('flights')
    if (col.fields.getByName('price_miles')) {
      col.fields.removeByName('price_miles')
      app.save(col)
    }
  },
)
