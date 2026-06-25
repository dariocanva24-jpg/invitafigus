import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ADMIN_PASSWORD = 'invitafigus2026'

export default function AdminPage() {
  const navigate = useNavigate()
  const { invitations, activateInvitation } = useApp()
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleActivate = (id) => {
    activateInvitation(id)
  }

  const copyLink = (slug) => {
    const url = `${window.location.origin}/invitacion/${slug}`
    navigator.clipboard.writeText(url)
    alert('Link copiado: ' + url)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black font-bebas text-[#FFD700] tracking-wider">INVITAFIGUS</h1>
            <p className="text-white/40 text-sm mt-2">Panel de Administración</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FFD700] text-[#0a0e27] font-bold hover:bg-[#e6c200] transition-colors"
            >
              Ingresar
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 mt-4 text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black font-bebas text-[#FFD700] tracking-wider">PANEL ADMIN</h1>
            <p className="text-white/40 text-sm">Gestión de invitaciones</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
          >
            Volver al inicio
          </button>
        </div>

        <div className="space-y-3">
          {invitations.length === 0 ? (
            <p className="text-white/40 text-center py-12">No hay invitaciones creadas</p>
          ) : (
            invitations.map((inv) => (
              <div
                key={inv.id}
                className={`rounded-xl p-4 border ${
                  inv.status === 'active'
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-[#FFD700]/30 bg-[#FFD700]/5'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {inv.honoreePhoto && (
                      <img
                        src={inv.honoreePhoto}
                        alt={inv.childName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-white">
                        {inv.childName} {inv.honoreeName || ''}
                        {inv.nickname && ` "${inv.nickname}"`}
                      </p>
                      <p className="text-white/40 text-sm">
                        {inv.honoreeAge || inv.age} años · {inv.team} · {inv.date}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inv.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-[#FFD700]/20 text-[#FFD700]'
                          }`}
                        >
                          {inv.status === 'active' ? 'ACTIVA' : 'PENDIENTE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {inv.status !== 'active' && (
                      <button
                        onClick={() => handleActivate(inv.id)}
                        className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#0a0e27] font-bold text-sm hover:bg-[#e6c200] transition-colors"
                      >
                        Activar
                      </button>
                    )}
                    <button
                      onClick={() => copyLink(inv.slug)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                    >
                      Copiar link
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}