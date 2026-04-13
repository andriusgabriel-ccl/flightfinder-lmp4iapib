import pb from '@/lib/pocketbase/client'

export interface Airport {
  id: string
  iata_code: string
  city_name: string
  country: string
}

export interface Airline {
  id: string
  name: string
  logo_url: string
  miles_per_1k: number
}

export interface Flight {
  id: string
  airline_id: string
  origin_airport_id: string
  destination_airport_id: string
  departure_time: string
  arrival_time: string
  duration_minutes: number
  price_brl: number
  price_miles: number
  available_seats: number
  stops: number
  expand?: {
    airline_id: Airline
    origin_airport_id: Airport
    destination_airport_id: Airport
  }
}

export const getAirports = async (): Promise<Airport[]> => {
  try {
    return await pb.collection('airports').getFullList({ sort: 'city_name' })
  } catch (e) {
    console.error('Failed to get airports:', e)
    return []
  }
}

export const getAirlines = async (): Promise<Airline[]> => {
  try {
    return await pb.collection('airlines').getFullList({ sort: 'name' })
  } catch (e) {
    console.error('Failed to get airlines:', e)
    return []
  }
}

export const searchFlights = async (
  originCode: string,
  destinationCode: string,
  departureDate?: string,
): Promise<Flight[]> => {
  // Use mock data as per acceptance criteria (without querying the database initially)
  const MOCK_AIRLINES: Airline[] = [
    {
      id: 'a1',
      name: 'LATAM',
      logo_url: 'https://img.usecurling.com/i?q=airline&color=red',
      miles_per_1k: 28,
    },
    {
      id: 'a2',
      name: 'Gol',
      logo_url: 'https://img.usecurling.com/i?q=airline&color=orange',
      miles_per_1k: 30,
    },
    {
      id: 'a3',
      name: 'Azul',
      logo_url: 'https://img.usecurling.com/i?q=airline&color=blue',
      miles_per_1k: 25,
    },
    {
      id: 'a4',
      name: 'VOEPASS',
      logo_url: 'https://img.usecurling.com/i?q=airline&color=yellow',
      miles_per_1k: 20,
    },
    {
      id: 'a5',
      name: 'Avianca',
      logo_url: 'https://img.usecurling.com/i?q=airline&color=red',
      miles_per_1k: 35,
    },
  ]

  const origin: Airport = {
    id: 'ap_org',
    iata_code: originCode,
    city_name: 'Origem',
    country: 'BR',
  }
  const dest: Airport = {
    id: 'ap_dst',
    iata_code: destinationCode,
    city_name: 'Destino',
    country: 'BR',
  }

  const baseDate = departureDate ? new Date(departureDate + 'T00:00:00') : new Date()

  const mockFlights: Flight[] = Array.from({ length: 10 }).map((_, i) => {
    const airline = MOCK_AIRLINES[i % MOCK_AIRLINES.length]

    const depTime = new Date(baseDate)
    depTime.setHours(6 + i, (i * 15) % 60, 0)

    const durationMinutes = 90 + i * 20
    const arrTime = new Date(depTime)
    arrTime.setMinutes(arrTime.getMinutes() + durationMinutes)

    return {
      id: `f_mock_${i}`,
      airline_id: airline.id,
      origin_airport_id: origin.id,
      destination_airport_id: dest.id,
      departure_time: depTime.toISOString(),
      arrival_time: arrTime.toISOString(),
      duration_minutes: durationMinutes,
      price_brl: 300 + i * 45 - (i % 2 === 0 ? 20 : 0),
      price_miles: 10000 + i * 1200 + (i % 3 === 0 ? 500 : 0),
      available_seats: 10 + i,
      stops: i % 4 === 0 ? 1 : 0,
      expand: {
        airline_id: airline,
        origin_airport_id: origin,
        destination_airport_id: dest,
      },
    }
  })

  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(mockFlights), 600))
}
