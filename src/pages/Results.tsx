import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Flight, searchFlights } from '@/services/api'
import { SearchForm } from '@/components/SearchForm'
import { FlightCard } from '@/components/FlightCard'
import { PriceTabs } from '@/components/PriceTabs'
import { useRealtime } from '@/hooks/use-realtime'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plane } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const Results = () => {
  const [searchParams] = useSearchParams()
  const originCode = searchParams.get('origin') || 'BSB'
  const destCode = searchParams.get('destination') || 'VCP'
  const date = searchParams.get('date')
  const passengers = parseInt(searchParams.get('passengers') || '1', 10)

  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [stopsFilter, setStopsFilter] = useState<number[]>([])
  const [airlinesFilter, setAirlinesFilter] = useState<string[]>([])

  const fetchFlights = async () => {
    setLoading(true)
    try {
      const data = await searchFlights(originCode, destCode, date || undefined)
      setFlights(data)
    } catch (e) {
      console.error('Error fetching flights:', e)
    } finally {
      setTimeout(() => setLoading(false), 600) // Artificial delay for smoother UI transition
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
      if (f.expand?.airline.name) set.add(f.expand.airline.name)
    })
    return Array.from(set)
  }, [flights])

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      const matchStops = stopsFilter.length === 0 || stopsFilter.includes(f.stops > 1 ? 2 : f.stops)
      const matchAirline =
        airlinesFilter.length === 0 || airlinesFilter.includes(f.expand?.airline.name || '')
      return matchStops && matchAirline
    })
  }, [flights, stopsFilter, airlinesFilter])

  const toggleStop = (stopType: number) => {
    setStopsFilter((prev) =>
      prev.includes(stopType) ? prev.filter((s) => s !== stopType) : [...prev, stopType],
    )
  }

  const toggleAirline = (airlineName: string) => {
    setAirlinesFilter((prev) =>
      prev.includes(airlineName) ? prev.filter((a) => a !== airlineName) : [...prev, airlineName],
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
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
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Paradas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stop-all"
                  checked={stopsFilter.length === 0}
                  onCheckedChange={() => setStopsFilter([])}
                />
                <Label htmlFor="stop-all" className="flex-1 cursor-pointer">
                  Todas as paradas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stop-0"
                  checked={stopsFilter.includes(0)}
                  onCheckedChange={() => toggleStop(0)}
                />
                <Label htmlFor="stop-0" className="flex-1 cursor-pointer text-slate-600">
                  Direto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stop-1"
                  checked={stopsFilter.includes(1)}
                  onCheckedChange={() => toggleStop(1)}
                />
                <Label htmlFor="stop-1" className="flex-1 cursor-pointer text-slate-600">
                  1 Parada
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stop-2"
                  checked={stopsFilter.includes(2)}
                  onCheckedChange={() => toggleStop(2)}
                />
                <Label htmlFor="stop-2" className="flex-1 cursor-pointer text-slate-600">
                  2+ Paradas
                </Label>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            <h3 className="font-bold text-slate-800 mb-4">Companhias</h3>
            <div className="space-y-3">
              {availableAirlines.map((airlineName) => (
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
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col">
          {!loading && flights.length > 0 && (
            <div className="animate-fade-in">
              <PriceTabs flights={flights} />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {loading ? (
              // Loading Skeletons
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
                  onClick={() => {
                    setStopsFilter([])
                    setAirlinesFilter([])
                  }}
                  className="text-[#0066CC] font-semibold hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
