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
      { code: 'CGH', city: 'São Paulo', country: 'Brasil' },
      { code: 'BSB', city: 'Brasília', country: 'Brasil' },
      { code: 'CNF', city: 'Belo Horizonte', country: 'Brasil' },
      { code: 'VCP', city: 'Campinas', country: 'Brasil' },
      { code: 'SDU', city: 'Rio de Janeiro', country: 'Brasil' },
      { code: 'POA', city: 'Porto Alegre', country: 'Brasil' },
      { code: 'SSA', city: 'Salvador', country: 'Brasil' },
      { code: 'REC', city: 'Recife', country: 'Brasil' },
      { code: 'CWB', city: 'Curitiba', country: 'Brasil' },
      { code: 'FOR', city: 'Fortaleza', country: 'Brasil' },
      { code: 'FLN', city: 'Florianópolis', country: 'Brasil' },
      { code: 'BEL', city: 'Belém', country: 'Brasil' },
      { code: 'VIX', city: 'Vitória', country: 'Brasil' },
      { code: 'GYN', city: 'Goiânia', country: 'Brasil' },
      { code: 'MAO', city: 'Manaus', country: 'Brasil' },
      { code: 'NAT', city: 'Natal', country: 'Brasil' },
      { code: 'MCZ', city: 'Maceió', country: 'Brasil' },
      { code: 'LHR', city: 'Londres', country: 'Reino Unido' },
      { code: 'JFK', city: 'Nova Iorque', country: 'Estados Unidos' },
      { code: 'CDG', city: 'Paris', country: 'França' },
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
        name: 'Latam',
        logo: 'https://img.usecurling.com/i?q=latam&color=red&shape=fill',
        miles: 20.0,
      },
      {
        name: 'Gol',
        logo: 'https://img.usecurling.com/i?q=gol&color=orange&shape=fill',
        miles: 17.5,
      },
      {
        name: 'Azul',
        logo: 'https://img.usecurling.com/i?q=azul&color=blue&shape=fill',
        miles: 15.0,
      },
      {
        name: 'TAP',
        logo: 'https://img.usecurling.com/i?q=tap&color=green&shape=fill',
        miles: 25.0,
      },
      {
        name: 'Emirates',
        logo: 'https://img.usecurling.com/i?q=emirates&color=red&shape=fill',
        miles: 30.0,
      },
      {
        name: 'Qatar',
        logo: 'https://img.usecurling.com/i?q=qatar&color=purple&shape=fill',
        miles: 28.0,
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

    const getFutureDate = (days, h, m) => {
      const d = new Date()
      d.setDate(d.getDate() + days)
      d.setHours(h, m, 0, 0)
      return d.toISOString()
    }

    const colFlights = app.findCollectionByNameOrId('flights')
    const flightsData = [
      {
        a: 'Azul',
        o: 'GRU',
        d: 'GIG',
        depDays: 5,
        depH: 8,
        depM: 15,
        arrH: 9,
        arrM: 15,
        dur: 60,
        brl: 350,
        miles: 18000,
        seats: 120,
      },
      {
        a: 'Gol',
        o: 'GRU',
        d: 'GIG',
        depDays: 5,
        depH: 10,
        depM: 0,
        arrH: 11,
        arrM: 0,
        dur: 60,
        brl: 280,
        miles: 15000,
        seats: 50,
      },
      {
        a: 'Latam',
        o: 'GRU',
        d: 'GIG',
        depDays: 5,
        depH: 14,
        depM: 0,
        arrH: 15,
        arrM: 5,
        dur: 65,
        brl: 310,
        miles: 16000,
        seats: 20,
      },
      {
        a: 'Azul',
        o: 'GIG',
        d: 'GRU',
        depDays: 12,
        depH: 9,
        depM: 0,
        arrH: 10,
        arrM: 0,
        dur: 60,
        brl: 400,
        miles: 26000,
        seats: 100,
      },
      {
        a: 'Gol',
        o: 'BSB',
        d: 'SDU',
        depDays: 2,
        depH: 7,
        depM: 0,
        arrH: 8,
        arrM: 40,
        dur: 100,
        brl: 500,
        miles: 25000,
        seats: 80,
      },
    ]

    for (const f of flightsData) {
      const rec = new Record(colFlights)
      rec.set('airline_id', airlineIds[f.a])
      rec.set('origin_airport_id', airportIds[f.o])
      rec.set('destination_airport_id', airportIds[f.d])
      rec.set('departure_time', getFutureDate(f.depDays, f.depH, f.depM))
      rec.set('arrival_time', getFutureDate(f.depDays, f.arrH, f.arrM))
      rec.set('duration_minutes', f.dur)
      rec.set('price_brl', f.brl)
      rec.set('price_miles', f.miles)
      rec.set('available_seats', f.seats)
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
