import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer({ date, time }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false })

  useEffect(() => {
    if (!date || date === '') return
    
    const calc = () => {
      // ← FIX: Parsear fecha correctamente
      let targetDate
      
      if (typeof date === 'string') {
        // Si viene como "2026-07-04T03:00:00.000Z" o "2026-07-04"
        const dateOnly = date.split('T')[0] // "2026-07-04"
        const startHour = time?.split(' - ')[0] || '00:00'
        targetDate = new Date(`${dateOnly}T${startHour}:00`)
      } else {
        targetDate = new Date(date)
      }
      
      if (isNaN(targetDate.getTime())) return
      
      const diff = targetDate - new Date()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return
      }
      
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isExpired: false,
      })
    }
    
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [date, time])

  const units = [
    { value: timeLeft.days, label: 'DÍAS', color: '#FFD700' },
    { value: timeLeft.hours, label: 'HRS', color: '#00D4FF' },
    { value: timeLeft.minutes, label: 'MIN', color: '#FF6B35' },
    { value: timeLeft.seconds, label: 'SEG', color: '#a855f7' },
  ]

  if (timeLeft.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(236,72,153,0.2))',
          border: '1px solid rgba(255,107,53,0.3)',
          boxShadow: '0 0 30px rgba(255,107,53,0.2)',
        }}>
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-orange-300 font-bold text-xl font-bebas tracking-wider"
          style={{ textShadow: '0 0 20px rgba(255,107,53,0.5)' }}>
          ¡El evento ya comenzó!
        </motion.p>
        <p className="text-white/60 text-sm mt-1">¡No te lo pierdas!</p>
      </motion.div>
    )
  }

  return (
    <div className="flex justify-center gap-2 md:gap-4">
      {units.map((unit, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${unit.color}20, ${unit.color}10)`,
              border: `1px solid ${unit.color}40`,
              boxShadow: `0 0 20px ${unit.color}20, inset 0 1px 0 ${unit.color}30`,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(105deg, transparent 40%, ${unit.color}10 50%, transparent 60%)`,
                backgroundSize: '200% 200%',
                animation: 'shine 3s ease-in-out infinite',
                animationDelay: `${i * 0.5}s`,
              }} />
            <motion.span
              key={unit.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl md:text-3xl font-black text-white font-bebas relative z-10"
              style={{
                color: unit.color,
                textShadow: `0 0 20px ${unit.color}80`,
              }}>
              {String(unit.value).padStart(2, '0')}
            </motion.span>
          </motion.div>
          <span className="text-[9px] font-bold text-white/40 mt-2 uppercase tracking-widest">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  )
}