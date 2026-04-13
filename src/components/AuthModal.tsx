import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

export function AuthModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAuth = async (action: 'login' | 'register') => {
    setLoading(true)
    const { error } =
      action === 'login' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)

    if (error) {
      toast({
        title: 'Erro de Autenticação',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description:
          action === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!',
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            FlightFinder
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <TabsContent value="login">
            <Button className="w-full mt-4" onClick={() => handleAuth('login')} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na conta'}
            </Button>
          </TabsContent>
          <TabsContent value="register">
            <Button
              className="w-full mt-4"
              onClick={() => handleAuth('register')}
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
