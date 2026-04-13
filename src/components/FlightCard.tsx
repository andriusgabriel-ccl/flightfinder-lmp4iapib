import { Flight } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

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
  const bestOptionValue = isMilesBetter ? milesCashEquivalent : totalCash

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
            <h4 className="text-base font-bold text-slate-800">{airline.name}</h4>
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
              <div className="px-3 py-1 text-[10px] font-semibold text-[#0066CC] uppercase bg-slate-50 rounded-full border border-slate-200 mx-2 whitespace-nowrap">
                {flight.stops === 0
                  ? 'Direto'
                  : `${flight.stops} Parada${flight.stops > 1 ? 's' : ''}`}
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

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-green-700 uppercase bg-green-100 px-2 py-1 rounded w-max mb-3">
              Melhor opção: R${' '}
              {bestOptionValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Reais:</span>
              <span
                className={cn(
                  'font-bold text-lg',
                  !isMilesBetter ? 'text-[#0066CC]' : 'text-slate-700',
                )}
              >
                R${' '}
                {totalCash.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600 mt-1">Milhas:</span>
              <div className="text-right">
                <span
                  className={cn(
                    'font-bold text-lg',
                    isMilesBetter ? 'text-[#FF6B35]' : 'text-slate-700',
                  )}
                >
                  {totalMiles.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  (R${' '}
                  {milesCashEquivalent.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold h-12 mt-2">
          Selecionar
        </Button>
      </div>
    </div>
  )
}
