export default function Watermark() {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: 'rotate(-15deg)',
      }}
    >
      <div 
        style={{
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '0.2em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
        }}
      >
        INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS · INVITAFIGUS ·
      </div>
    </div>
  )
}