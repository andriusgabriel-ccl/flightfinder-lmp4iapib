import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flight } from '@/services/api'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip as ChartTooltip } from 'recharts'

interface PriceTabsProps {
  flights: Flight[]
}

export function PriceTabs({ flights }: PriceTabsProps) {
  // Aggregate minimum prices by Airline and Stop type
  const airlinesSet = new Set(
    flights.map((f) => f.expand?.airline.name).filter(Boolean) as string[],
  )
  const airlines = Array.from(airlinesSet)

  const getMinPrice = (airlineName: string, stopsCondition: (s: number) => boolean) => {
    const relevantFlights = flights.filter(
      (f) => f.expand?.airline.name === airlineName && stopsCondition(f.stops),
    )
    if (relevantFlights.length === 0) return null

    let minVal = Infinity
    for (const f of relevantFlights) {
      const cash = f.price_brl
      const milesVal = (f.price_miles / 1000) * (f.expand?.airline.miles_rate_per_1k || 0)
      const val = Math.min(cash, milesVal)
      if (val < minVal) minVal = val
    }
    return minVal
  }

  // Mock data for Trend Chart
  const trendData = Array.from({ length: 15 }).map((_, i) => ({
    day: `Dia ${i + 1}`,
    price: 400 + Math.random() * 300 + (i > 10 ? 100 : 0),
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent p-0">
          <TabsTrigger
            value="matrix"
            className="flex-1 rounded-none h-full data-[state=active]:border-b-2 data-[state=active]:border-[#0066CC] data-[state=active]:text-[#0066CC] font-semibold text-sm"
          >
            Preços por companhia aérea
          </TabsTrigger>
          <TabsTrigger
            value="dates"
            className="flex-1 rounded-none h-full data-[state=active]:border-b-2 data-[state=active]:border-[#0066CC] data-[state=active]:text-[#0066CC] font-semibold text-sm"
          >
            Preços +/- 3 dias
          </TabsTrigger>
          <TabsTrigger
            value="trend"
            className="flex-1 rounded-none h-full data-[state=active]:border-b-2 data-[state=active]:border-[#0066CC] data-[state=active]:text-[#0066CC] font-semibold text-sm"
          >
            Tendência de preços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="p-0 m-0 outline-none">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium w-1/4">Companhias</th>
                  {airlines.map((a) => {
                    const logo = flights.find((f) => f.expand?.airline.name === a)?.expand?.airline
                      .logo
                    return (
                      <th key={a} className="px-6 py-4 text-center font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <img src={logo} alt={a} className="h-6 object-contain" />
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            Muito bom
                          </span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-800">Direto</td>
                  {airlines.map((a) => {
                    const p = getMinPrice(a, (s) => s === 0)
                    return (
                      <td key={a} className="px-6 py-4 text-center">
                        {p ? (
                          <span className="font-bold text-[#0066CC]">R$ {Math.round(p)}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-slate-800">Com Paradas</td>
                  {airlines.map((a) => {
                    const p = getMinPrice(a, (s) => s > 0)
                    return (
                      <td key={a} className="px-6 py-4 text-center">
                        {p ? (
                          <span className="text-slate-600">R$ {Math.round(p)}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent
          value="dates"
          className="p-8 m-0 outline-none flex items-center justify-center min-h-[200px] text-slate-500"
        >
          <p>Selecione outras datas no calendário acima para comparar.</p>
        </TabsContent>

        <TabsContent value="trend" className="p-6 m-0 outline-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-semibold text-slate-800">Histórico de preços (30 dias)</h4>
              <p className="text-sm text-slate-500">
                Os preços estão subindo. Recomendamos comprar agora.
              </p>
            </div>
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              Alta demanda
            </div>
          </div>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <ChartTooltip
                  formatter={(val: number) => `R$ ${val.toFixed(0)}`}
                  labelStyle={{ color: '#333' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#0066CC"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
