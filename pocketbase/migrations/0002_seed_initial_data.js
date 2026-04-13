migrate(
  (app) => {
    if (!app.hasTable('airports') || !app.hasTable('airlines') || !app.hasTable('flights')) return

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'andriusgabriel@gmail.com')
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const record = new Record(users)
      record.setEmail('andriusgabriel@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    try {
      app.findFirstRecordByData('airports', 'iata_code', 'GRU')
      return // Data already seeded
    } catch (_) {}

    const colAirports = app.findCollectionByNameOrId('airports')
    const airportsData = [
      { code: 'GRU', city: 'São Paulo', country: 'Brasil' },
      { code: 'GIG', city: 'Rio de Janeiro', country: 'Brasil' },
      { code: 'BSB', city: 'Brasília', country: 'Brasil' },
      { code: 'CNF', city: 'Belo Horizonte', country: 'Brasil' },
      { code: 'VCP', city: 'Campinas', country: 'Brasil' },
      { code: 'SSA', city: 'Salvador', country: 'Brasil' },
      { code: 'REC', city: 'Recife', country: 'Brasil' },
      { code: 'POA', city: 'Porto Alegre', country: 'Brasil' },
      { code: 'CWB', city: 'Curitiba', country: 'Brasil' },
      { code: 'FOR', city: 'Fortaleza', country: 'Brasil' },
      { code: 'JFK', city: 'Nova Iorque', country: 'Estados Unidos' },
      { code: 'LHR', city: 'Londres', country: 'Reino Unido' },
      { code: 'CDG', city: 'Paris', country: 'França' },
      { code: 'AMS', city: 'Amsterdã', country: 'Holanda' },
      { code: 'MAD', city: 'Madri', country: 'Espanha' },
      { code: 'EZE', city: 'Buenos Aires', country: 'Argentina' },
      { code: 'SCL', city: 'Santiago', country: 'Chile' },
      { code: 'LIM', city: 'Lima', country: 'Peru' },
      { code: 'MEX', city: 'Cidade do México', country: 'México' },
      { code: 'MIA', city: 'Miami', country: 'Estados Unidos' },
    ]

    const airportIds = {}
    for (const a of airportsData) {
      const rec = new Record(colAirports)
      rec.set('iata_code', a.code)
      rec.set('city_name', a.city)
      rec.set('country', a.country)
      app.save(rec)
      airportIds[a.code] = rec.id
    }

    const colAirlines = app.findCollectionByNameOrId('airlines')
    const airlinesData = [
      {
        name: 'LATAM',
        logo: 'https://img.usecurling.com/i?q=latam&color=red&shape=fill',
        miles: 25.0,
      },
      {
        name: 'Gol',
        logo: 'https://img.usecurling.com/i?q=gol&color=orange&shape=fill',
        miles: 20.0,
      },
      {
        name: 'Azul',
        logo: 'https://img.usecurling.com/i?q=azul&color=blue&shape=fill',
        miles: 22.5,
      },
      {
        name: 'VOEPASS',
        logo: 'https://img.usecurling.com/i?q=plane&color=gray&shape=fill',
        miles: 18.0,
      },
      {
        name: 'Avianca',
        logo: 'https://img.usecurling.com/i?q=avianca&color=red&shape=fill',
        miles: 23.0,
      },
    ]

    const airlineIds = {}
    for (const a of airlinesData) {
      const rec = new Record(colAirlines)
      rec.set('name', a.name)
      rec.set('logo_url', a.logo)
      rec.set('miles_per_1k', a.miles)
      app.save(rec)
      airlineIds[a.name] = rec.id
    }

    const getFutureDate = (days, h, m, offsetMins = 0) => {
      const d = new Date()
      d.setDate(d.getDate() + days)
      d.setHours(h, m + offsetMins, 0, 0)
      return d.toISOString()
    }

    const colFlights = app.findCollectionByNameOrId('flights')
    const baseRoutes = [
      { o: 'GRU', d: 'GIG', dur: 60, brl: 350 },
      { o: 'GIG', d: 'GRU', dur: 60, brl: 350 },
      { o: 'BSB', d: 'GRU', dur: 105, brl: 450 },
      { o: 'GRU', d: 'BSB', dur: 105, brl: 450 },
      { o: 'GRU', d: 'JFK', dur: 580, brl: 3500 },
      { o: 'JFK', d: 'GRU', dur: 580, brl: 3500 },
      { o: 'GRU', d: 'LHR', dur: 680, brl: 4500 },
      { o: 'GIG', d: 'MIA', dur: 510, brl: 2800 },
      { o: 'MIA', d: 'GIG', dur: 510, brl: 2800 },
      { o: 'GRU', d: 'EZE', dur: 175, brl: 1200 },
      { o: 'EZE', d: 'GRU', dur: 175, brl: 1200 },
      { o: 'GRU', d: 'SCL', dur: 245, brl: 1400 },
      { o: 'CNF', d: 'SSA', dur: 110, brl: 500 },
      { o: 'SSA', d: 'REC', dur: 85, brl: 350 },
      { o: 'VCP', d: 'POA', dur: 105, brl: 400 },
      { o: 'POA', d: 'CWB', dur: 70, brl: 280 },
      { o: 'CWB', d: 'GRU', dur: 65, brl: 250 },
      { o: 'FOR', d: 'GRU', dur: 210, brl: 850 },
      { o: 'GRU', d: 'CDG', dur: 690, brl: 4800 },
      { o: 'CDG', d: 'GRU', dur: 690, brl: 4800 },
      { o: 'GRU', d: 'AMS', dur: 700, brl: 4900 },
      { o: 'GRU', d: 'MAD', dur: 630, brl: 4200 },
      { o: 'LIM', d: 'GRU', dur: 285, brl: 1800 },
      { o: 'MEX', d: 'GRU', dur: 530, brl: 3100 },
      { o: 'GIG', d: 'EZE', dur: 195, brl: 1300 },
      { o: 'BSB', d: 'MIA', dur: 480, brl: 2600 },
      { o: 'VCP', d: 'MAD', dur: 610, brl: 3900 },
      { o: 'SSA', d: 'GIG', dur: 125, brl: 550 },
      { o: 'REC', d: 'FOR', dur: 80, brl: 320 },
      { o: 'POA', d: 'EZE', dur: 115, brl: 800 },
    ]

    const airlinesKeys = Object.keys(airlineIds)

    for (let i = 0; i < 30; i++) {
      const route = baseRoutes[i % baseRoutes.length]
      const airline = airlinesKeys[i % airlinesKeys.length]

      const depDays = (i % 14) + 1
      const depH = 6 + (i % 16)
      const depM = (i % 4) * 15

      const rec = new Record(colFlights)
      rec.set('airline_id', airlineIds[airline])
      rec.set('origin_airport_id', airportIds[route.o])
      rec.set('destination_airport_id', airportIds[route.d])
      rec.set('departure_time', getFutureDate(depDays, depH, depM))
      rec.set('arrival_time', getFutureDate(depDays, depH, depM, route.dur))
      rec.set('duration_minutes', route.dur)
      rec.set('price_brl', route.brl + i * 10)
      rec.set('available_seats', 20 + ((i * 5) % 150))
      app.save(rec)
    }
  },
  (app) => {
    ;['flights', 'airlines', 'airports'].forEach((name) => {
      try {
        app.truncateCollection(app.findCollectionByNameOrId(name))
      } catch (_) {}
    })
    try {
      app.delete(app.findAuthRecordByEmail('_pb_users_auth_', 'andriusgabriel@gmail.com'))
    } catch (_) {}
  },
)
