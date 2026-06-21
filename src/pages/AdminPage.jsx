import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { LogOut, Plus, Eye, Trash2, Users, Calendar, CheckCircle } from 'lucide-react'

export default function AdminPage() {
  const navigate = useNavigate()
  const { events } = useApp()
  const [auth, setAuth] = useState({ username: '', password: '', isLoggedIn: false })

  const handleLogin = (e) => {
    e.preventDefault()
    if (auth.username === 'admin' && auth.password === 'figus2026') {
      setAuth(p => ({ ...p, isLoggedIn: true }))
    }
  }

  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-figus-dark">
        <div className="absolute inset-0 bg-figus-hero" />
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-4xl">🏆</span>
            </div>
            <h1 className="text-4xl font-black text-white font-bebas tracking-wider">INVITFIGUS</h1>
            <p className="text-white/40 mt-2">Panel de Administración</p>
          </div>

          <div className="glass rounded-3xl p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Usuario</label>
                <input
                  type="text"
                  value={auth.username}
                  onChange={(e) => setAuth(p => ({ ...p, username: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-orange-500/50 outline-none"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={auth.password}
                  onChange={(e) => setAuth(p => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 focus:border-orange-500/50 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn-pill-warm w-full py-3">
                Ingresar al Panel
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/30 mt-4">Demo: admin / figus2026</p>
        </div>
      </div>
    )
  }

  const totalInvited = events.length * 30 // Estimado
  const totalConfirmed = Math.floor(totalInvited * 0.7) // Estimado

  return (
    <div className="min-h-screen bg-figus-dark">
      <div className="absolute inset-0 bg-figus-hero" />

      <div className="relative z-10 p-6 pt-24 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white font-bebas tracking-wider">PANEL ADMIN</h1>
            <p className="text-white/40">Gestiona tus invitaciones</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/crear')} className="btn-pill-warm px-4 py-2 text-sm flex items-center gap-2">
              <Plus size={16} /> Nueva Invitación
            </button>
            <button onClick={() => setAuth(p => ({ ...p, isLoggedIn: false }))} 
              className="btn-pill-secondary px-4 py-2 text-sm flex items-center gap-2">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/40">Total Eventos</p>
                <p className="text-3xl font-black text-white font-bebas">{events.length}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.2)' }}>
                <Calendar size={24} className="text-blue-400" />
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/40">Invitados Est.</p>
                <p className="text-3xl font-black text-white font-bebas">{totalInvited}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.2)' }}>
                <Users size={24} className="text-purple-400" />
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/40">Confirmados Est.</p>
                <p className="text-3xl font-black text-white font-bebas">{totalConfirmed}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.2)' }}>
                <CheckCircle size={24} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Eventos */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 font-bebas tracking-wider">MIS INVITACIONES</h2>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30">No hay invitaciones creadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-4">
                    <img src={event.honoreePhoto} alt={event.honoreeName} 
                      className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-medium text-white">{event.honoreeName} - {event.honoreeAge} años</p>
                      <p className="text-sm text-white/40">{event.date} · {event.team}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.open(`/invitacion/${event.slug}`, '_blank')}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}