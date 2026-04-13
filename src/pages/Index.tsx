import { SearchForm } from '@/components/SearchForm'
import { ShieldCheck, PlaneTakeoff, HeadphonesIcon } from 'lucide-react'

const Index = () => {
  return (
    <div className="flex-1 flex flex-col w-full h-full">
      {/* Hero Section */}
      <div className="relative min-h-[500px] flex items-center justify-center pt-10 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0B2E]/60 via-transparent to-[#F4F7F9] z-10" />
          <img
            src="https://img.usecurling.com/p/1920/1080?q=airplane%20sunset&dpr=2"
            alt="Airplane flying at sunset"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Descubra o valor real da sua viagem.
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mb-12 max-w-2xl drop-shadow-md">
            Comparamos preços em dinheiro e milhas para garantir que você sempre faça o melhor
            negócio.
          </p>

          <div className="w-full max-w-5xl mx-auto">
            <SearchForm layout="horizontal" />
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-[#F4F7F9] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-[#0066CC]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Melhor Preço Garantido</h3>
              <p className="text-slate-500">
                Nosso algoritmo compara todas as opções em tempo real para encontrar a tarifa mais
                barata.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <PlaneTakeoff className="h-8 w-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Comparativo de Milhas</h3>
              <p className="text-slate-500">
                Descubra automaticamente se vale mais a pena pagar em reais ou usar as suas milhas
                acumuladas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Suporte 24h</h3>
              <p className="text-slate-500">
                Nossa equipe de especialistas está disponível a qualquer momento para ajudar na sua
                reserva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
