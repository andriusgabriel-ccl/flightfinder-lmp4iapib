import { Link, Outlet } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Plane className="h-6 w-6 text-[#FF6B35] group-hover:animate-float" />
            <span className="text-xl font-bold text-[#0066CC] tracking-tight">FlightFinder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-slate-700 hover:text-[#0066CC] transition-colors"
            >
              Passagens
            </Link>
            <span className="text-sm font-medium text-slate-400 cursor-not-allowed">Hotéis</span>
            {user && (
              <span className="text-sm font-medium text-slate-700 hover:text-[#0066CC] cursor-pointer">
                Minhas Viagens
              </span>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 hidden sm:inline-block">
                  Olá, {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <AuthModal>
                  <Button
                    variant="ghost"
                    className="hidden sm:inline-flex text-[#0066CC] hover:bg-blue-50"
                  >
                    Login
                  </Button>
                </AuthModal>
                <AuthModal>
                  <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                    Cadastre-se
                  </Button>
                </AuthModal>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-5 w-5 text-[#FF6B35]" />
              <span className="text-lg font-bold text-white tracking-tight">FlightFinder</span>
            </div>
            <p className="text-sm text-slate-400">
              Encontre as melhores opções de voos combinando milhas e dinheiro.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <p className="text-sm mb-2">Central de Ajuda 24h</p>
            <p className="text-sm text-[#FF6B35] font-medium">0800 123 4567</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} FlightFinder. Inspirado nas melhores experiências de viagem.
        </div>
      </footer>
    </div>
  )
}
