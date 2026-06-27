import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { fetchAllInvitations, activateInvitationRemote, deleteInvitationRemote, updateInvitationField } from '../services/googleSheetsApi'

const ADMIN_PASSWORD = 'invitafigus2026'

export default function AdminPage() {
  const navigate = useNavigate()
  const { shareWhatsApp } = useApp()
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)
  const [editingRowIndex, setEditingRowIndex] = useState(null)
  const [editForm, setEditForm] = useState({
    fecha: '',
    hora: '',
    lugar: '',
    mensaje: '',
    equipo: '',
    estado: '',
    foto_url: '',
    foto_local: '',
  })

  const loadInvitations = async () => {
    setLoading(true)
    try {
      const data = await fetchAllInvitations()
      setInvitations(data)
      setError('')
    } catch (err) {
      setError('Error al cargar invitaciones: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadInvitations()
    }
  }, [isLoggedIn])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleActivate = async (slug) => {
    try {
      await activateInvitationRemote(slug)
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadInvitations()
    } catch (err) {
      setError('Error al activar: ' + err.message)
    }
  }

  const handleDelete = async (slug) => {
    if (!window.confirm('¿Eliminar esta invitación?')) return
    try {
      await deleteInvitationRemote(slug)
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadInvitations()
    } catch (err) {
      setError('Error al eliminar: ' + err.message)
    }
  }

  const handleEdit = (inv) => {
    setEditingSlug(inv.slug)
    setEditingRowIndex(inv.rowIndex)
    setEditForm({
      fecha: inv.fecha || '',
      hora: inv.hora || '',
      lugar: inv.lugar || '',
      mensaje: inv.mensaje || '',
      equipo: inv.equipo || '',
      estado: inv.estado || 'PENDIENTE',
      foto_url: inv.foto_url || '',
      foto_local: '',
    })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe ser menor a 2MB')
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setEditForm(prev => ({...prev, foto_local: reader.result}))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveEdit = async () => {
    try {
      for (const [field, value] of Object.entries(editForm)) {
        if (field !== 'foto_local') {
          await updateInvitationField(editingRowIndex, field, value)
        }
      }
      
      if (editForm.foto_local) {
        localStorage.setItem(`foto_${editingSlug}`, editForm.foto_local)
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      setEditingSlug(null)
      setEditingRowIndex(null)
      await loadInvitations()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
    }
  }

  const getFotoSrc = (inv) => {
    const fotoLocal = localStorage.getItem(`foto_${inv.slug}`)
    return inv.foto_url || fotoLocal || null
  }

  const copyLink = (slug) => {
    const url = `${window.location.origin}/invitacion/${slug}`
    navigator.clipboard.writeText(url)
    alert('Link copiado: ' + url)
  }

  const openWhatsApp = (inv) => {
    const url = `${window.location.origin}/invitacion/${inv.slug}`
    const text = `¡Hola! Tu invitación de InvitaFigus está lista 🎉\n\n` +
      `👤 ${inv.nombre} ${inv.apellido || ''}\n` +
      `⚽ ${inv.edad} años · ${inv.equipo}\n` +
      `📅 ${inv.fecha}\n\n` +
      `👉 Link: ${url}\n\n` +
      `¡Compartila con tus invitados!`
    window.open(`https://wa.me/${inv.telefono}?text=${encodeURIComponent(text)}`, '_blank')
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black font-bebas text-[#FFD700] tracking-wider">PANEL ADMIN</h1>
            <p className="text-white/40 text-sm">CRM - Gestión de invitaciones</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadInvitations}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40">Cargando invitaciones...</p>
          </div>
        ) : invitations.length === 0 ? (
          <p className="text-white/40 text-center py-12">No hay invitaciones en Google Sheets</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => {
              const fotoSrc = getFotoSrc(inv)
              return (
                <div
                  key={inv.slug}
                  className={`rounded-xl p-4 border ${
                    inv.estado === 'ACTIVA'
                      ? 'border-green-500/30 bg-green-500/5'
                      : inv.estado === 'ELIMINADA'
                      ? 'border-red-500/30 bg-red-500/5 opacity-50'
                      : 'border-[#FFD700]/30 bg-[#FFD700]/5'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-[200px]">
                      {fotoSrc ? (
                        <img
                          src={fotoSrc}
                          alt={inv.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                          ⚽
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-white">
                          {inv.nombre} {inv.apellido || ''}
                          {inv.apodo && ` "${inv.apodo}"`}
                        </p>
                        <p className="text-white/40 text-sm">
                          {inv.edad} años · {inv.equipo} · {inv.fecha}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          📍 {inv.lugar || 'Sin lugar'} · 🕐 {inv.hora || 'Sin hora'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              inv.estado === 'ACTIVA'
                                ? 'bg-green-500/20 text-green-400'
                                : inv.estado === 'ELIMINADA'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-[#FFD700]/20 text-[#FFD700]'
                            }`}
                          >
                            {inv.estado || 'PENDIENTE'}
                          </span>
                          <span className="text-[10px] text-white/30">
                            👁 {inv.views || 0} vistas
                          </span>
                          {inv.telefono && (
                            <span className="text-[10px] text-white/30">
                              📱 {inv.telefono}
                            </span>
                          )}
                          {inv.email && (
                            <span className="text-[10px] text-white/30">
                              ✉️ {inv.email}
                            </span>
                          )}
                          {!fotoSrc && (
                            <span className="text-[10px] text-orange-400">
                              📷 Foto pendiente
                            </span>
                          )}
                          {fotoSrc && (
                            <span className="text-[10px] text-green-400">
                              📷 Foto cargada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {inv.estado !== 'ACTIVA' && inv.estado !== 'ELIMINADA' && (
                        <button
                          onClick={() => handleActivate(inv.slug)}
                          className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-[#0a0e27] font-bold text-xs hover:bg-[#e6c200] transition-colors"
                        >
                          Activar
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(inv)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => copyLink(inv.slug)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                      >
                        Copiar link
                      </button>
                      {inv.telefono && (
                        <button
                          onClick={() => openWhatsApp(inv)}
                          className="px-3 py-1.5 rounded-lg bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] text-xs hover:bg-[#22c55e]/30 transition-colors"
                        >
                          WhatsApp
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inv.slug)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de edición */}
        {editingSlug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1f3a] rounded-2xl border border-white/10 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-[#FFD700] mb-4">Editar invitación</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Fecha</label>
                  <input
                    type="date"
                    value={editForm.fecha}
                    onChange={(e) => setEditForm({...editForm, fecha: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Hora</label>
                  <input
                    type="text"
                    value={editForm.hora}
                    onChange={(e) => setEditForm({...editForm, hora: e.target.value})}
                    placeholder="15:00 - 19:00"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Lugar</label>
                  <input
                    type="text"
                    value={editForm.lugar}
                    onChange={(e) => setEditForm({...editForm, lugar: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Mensaje</label>
                  <textarea
                    value={editForm.mensaje}
                    onChange={(e) => setEditForm({...editForm, mensaje: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Equipo</label>
                  <input
                    type="text"
                    value={editForm.equipo}
                    onChange={(e) => setEditForm({...editForm, equipo: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Estado</label>
                  <select
                    value={editForm.estado}
                    onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#FFD700]/50 focus:outline-none"
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="PAUSADA">PAUSADA</option>
                  </select>
                </div>
                
                {/* NUEVO: Selector de imagen */}
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Foto del homenajeado</label>
                  
                  {(editForm.foto_local || editForm.foto_url) && (
                    <div className="mb-2">
                      <img 
                        src={editForm.foto_local || editForm.foto_url} 
                        alt="Vista previa" 
                        className="w-24 h-24 rounded-lg object-cover border border-white/10"
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FFD700] file:text-[#0a0e27] hover:file:bg-[#e6c200] cursor-pointer"
                  />
                  
                  <p className="text-white/30 text-[10px] mt-1">
                    Seleccioná la foto que te envió el cliente por WhatsApp (máx 2MB)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2.5 rounded-lg bg-[#FFD700] text-[#0a0e27] font-bold text-sm hover:bg-[#e6c200] transition-colors"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => {
                    setEditingSlug(null)
                    setEditingRowIndex(null)
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}