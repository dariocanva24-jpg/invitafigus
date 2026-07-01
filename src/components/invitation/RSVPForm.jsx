import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Plus, Minus } from 'lucide-react'

export default function RSVPForm({ event }) {
  const [form, setForm] = useState({ name: '', whatsapp: '', status: 'confirmed', guests: 0, notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    
    // ← FIX: Abrir WhatsApp con mensaje de confirmación
    if (event?.contactWhatsApp && form.status === 'confirmed') {
      const phone = String(event.contactWhatsApp || '').replace(/\D/g, '')
      const message = encodeURIComponent(
        `¡Hola! Confirmo mi asistencia al cumple de ${event.childName || ''}.\n` +
        `Nombre: ${form.name}\n` +
        `Acompañantes: ${form.guests}\n` +
        (form.notes ? `Notas: ${form.notes}` : '')
      )
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }
  }

  const incrementGuests = () => {
    setForm(p => ({ ...p, guests: p.guests + 1 }))
  }

  const decrementGuests = () => {
    setForm(p => ({ ...p, guests: Math.max(0, p.guests - 1) }))
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
          border: '1px solid rgba(34,197,94,0.3)',
          boxShadow: '0 0 30px rgba(34,197,94,0.2)',
        }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'rgba(34,197,94,0.2)',
            boxShadow: '0 0 20px rgba(34,197,94,0.3)',
          }}>
          <Check size={32} className="text-green-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-300 mb-2 font-bebas tracking-wider"
          style={{ textShadow: '0 0 20px rgba(34,197,94,0.5)' }}>
          ¡CONFIRMADO!
        </h3>
        <p className="text-green-200/80">Gracias por confirmar tu asistencia.</p>
        {event?.contactWhatsApp && (
          <a
            href={`https://wa.me/${String(event.contactWhatsApp || '').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-bold text-white"
            style={{
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
            }}>
            <span className="text-xl">💬</span>
            Contactar por WhatsApp
          </a>
        )}
      </motion.div>
    )
  }

  return (
    <div className="relative rounded-3xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(255,107,53,0.05))',
        border: '1px solid rgba(0,212,255,0.2)',
        boxShadow: '0 0 30px rgba(0,212,255,0.1)',
      }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(0,212,255,0.03) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'shine 4s ease-in-out infinite',
        }} />
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-bebas tracking-wider text-2xl relative z-10"
        style={{ textShadow: '0 0 10px rgba(0,212,255,0.3)' }}>
        <span className="text-cyan-400 text-2xl">✉</span>
        CONFIRMAR ASISTENCIA
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Tu nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
            placeholder="Tu nombre"
            style={{ boxShadow: '0 0 20px rgba(0,212,255,0.05)' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp *</label>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm(p => ({ ...p, whatsapp: e.target.value }))}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
            placeholder="+54911..."
            style={{ boxShadow: '0 0 20px rgba(0,212,255,0.05)' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">¿Vas a asistir?</label>
          <div className="flex gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setForm(p => ({ ...p, status: 'confirmed' }))}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                form.status === 'confirmed' ? 'text-white' : 'text-white/50'
              }`}
              style={form.status === 'confirmed'
                ? { background: 'linear-gradient(90deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }
                : { background: 'rgba(255,255,255,0.05)' }}>
              <Check size={16} /> Sí voy
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setForm(p => ({ ...p, status: 'declined' }))}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                form.status === 'declined' ? 'text-white' : 'text-white/50'
              }`}
              style={form.status === 'declined'
                ? { background: 'linear-gradient(90deg, #ef4444, #dc2626)', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }
                : { background: 'rgba(255,255,255,0.05)' }}>
              <X size={16} /> No puedo
            </motion.button>
          </div>
        </div>
        
        {form.status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}>
            <label className="block text-sm font-medium text-white/70 mb-2">¿Cuántos acompañantes?</label>
            
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decrementGuests}
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Minus size={20} />
              </motion.button>
              
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={form.guests}
                  readOnly
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-center px-4 py-3 text-lg font-bold"
                />
              </div>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={incrementGuests}
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Plus size={20} />
              </motion.button>
            </div>
            
            <p className="text-white/30 text-xs mt-2 text-center">Tocá + o - para cambiar la cantidad</p>
          </motion.div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Notas (opcional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
            rows={2}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none resize-none"
            placeholder="Alguna nota especial..."
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full font-bold text-white uppercase tracking-wider text-sm"
          style={{
            background: 'linear-gradient(90deg, #FF6B35, #ec4899)',
            boxShadow: '0 8px 32px rgba(255,107,53,0.4)',
          }}>
          {form.status === 'confirmed' ? 'Confirmar Asistencia' : 'Enviar Respuesta'}
        </motion.button>
      </form>
    </div>
  )
}