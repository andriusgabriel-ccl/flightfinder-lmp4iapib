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
  return pb.collection('airports').getFullList({ sort: 'city_name' })
}

export const getAirlines = async (): Promise<Airline[]> => {
  return pb.collection('airlines').getFullList({ sort: 'name' })
}

export const searchFlights = async (
  originCode: string,
  destinationCode: string,
  _departureDate?: string,
): Promise<Flight[]> => {
  const filter = `origin_airport_id.iata_code = "${originCode}" && destination_airport_id.iata_code = "${destinationCode}"`
  return pb.collection('flights').getFullList({
    filter,
    expand: 'airline_id,origin_airport_id,destination_airport_id',
    sort: 'price_brl',
  })
}
