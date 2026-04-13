import { Flight } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from './ui/button'

interface FlightCardProps {
  flight: Flight
  passengers: number
}

export function FlightCard({ flight, passengers }: FlightCardProps) {
  const airline = flight.expand?.airline_id
  const origin = flight.expand?.origin_airport_id
  const dest = flight.expand?.destination_airport_id

  if (!airline || !origin || !dest) return null

  const totalCash = flight.price_brl * passengers
  const totalMiles = flight.price_miles * passengers
  const milesCashEquivalent = (totalMiles / 1000) * airline.miles_per_1k

  const isMilesBetter = milesCashEquivalent < totalCash

  const depDate = new Date(flight.departure_time)
  const arrDate = new Date(flight.arrival_time)
  const hours = Math.floor(flight.duration_minutes / 60)
  const minutes = flight.duration_minutes % 60

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Left side - Flight Details */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={airline.logo_url}
            alt={airline.name}
            className="h-8 w-8 object-contain rounded-sm"
          />
          <div>
            <p className="text-sm text-slate-500 font-medium">
              IDA • {format(depDate, 'EEE, dd MMM yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-6">
          <div className="flex flex-col w-1/4">
            <span className="text-2xl font-bold text-slate-800">{format(depDate, 'HH:mm')}</span>
            <span className="text-sm font-medium text-slate-500">{origin.iata_code}</span>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 px-4 relative">
            <span className="text-xs font-medium text-slate-500 mb-1">
              {hours}h {minutes}m
            </span>
            <div className="w-full flex items-center">
              <div className="h-px bg-slate-300 flex-1"></div>
              <div className="px-3 py-1 text-[10px] font-semibold text-[#0066CC] uppercase bg-slate-50 rounded-full border border-slate-200 mx-2">
                Voo
              </div>
              <div className="h-px bg-slate-300 flex-1"></div>
            </div>
          </div>

          <div className="flex flex-col w-1/4 items-end">
            <span className="text-2xl font-bold text-slate-800">{format(arrDate, 'HH:mm')}</span>
            <span className="text-sm font-medium text-slate-500">{dest.iata_code}</span>
          </div>
        </div>
      </div>

      {/* Right side - Price & Action */}
      <div className="w-full md:w-72 bg-slate-50 p-6 flex flex-col justify-center">
        <div className="flex flex-col mb-4">
          <span className="text-sm text-slate-500 mb-2">
            Para {passengers} pessoa{passengers > 1 ? 's' : ''}
          </span>

          {isMilesBetter ? (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-green-700 uppercase bg-green-100 px-2 py-1 rounded w-max mb-1">
                Melhor opção em Milhas
              </span>
              <div className="text-3xl font-bold text-[#FF6B35]">
                {totalMiles.toLocaleString('pt-BR')} <span className="text-lg">Milhas</span>
              </div>
              <span className="text-xs text-slate-500 mt-1">
                Equivalente a R${' '}
                {milesCashEquivalent.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs text-slate-400">
                (Preço em dinheiro: R$ {totalCash.toLocaleString('pt-BR')})
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-green-700 uppercase bg-green-100 px-2 py-1 rounded w-max mb-1">
                Melhor opção em Reais
              </span>
              <div className="text-3xl font-bold text-[#0066CC]">
                R$ {totalCash.toLocaleString('pt-BR')}
              </div>
              <span className="text-xs text-slate-500 mt-1">
                Milhas ({totalMiles.toLocaleString('pt-BR')}) custariam R${' '}
                {milesCashEquivalent.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
        </div>

        <Button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold h-12">
          Selecionar
        </Button>
      </div>
    </div>
  )
}
