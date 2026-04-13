import { Flight } from '@/services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from './ui/button'
import { Heart, Briefcase, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface FlightCardProps {
  flight: Flight
  passengers: number
}

export function FlightCard({ flight, passengers }: FlightCardProps) {
  const airline = flight.expand?.airline
  const origin = flight.expand?.origin
  const dest = flight.expand?.destination

  if (!airline || !origin || !dest) return null

  const totalCash = flight.price_brl * passengers
  const totalMiles = flight.price_miles * passengers
  const milesCashEquivalent = (totalMiles / 1000) * airline.miles_rate_per_1k

  const isMilesBetter = milesCashEquivalent < totalCash
  const displayPrice = isMilesBetter
    ? totalMiles.toLocaleString('pt-BR')
    : `R$ ${totalCash.toLocaleString('pt-BR')}`
  const displayLabel = isMilesBetter ? 'Milhas' : 'Total'
  const savings = isMilesBetter ? totalCash - milesCashEquivalent : 0

  const depDate = new Date(flight.departure_time)
  const arrDate = new Date(flight.arrival_time)
  const durationMs = arrDate.getTime() - depDate.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Left side - Flight Details */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={airline.logo}
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
            <span className="text-sm font-medium text-slate-500">{origin.code}</span>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 px-4 relative">
            <span className="text-xs font-medium text-slate-500 mb-1">
              {hours}h {minutes}m
            </span>
            <div className="w-full flex items-center">
              <div className="h-px bg-slate-300 flex-1"></div>
              <div className="px-2 text-xs font-semibold text-[#0066CC] uppercase bg-slate-50 rounded-full border border-slate-200 mx-2">
                {flight.stops === 0
                  ? 'Direto'
                  : `${flight.stops} Parada${flight.stops > 1 ? 's' : ''}`}
              </div>
              <div className="h-px bg-slate-300 flex-1"></div>
            </div>
          </div>

          <div className="flex flex-col w-1/4 items-end">
            <span className="text-2xl font-bold text-slate-800">{format(arrDate, 'HH:mm')}</span>
            <span className="text-sm font-medium text-slate-500">{dest.code}</span>
          </div>
        </div>
      </div>

      {/* Right side - Price & Action */}
      <div className="w-full md:w-72 bg-slate-50 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">
              Para {passengers} pessoa{passengers > 1 ? 's' : ''}
            </span>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">{displayLabel}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-slate-400 ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Preço Dinheiro: R$ {totalCash.toLocaleString('pt-BR')}
                    <br />
                    Preço Milhas: {totalMiles.toLocaleString('pt-BR')} (Equiv. R${' '}
                    {milesCashEquivalent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-3xl font-bold text-[#1A0B2E]">
              {isMilesBetter ? '' : 'R$ '}
              {displayPrice}
            </div>

            {isMilesBetter && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                Melhor opção (Econ. R${' '}
                {savings.toLocaleString('pt-BR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                )
              </span>
            )}
            {!isMilesBetter && milesCashEquivalent > 0 && (
              <span className="text-xs text-slate-500 mt-1 block">
                Ou {totalMiles.toLocaleString('pt-BR')} milhas
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold h-12">
            Comprar
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#0066CC] text-[#0066CC] hover:bg-blue-50 h-10"
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </div>
  )
}
