migrate(
  (app) => {
    const airportsCol = app.findCollectionByNameOrId('airports')
    const airlinesCol = app.findCollectionByNameOrId('airlines')
    const flightsCol = app.findCollectionByNameOrId('flights')

    const airportsData = [
      { iata_code: 'GRU', city_name: 'São Paulo', country: 'Brazil' },
      { iata_code: 'GIG', city_name: 'Rio de Janeiro', country: 'Brazil' },
      { iata_code: 'BSB', city_name: 'Brasília', country: 'Brazil' },
      { iata_code: 'CNF', city_name: 'Belo Horizonte', country: 'Brazil' },
      { iata_code: 'VCP', city_name: 'Campinas', country: 'Brazil' },
      { iata_code: 'SDU', city_name: 'Rio de Janeiro', country: 'Brazil' },
      { iata_code: 'CGH', city_name: 'São Paulo', country: 'Brazil' },
      { iata_code: 'REC', city_name: 'Recife', country: 'Brazil' },
      { iata_code: 'POA', city_name: 'Porto Alegre', country: 'Brazil' },
      { iata_code: 'SSA', city_name: 'Salvador', country: 'Brazil' },
      { iata_code: 'FOR', city_name: 'Fortaleza', country: 'Brazil' },
      { iata_code: 'CWB', city_name: 'Curitiba', country: 'Brazil' },
      { iata_code: 'FLN', city_name: 'Florianópolis', country: 'Brazil' },
      { iata_code: 'BEL', city_name: 'Belém', country: 'Brazil' },
      { iata_code: 'JFK', city_name: 'New York', country: 'USA' },
      { iata_code: 'MIA', city_name: 'Miami', country: 'USA' },
      { iata_code: 'LHR', city_name: 'London', country: 'UK' },
      { iata_code: 'CDG', city_name: 'Paris', country: 'France' },
      { iata_code: 'FRA', city_name: 'Frankfurt', country: 'Germany' },
      { iata_code: 'EZE', city_name: 'Buenos Aires', country: 'Argentina' },
    ]

    const airportIds = {}

    for (const data of airportsData) {
      let record
      try {
        record = app.findFirstRecordByData('airports', 'iata_code', data.iata_code)
      } catch (_) {
        record = new Record(airportsCol)
        record.set('iata_code', data.iata_code)
        record.set('city_name', data.city_name)
        record.set('country', data.country)
        app.save(record)
      }
      airportIds[data.iata_code] = record.id
    }

    const airlinesData = [
      {
        name: 'LATAM',
        logo_url: 'https://img.usecurling.com/i?q=latam&color=red',
        miles_per_1k: 25,
      },
      {
        name: 'Gol',
        logo_url: 'https://img.usecurling.com/i?q=gol&color=orange',
        miles_per_1k: 20,
      },
      {
        name: 'Azul',
        logo_url: 'https://img.usecurling.com/i?q=azul&color=blue',
        miles_per_1k: 22,
      },
      {
        name: 'VOEPASS',
        logo_url: 'https://img.usecurling.com/i?q=voepass&color=yellow',
        miles_per_1k: 15,
      },
      {
        name: 'Avianca',
        logo_url: 'https://img.usecurling.com/i?q=avianca&color=red',
        miles_per_1k: 20,
      },
    ]

    const airlineIds = {}
    for (const data of airlinesData) {
      let record
      try {
        record = app.findFirstRecordByData('airlines', 'name', data.name)
      } catch (_) {
        record = new Record(airlinesCol)
        record.set('name', data.name)
        record.set('logo_url', data.logo_url)
        record.set('miles_per_1k', data.miles_per_1k)
        app.save(record)
      }
      airlineIds[data.name] = record.id
    }

    const now = new Date()
    const routes = [
      { o: 'GRU', d: 'GIG', minDur: 60, maxDur: 75, minPrice: 150, maxPrice: 600 },
      { o: 'GIG', d: 'GRU', minDur: 60, maxDur: 75, minPrice: 150, maxPrice: 600 },
      { o: 'GRU', d: 'BSB', minDur: 105, maxDur: 120, minPrice: 200, maxPrice: 800 },
      { o: 'BSB', d: 'GRU', minDur: 105, maxDur: 120, minPrice: 200, maxPrice: 800 },
      { o: 'GRU', d: 'JFK', minDur: 580, maxDur: 610, minPrice: 2500, maxPrice: 7000 },
      { o: 'JFK', d: 'GRU', minDur: 580, maxDur: 610, minPrice: 2500, maxPrice: 7000 },
      { o: 'GRU', d: 'LHR', minDur: 680, maxDur: 720, minPrice: 3500, maxPrice: 8000 },
      { o: 'LHR', d: 'GRU', minDur: 680, maxDur: 720, minPrice: 3500, maxPrice: 8000 },
      { o: 'GIG', d: 'MIA', minDur: 510, maxDur: 540, minPrice: 2000, maxPrice: 6000 },
      { o: 'MIA', d: 'GIG', minDur: 510, maxDur: 540, minPrice: 2000, maxPrice: 6000 },
    ]

    const airlineNames = ['LATAM', 'Gol', 'Azul', 'VOEPASS', 'Avianca']

    if (app.countRecords('flights') === 0) {
      for (let i = 0; i < 30; i++) {
        const route = routes[i % routes.length]
        const airlineName = airlineNames[i % airlineNames.length]

        const duration =
          Math.floor(Math.random() * (route.maxDur - route.minDur + 1)) + route.minDur
        const price =
          Math.floor(Math.random() * (route.maxPrice - route.minPrice + 1)) + route.minPrice

        const daysAhead = Math.floor(Math.random() * 30) + 1
        const hour = Math.floor(Math.random() * 24)
        const minute = Math.floor(Math.random() * 60)

        const depDate = new Date(now)
        depDate.setDate(now.getDate() + daysAhead)
        depDate.setHours(hour, minute, 0, 0)

        const arrDate = new Date(depDate)
        arrDate.setMinutes(arrDate.getMinutes() + duration)

        const record = new Record(flightsCol)
        record.set('airline_id', airlineIds[airlineName])
        record.set('origin_airport_id', airportIds[route.o])
        record.set('destination_airport_id', airportIds[route.d])

        record.set('departure_time', depDate.toISOString().replace('T', ' '))
        record.set('arrival_time', arrDate.toISOString().replace('T', ' '))

        record.set('duration_minutes', duration)
        record.set('price_brl', price)
        record.set('available_seats', Math.floor(Math.random() * 100) + 10)

        app.save(record)
      }
    }
  },
  (app) => {
    app.truncateCollection(app.findCollectionByNameOrId('flights'))
    app.truncateCollection(app.findCollectionByNameOrId('airlines'))
    app.truncateCollection(app.findCollectionByNameOrId('airports'))
  },
)
