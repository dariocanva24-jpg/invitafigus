import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const TEAMS = {
  argentina: { name: 'Argentina', shield: '/escudos/argentina.svg', colors: { primary: '#6CACE4', secondary: '#FFD700' } },
  boca: { name: 'Boca Juniors', shield: '/escudos/boca.svg', colors: { primary: '#1B4F9C', secondary: '#FFD700' } },
  river: { name: 'River Plate', shield: '/escudos/river.svg', colors: { primary: '#D42A2A', secondary: '#FFD700' } },
  racing: { name: 'Racing Club', shield: '/escudos/racing.svg', colors: { primary: '#1E90FF', secondary: '#FFD700' } },
  independiente: { name: 'Independiente', shield: '/escudos/independiente.svg', colors: { primary: '#E31E24', secondary: '#FFD700' } },
  sanlorenzo: { name: 'San Lorenzo', shield: '/escudos/sanlorenzo.svg', colors: { primary: '#1B4F9C', secondary: '#E31E24' } },
  realmadrid: { name: 'Real Madrid', shield: '/escudos/realmadrid.svg', colors: { primary: '#FFFFFF', secondary: '#FFD700' } },
  brazil: { name: 'Brasil', shield: '/escudos/brazil.svg', colors: { primary: '#009739', secondary: '#FFD700' } },
  gimnasiajujuy: { name: 'Gimnasia Jujuy', shield: '/escudos/gimnasiajujuy.svg', colors: { primary: '#1B4F9C', secondary: '#FFD700' } },
}

export default function AlbumCover({ honoreeName, team, onOpen }) {
  const [phase, setPhase] = useState('idle') // idle → touching → tearing → revealing → done
  const [tearProgress, setTearProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const teamData = TEAMS[team] || TEAMS.argentina

  const handleTouch = () => {
    if (phase !== 'idle') return
    setPhase('touching')

    // Secuencia de animación acelerada (2 segundos total)
    setTimeout(() => setPhase('tearing'), 400)
    setTimeout(() => setPhase('revealing'), 900)
    setTimeout(() => setPhase('done'), 1600)
    setTimeout(() => {
      if (typeof onOpen === 'function') {
        onOpen()
      }
      setTimeout(() => setIsExiting(true), 200)
    }, 1800)
  }

  // Animación de progreso del rasgado
  useEffect(() => {
    if (phase === 'tearing') {
      const interval = setInterval(() => {
        setTearProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 4 // Más rápido
        })
      }, 15)
      return () => clearInterval(interval)
    }
  }, [phase])

  if (isExiting) {
    return null
  }

  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-8">
      {/* Fondo oscuro premium */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a1a] to-[#050505] -z-10" />

      {/* Glow ambiental del equipo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
        style={{ background: `radial-gradient(circle, ${teamData.colors.primary}30, transparent)` }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] font-bold text-white/30 tracking-[0.4em] uppercase">
              InvitaFigus · Edición 2026
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <h1 className="text-xl font-light text-white/60 tracking-wide mb-1">
            El álbum de
          </h1>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 50%, #fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            {honoreeName}
          </h2>
        </motion.div>

        {/* SOBRE ESTILO PANINI DELUXE PACK */}
        <div className="relative w-64 h-80 md:w-72 md:h-96">
          <AnimatePresence mode="wait">

            {/* FASE 1: SOBRE CERRADO - ESTILO PAQUETE REAL */}
            {phase === 'idle' && (
              <motion.div
                key="envelope"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                className="absolute inset-0 cursor-pointer group"
                onClick={handleTouch}
              >
                {/* Glow exterior */}
                <div className="absolute -inset-4 rounded-2xl opacity-40 blur-xl"
                  style={{ background: `linear-gradient(135deg, ${teamData.colors.primary}30, transparent, ${teamData.colors.secondary}20)` }}
                />

                {/* PAQUETE PRINCIPAL */}
                <div className="relative w-full h-full rounded-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 50%, #1a1a2e 100%)',
                    boxShadow: `
                      0 20px 60px rgba(0,0,0,0.6),
                      0 0 0 1px rgba(255,255,255,0.08),
                      inset 0 1px 0 rgba(255,255,255,0.05)
                    `,
                  }}
                >
                  {/* Marco punteado estilo Panini */}
                  <div className="absolute inset-2 border border-dashed border-white/15 rounded-md" />

                  {/* Esquinas decorativas */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]/40" />

                  {/* Patrón de fondo sutil */}
                  <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="hex-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                          <polygon points="15,2 28,8 28,22 15,28 2,22 2,8" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#hex-pattern)"/>
                    </svg>
                  </div>

                  {/* Contenido del paquete */}
                  <div className="relative h-full flex flex-col items-center justify-between p-5">

                    {/* Top - FIFA WORLD CUP 2026 */}
                    <div className="w-full text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-white/5 border border-white/10">
                        <span className="text-[8px] font-bold text-white/40 tracking-[0.3em]">FIFA WORLD CUP</span>
                      </div>
                    </div>

                    {/* Center - Número 26 y trofeo */}
                    <div className="flex flex-col items-center">
                      {/* Número 26 grande */}
                      <div className="relative">
                        <span className="text-7xl font-black text-white/10 tracking-tighter">26</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-5xl font-black tracking-tight"
                            style={{
                              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                            }}>
                            26
                          </span>
                        </div>
                      </div>

                      {/* Trofeo dorado emoji */}
                      <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="text-4xl my-2"
                      >
                        🏆
                      </motion.div>

                      <p className="text-white/80 text-xs font-black tracking-[0.2em] uppercase">
                        FIFA
                      </p>
                    </div>

                    {/* Bottom - DELUXE PACK + PANINI */}
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        {/* DELUXE PACK */}
                        <div className="text-left">
                          <p className="text-[9px] font-bold text-white/50 tracking-wider leading-tight">DELUXE</p>
                          <p className="text-[9px] font-bold text-white/50 tracking-wider leading-tight">PACK</p>
                        </div>

                        {/* Logo PANINI estilo */}
                        <div className="px-3 py-1.5 rounded"
                          style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
                          }}>
                          <span className="text-[10px] font-black text-[#1a1a3e] tracking-wider">PANINI</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reflejo de plástico */}
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>

                {/* Indicador de toque - CENTRADO Y ELEGANTE */}
                <motion.div
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-2 group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-white/50 group-hover:text-white/70">
                      <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium">Tocá para abrir</span>
                </motion.div>
              </motion.div>
            )}

            {/* FASE 2: TOCANDO */}
            {phase === 'touching' && (
              <motion.div
                key="touching"
                initial={{ scale: 1 }}
                animate={{ scale: 0.95 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-64 h-80 md:w-72 md:h-96 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-[#FFD700]/30 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/50" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* FASE 3: RASGANDO */}
            {phase === 'tearing' && (
              <motion.div
                key="tearing"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-64 h-80 md:w-72 md:h-96">
                  <motion.div
                    className="absolute top-0 left-0 right-0 overflow-hidden"
                    style={{ height: `${50 - tearProgress * 0.5}%` }}
                    animate={{ rotateX: tearProgress * 1.5, y: -tearProgress * 0.3 }}
                    transition={{ duration: 0 }}
                  >
                    <div className="w-64 h-80 md:w-72 md:h-96 rounded-t-lg bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border-2 border-[#FFD700]/20" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 overflow-hidden"
                    style={{ height: `${50 - tearProgress * 0.5}%` }}
                    animate={{ rotateX: -tearProgress * 1.5, y: tearProgress * 0.3 }}
                    transition={{ duration: 0 }}
                  >
                    <div className="w-64 h-80 md:w-72 md:h-96 rounded-b-lg bg-gradient-to-t from-[#1a1a2e] to-[#0f0f1a] border-2 border-[#FFD700]/20" />
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
                    style={{ opacity: tearProgress / 100 }}
                    animate={{ boxShadow: `0 0 ${tearProgress / 3}px ${tearProgress / 8}px rgba(255,215,0,0.6)` }}
                  />

                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#FFD700]"
                    animate={{ opacity: tearProgress / 150, scale: 1 + tearProgress / 80 }}
                    style={{ filter: 'blur(20px)' }}
                  />
                </div>
              </motion.div>
            )}

            {/* FASE 4: REVELANDO */}
            {phase === 'revealing' && (
              <motion.div
                key="revealing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 3, 2], opacity: [0, 1, 0.3] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-40 h-40 rounded-full bg-[#FFD700]"
                  style={{ filter: 'blur(60px)' }}
                />

                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#FFD700] rounded-full"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 250,
                      y: (Math.random() - 0.5) * 250,
                    }}
                    transition={{ duration: 1, delay: Math.random() * 0.4 }}
                  />
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: [0, 0.3, 0.6, 1], scale: [0.5, 0.8, 1.1, 1], y: [50, 20, -10, 0] }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative"
                >
                  <div className="w-44 h-60 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border-2 border-[#FFD700]/50 flex items-center justify-center"
                    style={{ boxShadow: '0 0 60px rgba(255,215,0,0.3)' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 rounded-full border-2 border-[#FFD700]/50 border-t-[#FFD700]"
                    />
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-12 text-[#FFD700] text-sm font-bold tracking-widest uppercase"
                >
                  Revelando figurita...
                </motion.p>
              </motion.div>
            )}

            {/* FASE 5: DONE */}
            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-44 h-60 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] opacity-50 blur-xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex items-center gap-4"
        >
          <div className="h-px w-8 bg-white/10" />
          <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">
            Invitaciones digitales premium
          </span>
          <div className="h-px w-8 bg-white/10" />
        </motion.div>
      </div>
    </div>
  )
}