export default function Watermark() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
      style={{ transform: 'rotate(-15deg)' }}
    >
      <div 
        className="text-white/10 text-4xl md:text-6xl font-black font-bebas tracking-widest whitespace-nowrap select-none"
        style={{
          textShadow: '0 0 20px rgba(255,215,0,0.1)',
        }}
      >
        INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS ·
      </div>
    </div>
  )
}