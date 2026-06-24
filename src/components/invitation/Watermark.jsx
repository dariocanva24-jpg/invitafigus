export default function Watermark() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center"
      style={{ 
        transform: 'rotate(-15deg)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="text-white/15 text-3xl md:text-5xl font-black font-bebas tracking-widest whitespace-nowrap select-none"
        style={{
          textShadow: '0 0 30px rgba(255,215,0,0.2)',
        }}
      >
        INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS ·
      </div>
    </div>
  )
}