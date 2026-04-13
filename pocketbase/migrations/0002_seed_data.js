migrate(
  (app) => {
    try {
      app.findFirstRecordByData('airports', 'code', 'BSB')
      return // already seeded
    } catch (_) {}

    const colAirports = app.findCollectionByNameOrId('airports')
    const colAirlines = app.findCollectionByNameOrId('airlines')
    const colFlights = app.findCollectionByNameOrId('flights')

    // Ensure stops is not required so 0 is accepted as a valid value
    colFlights.fields.add(new NumberField({ name: 'stops', required: false }))
    app.save(colFlights)

    // Seed Airports
    const airportsData = [
      { code: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília' },
      { code: 'VCP', name: 'Aeroporto Internacional de Viracopos', city: 'Campinas' },
      { code: 'GRU', name: 'Aeroporto Internacional de Guarulhos', city: 'São Paulo' },
      { code: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo' },
      { code: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro' },
      { code: 'GIG', name: 'Aeroporto Internacional do Galeão', city: 'Rio de Janeiro' },
    ]
    const airportIds = {}
    for (const a of airportsData) {
      const rec = new Record(colAirports)
      rec.set('code', a.code)
      rec.set('name', a.name)
      rec.set('city', a.city)
      app.save(rec)
      airportIds[a.code] = rec.id
    }

    // Seed Airlines
    const airlinesData = [
      {
        name: 'Azul',
        logo: 'https://img.usecurling.com/i?q=azul&color=blue&shape=fill',
        miles_rate_per_1k: 15,
      },
      {
        name: 'GOL',
        logo: 'https://img.usecurling.com/i?q=gol&color=orange&shape=fill',
        miles_rate_per_1k: 18,
      },
      {
        name: 'LATAM',
        logo: 'https://img.usecurling.com/i?q=latam&color=red&shape=fill',
        miles_rate_per_1k: 20,
      },
    ]
    const airlineIds = {}
    for (const a of airlinesData) {
      const rec = new Record(colAirlines)
      rec.set('name', a.name)
      rec.set('logo', a.logo)
      rec.set('miles_rate_per_1k', a.miles_rate_per_1k)
      app.save(rec)
      airlineIds[a.name] = rec.id
    }

    // Helper to generate dates relative to today
    const getFutureDate = (daysOffset, hour, minute) => {
      const d = new Date()
      d.setDate(d.getDate() + daysOffset)
      d.setHours(hour, minute, 0, 0)
      return d.toISOString()
    }

    // Seed Flights (BSB -> VCP mainly to match screenshot, plus some others)
    const flightsData = [
      {
        a: 'Azul',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 8,
        depM: 15,
        arrH: 9,
        arrM: 55,
        brl: 452,
        miles: 28000,
        stops: 0,
      },
      {
        a: 'Azul',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 6,
        depM: 0,
        arrH: 7,
        arrM: 35,
        brl: 510,
        miles: 35000,
        stops: 0,
      },
      {
        a: 'Azul',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 10,
        depM: 45,
        arrH: 12,
        arrM: 20,
        brl: 490,
        miles: 32000,
        stops: 0,
      },
      {
        a: 'GOL',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 10,
        depM: 0,
        arrH: 11,
        arrM: 45,
        brl: 488,
        miles: 25000,
        stops: 0,
      },
      {
        a: 'LATAM',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 14,
        depM: 0,
        arrH: 15,
        arrM: 40,
        brl: 545,
        miles: 30000,
        stops: 0,
      },
      {
        a: 'Azul',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 18,
        depM: 0,
        arrH: 21,
        arrM: 30,
        brl: 791,
        miles: 55000,
        stops: 1,
      },
      {
        a: 'LATAM',
        o: 'BSB',
        d: 'VCP',
        depDays: 5,
        depH: 19,
        depM: 0,
        arrH: 23,
        arrM: 15,
        brl: 1111,
        miles: 60000,
        stops: 1,
      },
      // Some return flights
      {
        a: 'Azul',
        o: 'VCP',
        d: 'BSB',
        depDays: 12,
        depH: 9,
        depM: 0,
        arrH: 10,
        arrM: 40,
        brl: 400,
        miles: 26000,
        stops: 0,
      },
      {
        a: 'GOL',
        o: 'VCP',
        d: 'BSB',
        depDays: 12,
        depH: 13,
        depM: 0,
        arrH: 14,
        arrM: 45,
        brl: 500,
        miles: 28000,
        stops: 0,
      },
      // Other random routes
      {
        a: 'GOL',
        o: 'GRU',
        d: 'SDU',
        depDays: 2,
        depH: 7,
        depM: 0,
        arrH: 8,
        arrM: 0,
        brl: 300,
        miles: 15000,
        stops: 0,
      },
      {
        a: 'LATAM',
        o: 'GRU',
        d: 'SDU',
        depDays: 2,
        depH: 8,
        depM: 0,
        arrH: 9,
        arrM: 0,
        brl: 350,
        miles: 18000,
        stops: 0,
      },
    ]

    for (const f of flightsData) {
      const rec = new Record(colFlights)
      rec.set('airline', airlineIds[f.a])
      rec.set('origin', airportIds[f.o])
      rec.set('destination', airportIds[f.d])
      rec.set('departure_time', getFutureDate(f.depDays, f.depH, f.depM))
      rec.set('arrival_time', getFutureDate(f.depDays, f.arrH, f.arrM))
      rec.set('price_brl', f.brl)
      rec.set('price_miles', f.miles)
      rec.set('stops', f.stops)
      app.save(rec)
    }
  },
  (app) => {
    // Simplistic down migration: clear these specific collections
    const collections = ['flights', 'airlines', 'airports']
    collections.forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.truncateCollection(col)
      } catch (_) {}
    })
  },
)
