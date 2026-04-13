import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, MapPin, Search, ArrowLeftRight, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Airport, getAirports } from '@/services/api'
import { useToast } from '@/hooks/use-toast'

interface SearchFormProps {
  layout?: 'horizontal' | 'vertical'
  initialOrigin?: string
  initialDestination?: string
  initialDate?: string
}

export function SearchForm({
  layout = 'horizontal',
  initialOrigin = '',
  initialDestination = '',
  initialDate,
}: SearchFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [airports, setAirports] = useState<Airport[]>([])
  const [origin, setOrigin] = useState<Airport | null>(null)
  const [destination, setDestination] = useState<Airport | null>(null)
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined,
  )
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [passengers, setPassengers] = useState(1)

  const [openOrigin, setOpenOrigin] = useState(false)
  const [openDest, setOpenDest] = useState(false)

  useEffect(() => {
    getAirports().then((data) => {
      setAirports(data)
      if (initialOrigin) setOrigin(data.find((a) => a.iata_code === initialOrigin) || null)
      if (initialDestination)
        setDestination(data.find((a) => a.iata_code === initialDestination) || null)
    })
  }, [initialOrigin, initialDestination])

  const handleSwap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSearch = () => {
    if (!origin) {
      toast({
        title: 'Atenção',
        description: 'Por favor, selecione um aeroporto de origem.',
        variant: 'destructive',
      })
      return
    }
    if (!destination) {
      toast({
        title: 'Atenção',
        description: 'Por favor, selecione um aeroporto de destino.',
        variant: 'destructive',
      })
      return
    }
    if (origin.iata_code === destination.iata_code) {
      toast({
        title: 'Atenção',
        description: 'A origem e o destino não podem ser iguais.',
        variant: 'destructive',
      })
      return
    }
    const params = new URLSearchParams({
      origin: origin.iata_code,
      destination: destination.iata_code,
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      passengers: passengers.toString(),
    })
    navigate(`/results?${params.toString()}`)
  }

  const isVertical = layout === 'vertical'

  const AirportSelector = ({ value, onChange, open, setOpen, placeholder, excludeCode }: any) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal bg-white text-slate-800 border-slate-200 h-14',
            !value && 'text-muted-foreground',
            isVertical && 'rounded-md',
          )}
        >
          <MapPin className="mr-2 h-5 w-5 text-slate-400" />
          {value ? (
            <div className="flex flex-col items-start leading-tight truncate overflow-hidden">
              <span className="text-xs text-slate-500">{placeholder}</span>
              <span className="font-semibold text-sm truncate max-w-full">
                {value.iata_code} - {value.city_name}
              </span>
            </div>
          ) : (
            <span className="text-base">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar cidade ou aeroporto..." />
          <CommandList>
            <CommandEmpty>Nenhum aeroporto encontrado.</CommandEmpty>
            <CommandGroup>
              {airports
                .filter((a) => a.iata_code !== excludeCode)
                .map((airport) => (
                  <CommandItem
                    key={airport.id}
                    value={`${airport.iata_code} ${airport.city_name} ${airport.country}`}
                    onSelect={() => {
                      onChange(airport)
                      setOpen(false)
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4 opacity-50" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {airport.iata_code} - {airport.city_name}
                      </span>
                      <span className="text-xs text-slate-500">{airport.country}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  return (
    <div
      className={cn(
        'bg-[#1A0B2E] p-4 rounded-xl shadow-xl border border-[#2A1B4E]',
        isVertical ? 'flex flex-col gap-4' : 'flex flex-col lg:flex-row items-center gap-2',
      )}
    >
      {/* Locations */}
      <div
        className={cn(
          'relative flex w-full',
          isVertical ? 'flex-col gap-2' : 'flex-col sm:flex-row flex-1',
        )}
      >
        <div className="flex-1 w-full relative">
          <AirportSelector
            value={origin}
            onChange={setOrigin}
            open={openOrigin}
            setOpen={setOpenOrigin}
            placeholder="Origem"
            excludeCode={destination?.iata_code}
          />
        </div>

        <div
          className={cn(
            'z-10 flex items-center justify-center',
            isVertical
              ? 'absolute right-4 top-1/2 -translate-y-1/2'
              : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          )}
        >
          <button
            onClick={handleSwap}
            className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <ArrowLeftRight
              className={cn(
                'h-4 w-4 text-[#0066CC]',
                isVertical
                  ? 'rotate-90'
                  : 'group-hover:rotate-180 transition-transform duration-300',
              )}
            />
          </button>
        </div>

        <div className="flex-1 w-full">
          <AirportSelector
            value={destination}
            onChange={setDestination}
            open={openDest}
            setOpen={setOpenDest}
            placeholder="Destino"
            excludeCode={origin?.iata_code}
          />
        </div>
      </div>

      {/* Dates */}
      <div className={cn('flex w-full', isVertical ? 'flex-col gap-2' : 'flex-1 gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal bg-white text-slate-800 border-slate-200 h-14',
                !date && 'text-muted-foreground',
                isVertical ? '' : 'flex-1',
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-slate-400" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs text-slate-500">Ida</span>
                <span className="font-semibold text-sm">
                  {date ? format(date, 'EEE, dd MMM', { locale: ptBR }) : 'Selecione'}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal bg-white text-slate-800 border-slate-200 h-14',
                !returnDate && 'text-muted-foreground',
                isVertical ? '' : 'flex-1',
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-slate-400" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs text-slate-500">Volta</span>
                <span className="font-semibold text-sm">
                  {returnDate ? format(returnDate, 'EEE, dd MMM', { locale: ptBR }) : 'Opcional'}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              disabled={(rDate: Date) => (date ? rDate < date : rDate < new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Passengers & Search */}
      <div
        className={cn(
          'flex w-full gap-2',
          isVertical ? 'flex-col' : 'flex-1 lg:flex-none lg:w-auto',
        )}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal bg-white text-slate-800 border-slate-200 h-14 w-full',
                isVertical ? '' : 'lg:w-48',
              )}
            >
              <Users className="mr-2 h-5 w-5 text-slate-400" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs text-slate-500">Passageiros</span>
                <span className="font-semibold text-sm">
                  {passengers} pessoa{passengers > 1 ? 's' : ''}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Passageiros</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  disabled={passengers <= 1}
                >
                  -
                </Button>
                <span className="w-4 text-center font-medium">{passengers}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setPassengers(Math.min(9, passengers + 1))}
                  disabled={passengers >= 9}
                >
                  +
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleSearch}
          className={cn(
            'bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold text-lg h-14',
            isVertical ? 'w-full mt-2' : 'w-full lg:w-auto px-8',
          )}
        >
          <Search className="mr-2 h-5 w-5" />
          Buscar Passagens
        </Button>
      </div>
    </div>
  )
}
