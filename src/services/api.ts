import pb from '@/lib/pocketbase/client'

export interface Airport {
  id: string
  code: string
  name: string
  city: string
}

export interface Airline {
  id: string
  name: string
  logo: string
  miles_rate_per_1k: number
}

export interface Flight {
  id: string
  airline: string
  origin: string
  destination: string
  departure_time: string
  arrival_time: string
  price_brl: number
  price_miles: number
  stops: number
  expand?: {
    airline: Airline
    origin: Airport
    destination: Airport
  }
}

export const getAirports = async (): Promise<Airport[]> => {
  return pb.collection('airports').getFullList({ sort: 'city' })
}

export const getAirlines = async (): Promise<Airline[]> => {
  return pb.collection('airlines').getFullList({ sort: 'name' })
}

export const searchFlights = async (
  originCode: string,
  destinationCode: string,
  _departureDate?: string, // Simplified: Ignoring strict date matching for better mock data yield
): Promise<Flight[]> => {
  const filter = `origin.code = "${originCode}" && destination.code = "${destinationCode}"`
  return pb.collection('flights').getFullList({
    filter,
    expand: 'airline,origin,destination',
    sort: 'price_brl',
  })
}
