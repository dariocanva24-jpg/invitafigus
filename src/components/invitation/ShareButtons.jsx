import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ShareButtons({ event }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `¡Te invito al cumple de ${event?.honoreeName || event?.childName || 'mi hijo'}! 🎉⚽`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-pill-warm inline-flex items-center justify-center gap-2 px-6 py-4"
      >
        <span className="text-xl">💬</span>
        Compartir por WhatsApp
      </a>

      <div className="flex gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-pill-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm"
        >
          <span className="text-xl">📘</span>
          Facebook
        </a>

        <button
          onClick={copyLink}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
            copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-pill-secondary'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '¡Copiado!' : 'Copiar Link'}
        </button>
      </div>
    </div>
  )
}