import { motion } from 'framer-motion'

const TEAMS = {
  argentina: { 
    name: 'Argentina', 
    shield: '/escudos/argentina.svg',
    colors: { primary: '#6CACE4', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  boca: { 
    name: 'Boca Juniors', 
    shield: '/escudos/boca.svg',
    colors: { primary: '#1B4F9C', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  river: { 
    name: 'River Plate', 
    shield: '/escudos/river.svg',
    colors: { primary: '#D42A2A', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  racing: { 
    name: 'Racing Club', 
    shield: '/escudos/racing.svg',
    colors: { primary: '#1E90FF', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  independiente: { 
    name: 'Independiente', 
    shield: '/escudos/independiente.svg',
    colors: { primary: '#E31E24', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  sanlorenzo: { 
    name: 'San Lorenzo', 
    shield: '/escudos/sanlorenzo.svg',
    colors: { primary: '#1B4F9C', secondary: '#E31E24', accent: '#1a1a3e' }
  },
  realmadrid: { 
    name: 'Real Madrid', 
    shield: '/escudos/realmadrid.svg',
    colors: { primary: '#FFFFFF', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  brazil: { 
    name: 'Brasil', 
    shield: '/escudos/brazil.svg',
    colors: { primary: '#009739', secondary: '#FFD700', accent: '#1a1a3e' }
  },
  gimnasiajujuy: {
    name: 'Gimnasia Jujuy',
    shield: '/escudos/gimnasiajujuy.svg',
    colors: { primary: '#1B4F9C', secondary: '#FFD700', accent: '#1a1a3e' }
  }
}

function generateStats(name, age) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i)
  hash = Math.abs(hash)
  
  const baseStats = {
    RIT: 60 + (hash % 35),
    PAS: 55 + (hash % 40),
    REG: 50 + (hash % 45),
    DIS: 45 + (hash % 50),
    DEF: 35 + (hash % 45),
    FIS: 60 + (hash % 35),
  }
  
  const ageBoost = Math.max(0, (15 - age) * 2)
  
  const stats = {
    RIT: Math.min(99, baseStats.RIT + ageBoost),
    PAS: Math.min(99, baseStats.PAS + ageBoost),
    REG: Math.min(99, baseStats.REG + ageBoost),
    DIS: Math.min(99, baseStats.DIS + ageBoost),
    DEF: Math.min(99, baseStats.DEF + ageBoost),
    FIS: Math.min(99, baseStats.FIS + ageBoost),
  }
  
  const overall = Math.round((stats.RIT + stats.PAS + stats.REG + stats.DIS + stats.DEF + stats.FIS) / 6)
  
  return { ...stats, overall }
}

function getRarityClass(overall) {
  if (overall >= 85) return { label: 'LEGENDARY', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700, #FFA500)', shadow: '0 0 20px rgba(255,215,0,0.5)' }
  if (overall >= 75) return { label: 'GOLD', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700, #DAA520)', shadow: '0 0 15px rgba(255,215,0,0.4)' }
  if (overall >= 65) return { label: 'SILVER', color: '#C0C0C0', bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', shadow: '0 0 15px rgba(192,192,192,0.4)' }
  return { label: 'BRONZE', color: '#CD7F32', bg: 'linear-gradient(135deg, #CD7F32, #B87333)', shadow: '0 0 15px rgba(205,127,50,0.4)' }
}

export default function PlayerCard({ event }) {
  const team = TEAMS[event?.team] || TEAMS.argentina
  
  // Usamos el nombre completo para generar stats
  const fullNameForStats = `${event?.childName || ''} ${event?.honoreeName || ''}`.trim() || 'Jugador'
  const stats = generateStats(
    fullNameForStats,
    event?.honoreeAge || event?.age || 8
  )
  const rarity = getRarityClass(stats.overall)

  const statItems = [
    { label: 'RIT', value: stats.RIT, name: 'Ritmo', color: '#00D4FF' },
    { label: 'PAS', value: stats.PAS, name: 'Pase', color: '#00FF88' },
    { label: 'REG', value: stats.REG, name: 'Regate', color: '#FF6B35' },
    { label: 'DIS', value: stats.DIS, name: 'Disparo', color: '#FFD700' },
    { label: 'DEF', value: stats.DEF, name: 'Defensa', color: '#9B59B6' },
    { label: 'FIS', value: stats.FIS, name: 'Físico', color: '#E74C3C' },
  ]

  // ========== NOMBRE COMPLETO: childName + nickname + honoreeName ==========
  const displayName = (() => {
    const parts = []
    if (event?.childName) parts.push(event.childName)
    if (event?.nickname) parts.push(`"${event.nickname}"`)
    if (event?.honoreeName) parts.push(event.honoreeName)
    return parts.join(' ') || 'JUGADOR'
  })()

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0f1538 0%, #1a1f4b 20%, #0a0e27 50%, #0f1538 100%)',
          border: `3px solid ${rarity.color}`,
          boxShadow: `${rarity.shadow}, 0 25px 50px rgba(0,0,0,0.5)`,
        }}>

        <div className="absolute inset-0 rounded-3xl pointer-events-none" 
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,215,0,0.1) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="flex items-center justify-between p-4 pt-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-yellow-400 tracking-widest">INVITAFIGUS</span>
              <span className="text-[8px] text-white/50 tracking-widest">EDICIÓN 2026</span>
            </div>
          </div>
          
          <div className="w-12 h-12">
            <img 
              src={team.shield} 
              alt={team.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <div className="relative px-6 py-2">
          <div className="relative mx-auto w-44 h-52 md:w-52 md:h-60 rounded-2xl overflow-hidden"
            style={{
              border: `3px solid ${rarity.color}`,
              boxShadow: `0 0 30px ${rarity.color}33, inset 0 0 30px rgba(0,0,0,0.3)`,
            }}>
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a6c] via-[#2d5a8a] to-[#1a3a6c]">
              <div className="absolute inset-0 opacity-30" 
                style={{
                  background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                }}
              />
            </div>

            <img
              src={
                event?.honoreePhoto ||
                'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop'
              }
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop' }}
            />
            
            <div className="absolute bottom-0 left-0 right-0 h-1/2"
              style={{
                background: `linear-gradient(to top, ${team.colors.primary}ee 0%, ${team.colors.primary}cc 40%, ${team.colors.primary}88 70%, transparent 100%)`,
              }}>
              
              <div className="absolute inset-0 opacity-40"
                style={{
                  background: `repeating-linear-gradient(90deg, ${team.colors.primary} 0px, ${team.colors.primary} 20px, ${team.colors.secondary}22 20px, ${team.colors.secondary}22 40px)`,
                }}
              />
              
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-16">
                <img 
                  src={team.shield} 
                  alt={team.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-xs font-bold text-white drop-shadow-lg tracking-wider uppercase"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {team.name.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-center -mt-2 mb-2">
          <div className="px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase"
            style={{
              background: rarity.bg,
              color: rarity.label === 'LEGENDARY' ? '#1a1a3e' : '#fff',
              boxShadow: rarity.shadow,
              border: `1px solid ${rarity.color}`,
            }}>
            {rarity.label}
          </div>
        </div>

        {/* ========== NOMBRE COMPLETO CON APODO ========== */}
        <div className="text-center px-4 py-2">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide font-bebas leading-tight"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255,215,0,0.3)',
            }}>
            {displayName}
          </h2>
        </div>

        <div className="mx-4 mb-4">
          <div className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(0,30,60,0.9), rgba(0,20,40,0.95))',
              border: `1px solid ${rarity.color}44`,
            }}>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Rating</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: rarity.bg,
                    boxShadow: rarity.shadow,
                    border: `2px solid ${rarity.color}`,
                  }}>
                  <span className="text-xl font-black text-white font-bebas">{stats.overall}</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block">Edad</span>
                <span className="text-2xl font-black text-white font-bebas">{event?.honoreeAge || event?.age || 8}</span>
                <span className="text-[10px] text-white/50 uppercase">años</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {statItems.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-6" style={{ color: stat.color }}>{stat.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`,
                        boxShadow: `0 0 8px ${stat.color}44`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] font-bold w-5 text-right" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-24 right-2 flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            {team.name}
          </span>
        </div>

        <div className="text-center pb-5 pt-1">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-1.5"
            style={{
              background: 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(255,107,53,0.15))',
              border: '1px solid rgba(0,212,255,0.2)',
            }}>
            <span className="text-cyan-300 text-[10px] font-bold tracking-widest uppercase">
              INVITACIÓN ESPECIAL
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}