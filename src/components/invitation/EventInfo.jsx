import { Calendar, MapPin, Shirt, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EventInfo({ event }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    if (timeStr.includes(' - ')) {
      const [start, end] = timeStr.split(' - ')
      const format = (t) => {
        const parts = t.split(':')
        return parts[0] + ':' + parts[1]
      }
      return `${format(start)} - ${format(end)} hs`
    }
    const parts = timeStr.split(':')
    return parts[0] + ':' + parts[1] + ' hs'
  }

  const getMapEmbedUrl = () => {
    if (!event?.mapsUrl) return null
    if (event.mapsUrl.includes('google.com/maps')) {
      const query = encodeURIComponent(event.address || event.location || 'Argentina')
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895!2d-58.383759!3d-34.603734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjQiUyA1OMKwMjMnMDEuNSJX!5e0!3m2!1ses!2sar!4v1!5m2!1ses!2sar`
    }
    return null
  }

  const infoItems = [
    {
      icon: <Calendar size={22} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.5))' }} />,
      label: '¿CUÁNDO?',
      value: formatDate(event.date),
      sub: formatTime(event.time),
      color: 'cyan',
    },
    {
      icon: <MapPin size={22} className="text-orange-400" style={{ filter: 'drop-shadow(0 0 5px rgba(255,107,53,0.5))' }} />,
      label: '¿DÓNDE?',
      value: event.location || event.address?.split(',')[0] || '',
      sub: event.address?.split(',').slice(1).join(',') || '',
      color: 'orange',
    },
  ]

  if (event.dressCode && event.dressCode.trim() !== '') {
    infoItems.push({
      icon: <Shirt size={22} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px rgba(168,85,247,0.5))' }} />,
      label: 'VESTIMENTA / PILCHA',
      value: event.dressCode,
      sub: '',
      color: 'purple',
    })
  }

  const colorStyles = {
    cyan: { bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)', text: '#00D4FF' },
    orange: { bg: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)', text: '#FF6B35' },
    purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', text: '#a855f7' },
  }

  const mapEmbedUrl = getMapEmbedUrl()

  return (
    <div className="space-y-4">
      {infoItems.map((item, i) => {
        const style = colorStyles[item.color]
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${style.bg}, rgba(0,0,0,0.3))`,
              border: `1px solid ${style.border}`,
              boxShadow: `0 0 20px ${style.bg}`,
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                animation: 'shine 4s ease-in-out infinite',
              }} />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${style.bg}, ${style.border})`,
                  border: `1px solid ${style.border}`,
                }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: style.text, textShadow: `0 0 10px ${style.bg}` }}>
                  {item.label}
                </p>
                <p className="text-white font-bold text-lg font-bebas tracking-wider"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {item.value}
                </p>
                {item.sub && <p className="text-white/50 text-sm mt-0.5">{item.sub}</p>}
              </div>
            </div>
          </motion.div>
        )
      })}
      
      {mapEmbedUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="200"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del evento"
          />
        </motion.div>
      )}
      
      <motion.a
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        href={event.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location || '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full p-4 rounded-xl font-semibold transition-all hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(90deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(59,130,246,0.3)',
          color: '#93c5fd',
          boxShadow: '0 0 20px rgba(59,130,246,0.1)',
        }}>
        <Navigation size={18} />
        Cómo llegar
        <span className="text-lg">↗</span>
      </motion.a>
    </div>
  )
}