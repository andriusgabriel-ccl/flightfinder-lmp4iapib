import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flight, searchFlights } from '@/services/api'
import { SearchForm } from '@/components/SearchForm'
import { FlightCard } from '@/components/FlightCard'
import { useRealtime } from '@/hooks/use-realtime'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plane } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Results = () => {
  const [searchParams] = useSearchParams()
  const originCode = searchParams.get('origin') || 'GRU'
  const destCode = searchParams.get('destination') || 'GIG'
  const date = searchParams.get('date')
  const passengers = parseInt(searchParams.get('passengers') || '1', 10)

  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [airlinesFilter, setAirlinesFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('price_asc')

  const fetchFlights = async () => {
    setLoading(true)
    try {
      const data = await searchFlights(originCode, destCode, date || undefined)
      setFlights(data)
    } catch (e) {
      console.error('Error fetching flights:', e)
    } finally {
      setTimeout(() => setLoading(false), 600)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [originCode, destCode, date])

  useRealtime('flights', () => {
    fetchFlights()
  })

  const availableAirlines = useMemo(() => {
    const set = new Set<string>()
    flights.forEach((f) => {
      if (f.expand?.airline_id?.name) set.add(f.expand.airline_id.name)
    })
    return Array.from(set)
  }, [flights])

  const filteredFlights = useMemo(() => {
    const filtered = flights.filter((f) => {
      const matchAirline =
        airlinesFilter.length === 0 || airlinesFilter.includes(f.expand?.airline_id?.name || '')
      return matchAirline
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price_brl - b.price_brl
        case 'miles_asc':
          return a.price_miles - b.price_miles
        case 'duration_asc':
          return a.duration_minutes - b.duration_minutes
        case 'airline_asc':
          return (a.expand?.airline_id?.name || '').localeCompare(b.expand?.airline_id?.name || '')
        default:
          return 0
      }
    })
  }, [flights, airlinesFilter, sortBy])

  const toggleAirline = (airlineName: string) => {
    setAirlinesFilter((prev) =>
      prev.includes(airlineName) ? prev.filter((a) => a !== airlineName) : [...prev, airlineName],
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#1A0B2E] mb-4">Sua busca</h2>
            <SearchForm
              layout="vertical"
              initialOrigin={originCode}
              initialDestination={destCode}
              initialDate={date || undefined}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Companhias Aéreas</h3>
            <div className="space-y-3">
              {availableAirlines.length > 0 ? (
                availableAirlines.map((airlineName) => (
                  <div key={airlineName} className="flex items-center space-x-2">
                    <Checkbox
                      id={`air-${airlineName}`}
                      checked={airlinesFilter.includes(airlineName)}
                      onCheckedChange={() => toggleAirline(airlineName)}
                    />
                    <Label
                      htmlFor={`air-${airlineName}`}
                      className="flex-1 cursor-pointer text-slate-600"
                    >
                      {airlineName}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Nenhuma companhia disponível</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Ordenar por</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Preço (Menor primeiro)</SelectItem>
                <SelectItem value="miles_asc">Milhas (Menor primeiro)</SelectItem>
                <SelectItem value="duration_asc">Duração (Menor primeiro)</SelectItem>
                <SelectItem value="airline_asc">Companhia Aérea (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        <div className="lg:col-span-9 flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 flex gap-6 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-16" />
                  </div>
                </div>
                <div className="w-64 border-l pl-6 flex flex-col justify-center gap-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </div>
            ))
          ) : filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} className="animate-fade-in-up">
                <FlightCard flight={flight} passengers={passengers} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center animate-fade-in">
              <Plane className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum voo encontrado</h3>
              <p className="text-slate-500 mb-6">
                Não encontramos opções para os filtros selecionados.
              </p>
              <button
                onClick={() => setAirlinesFilter([])}
                className="text-[#0066CC] font-semibold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Results
