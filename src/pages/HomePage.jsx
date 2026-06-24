import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Camera, Share2, Star, ChevronDown, MessageCircle, Clock, Shield, Zap, Heart, Trophy, X, Check } from 'lucide-react'

// Número de WhatsApp - CAMBIAR POR TU NÚMERO REAL
const WHATSAPP_NUMBER = '5493885212331'

// ─── DATOS ─────────────────────────────────────────

const TEAMS = [
  { id: 'argentina', name: 'Argentina', shield: '/escudos/argentina.svg' },
  { id: 'boca', name: 'Boca Juniors', shield: '/escudos/boca.svg' },
  { id: 'river', name: 'River Plate', shield: '/escudos/river.svg' },
  { id: 'sanlorenzo', name: 'San Lorenzo', shield: '/escudos/sanlorenzo.svg' },
  { id: 'racing', name: 'Racing Club', shield: '/escudos/racing.svg' },
  { id: 'independiente', name: 'Independiente', shield: '/escudos/independiente.svg' },
  { id: 'brazil', name: 'Brasil', shield: '/escudos/brazil.svg' },
  { id: 'realmadrid', name: 'Real Madrid', shield: '/escudos/realmadrid.svg' },
  { id: 'gimnasiajujuy', name: 'Gimnasia Jujuy', shield: '/escudos/gimnasiajujuy.svg' },
]

const STEPS = [
  { icon: Shield, title: 'Elegí tu equipo', desc: 'Seleccioná el escudo de tu club o selección favorita.' },
  { icon: Camera, title: 'Subí la foto', desc: 'Cargá una foto del cumpleañero. Se verá como una figurita real.' },
  { icon: Share2, title: 'Compartí', desc: 'Enviá el link por WhatsApp, Instagram o donde quieras.' },
]

const EXAMPLES = [
  { name: 'Thiago', age: 8, team: 'argentina', teamName: 'Argentina', rating: 85, stats: { RIT: 85, PAS: 72, DEF: 45, FIS: 78 } },
  { name: 'Benicio', age: 9, team: 'river', teamName: 'River Plate', rating: 91, stats: { RIT: 88, PAS: 85, DEF: 60, FIS: 82 } },
  { name: 'Zoe', age: 7, team: 'boca', teamName: 'Boca Juniors', rating: 87, stats: { RIT: 82, PAS: 78, DEF: 55, FIS: 80 } },
  { name: 'Lautaro', age: 10, team: 'sanlorenzo', teamName: 'San Lorenzo', rating: 89, stats: { RIT: 86, PAS: 80, DEF: 58, FIS: 84 } },
]

const BENEFITS = [
  { icon: Sparkles, title: 'Invitación original', desc: 'Diferente a todas. Estilo figurita FIFA.' },
  { icon: MessageCircle, title: 'Compartible por WhatsApp', desc: 'Un link. Cero complicaciones.' },
  { icon: Clock, title: 'Cuenta regresiva incluida', desc: 'Todos ven cuánto falta para el gran día.' },
  { icon: Heart, title: 'Confirmación de asistencia', desc: 'Los invitados responden directo a tu celular.' },
  { icon: Shield, title: 'Diseño estilo figurita FIFA', desc: 'Escudo real, stats, rating. Como un juego.' },
  { icon: Zap, title: 'Lista en 2 minutos', desc: 'Sin registro. Sin pagar. Sin esperar.' },
]

const TESTIMONIALS = [
  { name: 'Mariana G.', role: 'Mamá de Thiago, 8 años', text: 'La invitación de Argentina fue un éxito. Los amigos de mi hijo no podían creer que tuviera su propia figurita.', stars: 5 },
  { name: 'Gustavo R.', role: 'Papá de Benicio, 9 años', text: 'Hice la de River para el cumple. Los padres me preguntaron dónde la había hecho. Un golazo.', stars: 5 },
  { name: 'Luciana M.', role: 'Mamá de Zoe, 7 años', text: 'La de Boca quedó hermosa. Hasta los abuelos supieron confirmar por WhatsApp. Recomiendo.', stars: 5 },
]

// ─── MODAL DE PAGO (solo para ejemplo) ─────────────────────────────────

function PaymentModal({ isOpen, onClose, navigate }) {
  const benefits = [
    'La experiencia completa, no una simple imagen',
    'Su página con enlace para mandársela a quien quieras',
    'Sin marca de agua · se abre con un toque',
    'Disponible para compartir por 90 días',
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
              border: '1px solid rgba(255,215,0,0.2)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white/60" />
            </button>

            <div className="p-6 pt-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                  }}>
                  <Trophy size={28} className="text-[#1a1a3e]" />
                </div>
                <h2 className="text-2xl font-black font-bebas tracking-wider text-white mb-2">
                  ACTIVÁ TU INVITACIÓN
                </h2>
                <p className="text-white/40 text-sm">
                  Esto que acabás de ver es exactamente lo que va a vivir quien la reciba.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-[#FFD700]" />
                    </div>
                    <span className="text-white/70 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-white/40 text-lg">ARS</span>
                  <span className="text-5xl font-black text-white font-bebas tracking-tight">10.000</span>
                </div>
                <span className="text-white/30 text-xs">· pago único · sin suscripción</span>
                
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400 text-xs line-through">La competencia: ARS 18.000</span>
                  <span className="text-[#FFD700] text-xs font-bold">¡Ahorrás 44%!</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose()
                    navigate('/crear')
                  }}
                  className="w-full py-4 rounded-full font-bold text-[#1a1a3e] text-lg tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B35)',
                    boxShadow: '0 8px 32px rgba(255,215,0,0.3)',
                  }}
                >
                  Crear mi invitación →
                </button>

                <button
                  onClick={() => {
                    onClose()
                    navigate('/invitacion/thiago-8-argentina')
                  }}
                  className="w-full py-3 rounded-full text-white/60 text-sm hover:text-white transition-colors border border-white/10 hover:border-white/20"
                >
                  Seguir viendo el ejemplo
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Shield size={14} className="text-white/30" />
                <span className="text-white/30 text-xs">Pago seguro · si no te encanta, te devolvemos el dinero</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── COMPONENTES AUXILIARES ───────────────────────

function StatBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="text-white/50 w-6 font-bold">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-white/70 w-4 text-right font-bold">{value}</span>
    </div>
  )
}

function ExampleCard({ data, onClick }) {
  const team = TEAMS.find(t => t.id === data.team)
  const ratingColor = data.rating >= 90 ? 'from-[#FFD700] to-[#FFA500]' : data.rating >= 85 ? 'from-[#00D4FF] to-[#0099CC]' : 'from-[#A855F7] to-[#EC4899]'

  return (
    <div className="w-full max-w-[260px] mx-auto cursor-pointer" onClick={onClick}>
      <div className="rounded-2xl overflow-hidden border border-[#FFD700]/30 bg-gradient-to-b from-[#0a0e27] to-[#1a1f4b] shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-[#FFD700]/10 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between p-3">
          <span className="text-[8px] text-white/40 font-bold tracking-wider">FIFA 2026</span>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ratingColor} flex items-center justify-center border border-white/20 shadow-lg`}>
            <span className="text-lg font-black text-white font-bebas">{data.rating}</span>
          </div>
          <div className="w-10 h-12">
            <img src={team?.shield} alt={team?.name} className="w-full h-full object-contain" loading="lazy" />
          </div>
        </div>
        <div className="mx-3 h-36 rounded-xl bg-gradient-to-b from-[#1a1a3e] to-[#0a0a1a] border border-white/10 flex items-center justify-center">
          <Camera size={24} className="text-white/20" />
        </div>
        <div className="text-center py-3">
          <h3 className="text-3xl font-bebas text-[#FFD700] leading-none">{data.name}</h3>
          <p className="text-[#00D4FF] text-[10px] mt-1 font-bold">{data.age} AÑOS · {data.teamName.toUpperCase()}</p>
        </div>
        <div className="mx-3 mb-3 p-2.5 rounded-lg bg-black/30 border border-white/5">
          <StatBar label="RIT" value={data.stats.RIT} color="#FFD700" />
          <StatBar label="PAS" value={data.stats.PAS} color="#00D4FF" />
          <StatBar label="DEF" value={data.stats.DEF} color="#A855F7" />
          <StatBar label="FIS" value={data.stats.FIS} color="#FF6B35" />
        </div>
      </div>
    </div>
  )
}

// ─── HOMEPAGE PRINCIPAL ───────────────────────────

export default function HomePage() {
  const navigate = useNavigate()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-montserrat overflow-x-hidden">
      
      {/* MODAL DE PAGO */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        navigate={navigate}
      />

      {/* SECCIÓN 1 — HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f23] to-[#0a0a1a]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFD700] rounded-full opacity-[0.03] blur-3xl" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/60 tracking-wider uppercase">Usado por +500 familias en Argentina</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bebas tracking-wider leading-[0.9] mb-6"
          >
            <span className="text-white">
              Convertí a tu hijo en
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF6B35] bg-clip-text text-transparent">
              la estrella del partido
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Invitaciones digitales premium estilo FIFA para cumpleañeros de todas las edades. Personalizadas con su foto, su equipo favorito y los datos del evento. ¡Niños, jóvenes y adultos pueden ser la estrella!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* ========== CAMBIO: Va directo al wizard ========== */}
            <button
              onClick={() => navigate('/crear')}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#ec4899] text-white font-bold text-lg tracking-wide flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-[#FF6B35]/30"
            >
              Crear mi invitación
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/invitacion/thiago-8-argentina')}
              className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Ver ejemplo
            </button>

            <button
              onClick={openWhatsApp}
              className="px-8 py-4 rounded-full bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/20"
            >
              <MessageCircle size={20} />
              Hablar por WhatsApp
            </button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={24} className="text-white/20" />
        </motion.div>
      </section>

      {/* SECCIÓN 2 — EQUIPOS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-3">
              ELEGÍ TU <span className="text-[#FFD700]">EQUIPO</span>
            </h2>
            <p className="text-white/40 text-sm">Escudos reales de los clubes más grandes.</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6 md:gap-4">
            {TEAMS.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.15, y: -5 }}
                onClick={() => navigate('/crear')}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-16 h-20 md:w-14 md:h-18 transition-transform">
                  <img src={team.shield} alt={team.name} className="w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-xl" loading="lazy" />
                </div>
                <span className="text-[10px] text-white/50 text-center group-hover:text-white/80 transition-colors">{team.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3 — CÓMO FUNCIONA */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f23] to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-3">
              CÓMO <span className="text-[#FFD700]">FUNCIONA</span>
            </h2>
            <p className="text-white/40 text-sm">Tres pasos. Menos de dos minutos.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FFD700]/30 transition-all text-center"
                >
                  <div className="absolute top-4 right-4 text-5xl font-bebas text-white/[0.03] font-black select-none">
                    0{i + 1}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#ec4899] flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN 4 — GALERÍA */}
      <section id="galeria" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-3">
              ASÍ QUEDAN <span className="text-[#FFD700]">LAS INVITACIONES</span>
            </h2>
            <p className="text-white/40 text-sm">Ejemplos reales de figuritas creadas.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXAMPLES.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ExampleCard 
                  data={ex} 
                  onClick={() => setShowPaymentModal(true)}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            {/* ========== CAMBIO: Va directo al wizard ========== */}
            <button
              onClick={() => navigate('/crear')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#ec4899] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-[#FF6B35]/30"
            >
              Quiero la mía →
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5 — BENEFICIOS */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f23] to-[#0a0a1a]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-3">
              ¿POR QUÉ <span className="text-[#FFD700]">ELEGIR INVITAFIGUS?</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FFD700]/20 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#FF6B35]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{b.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN 6 — TESTIMONIOS */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wider mb-3">
              LO QUE DICEN <span className="text-[#FFD700]">LOS PADRES</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={14} className="text-[#FFD700] fill-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ec4899] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 7 — CTA FINAL */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/5 via-[#ec4899]/5 to-[#FF6B35]/5" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bebas tracking-wider mb-6">
            ¿LISTO PARA CREAR UNA
            <br />
            <span className="text-[#FFD700]">INVITACIÓN INOLVIDABLE?</span>
          </h2>
          <p className="text-white/40 mb-10">
            Tu hijo merece una invitación tan especial como él.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* ========== CAMBIO: Va directo al wizard ========== */}
            <button
              onClick={() => navigate('/crear')}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#ec4899] text-white font-bold text-lg tracking-wide hover:opacity-90 transition-all shadow-xl shadow-[#FF6B35]/30"
            >
              Crear invitación
            </button>

            <button
              onClick={openWhatsApp}
              className="px-10 py-4 rounded-full bg-[#22c55e] text-white font-bold text-lg tracking-wide hover:bg-[#16a34a] transition-all shadow-xl shadow-[#22c55e]/20 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Hablar por WhatsApp
            </button>
          </div>

          <p className="mt-8 text-white/20 text-xs">
            Sin registro. Sin costo. En menos de 2 minutos.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#FFD700]" />
            <span className="text-lg font-bebas text-[#FFD700]">INVITAFIGUS</span>
            <span className="text-white/20 text-xs">2026</span>
          </div>
          <p className="text-white/20 text-xs">
            Invitaciones digitales futboleras para cumpleaños infantiles
          </p>
        </div>
      </footer>
    </div>
  )
}