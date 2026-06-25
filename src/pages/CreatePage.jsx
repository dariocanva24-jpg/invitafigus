import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Camera, Check, X, Star, Calendar, Clock, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PlayerCard from '../components/invitation/PlayerCard'
import Watermark from '../components/invitation/Watermark'
import { sendToGoogleForm } from '../services/googleForm'

const WHATSAPP_NUMBER = '5493885212331'

const TEAMS = [
  { id: 'argentina', name: 'Argentina', shield: '/escudos/argentina.svg', colors: { primary: '#6CACE4', secondary: '#FFD700' } },
  { id: 'boca', name: 'Boca Juniors', shield: '/escudos/boca.svg', colors: { primary: '#1B4F9C', secondary: '#FFD700' } },
  { id: 'river', name: 'River Plate', shield: '/escudos/river.svg', colors: { primary: '#D42A2A', secondary: '#FFD700' } },
  { id: 'racing', name: 'Racing Club', shield: '/escudos/racing.svg', colors: { primary: '#1E90FF', secondary: '#FFD700' } },
  { id: 'independiente', name: 'Independiente', shield: '/escudos/independiente.svg', colors: { primary: '#E31E24', secondary: '#FFD700' } },
  { id: 'sanlorenzo', name: 'San Lorenzo', shield: '/escudos/sanlorenzo.svg', colors: { primary: '#1B4F9C', secondary: '#E31E24' } },
  { id: 'realmadrid', name: 'Real Madrid', shield: '/escudos/realmadrid.svg', colors: { primary: '#FFFFFF', secondary: '#FFD700' } },
  { id: 'brazil', name: 'Brasil', shield: '/escudos/brazil.svg', colors: { primary: '#009739', secondary: '#FFD700' } },
  { id: 'gimnasiajujuy', name: 'Gimnasia Jujuy', shield: '/escudos/gimnasiajujuy.svg', colors: { primary: '#1B4F9C', secondary: '#FFD700' } },
]

export default function CreatePage() {
  const navigate = useNavigate()
  const { createInvitation } = useApp()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [createdInvitation, setCreatedInvitation] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('idle')

  const [formData, setFormData] = useState({
    childName: '',
    honoreeName: '',
    honoreeAge: '',
    nickname: '',
    team: 'argentina',
    date: '',
    startTime: '',
    endTime: '',
    address: '',
    location: '',
    contactWhatsApp: '',
    email: '',
    honoreePhoto: '',
    message: '',
    dressCode: '',
  })

  const [errors, setErrors] = useState({})

  const totalSteps = 5

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1)
      } else {
        handlePreview()
      }
    }
  }

  const validateStep = () => {
    const newErrors = {}
    switch (step) {
      case 1:
        if (!formData.honoreePhoto) newErrors.honoreePhoto = 'Subí una foto'
        break
      case 2:
        if (!formData.team) newErrors.team = 'Elegí un equipo'
        break
      case 3:
        if (!formData.childName.trim()) newErrors.childName = 'El nombre es obligatorio'
        if (!formData.honoreeAge) newErrors.honoreeAge = 'La edad es obligatoria'
        break
      case 4:
        if (!formData.date) newErrors.date = 'La fecha es obligatoria'
        if (!formData.startTime) newErrors.startTime = 'El horario de inicio es obligatorio'
        if (!formData.endTime) newErrors.endTime = 'El horario de fin es obligatorio'
        if (!formData.address) newErrors.address = 'La dirección es obligatoria'
        break
      case 5:
        if (!formData.email) newErrors.email = 'El email es obligatorio'
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setFormData({ ...formData, honoreePhoto: reader.result })
        setErrors({ ...errors, honoreePhoto: null })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePreview = async () => {
    setIsLoading(true)
    try {
      await sendToGoogleForm({
        nombre: formData.childName,
        edad: formData.honoreeAge,
        equipo: TEAMS.find(t => t.id === formData.team)?.name || formData.team,
        fecha: formData.date,
        hora: `${formData.startTime} - ${formData.endTime}`,
        lugar: formData.location || formData.address,
        contacto: `${formData.honoreeName || formData.childName} (padre/madre)`,
        telefono: formData.contactWhatsApp,
        email: formData.email
      })
    } catch (error) {
      console.error('Error sendToGoogleForm:', error)
    }

    setTimeout(() => {
      try {
        const invitation = createInvitation({
          ...formData,
          honoreeAge: parseInt(formData.honoreeAge),
          time: `${formData.startTime} - ${formData.endTime}`,
          slug: `${formData.childName.toLowerCase().replace(/\s+/g, '-')}-${formData.honoreeAge}-${formData.team}`,
          status: 'preview',
        })
        setCreatedInvitation(invitation)
        setStep(6)
        setIsLoading(false)
      } catch (error) {
        console.error('Error en createInvitation:', error)
        setIsLoading(false)
      }
    }, 2500)
  }

  const handleActivate = () => {
    window.open('https://mpago.la/1X2RD5k', '_blank')
    setShowPaymentModal(false)
    setPaymentStatus('pending')
  }

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-montserrat">
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => step > 1 && step !== 6 ? handleBack() : navigate('/')}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {step > 1 && step !== 6 ? <ChevronLeft size={20} /> : <X size={20} />}
            </button>
            <div>
              {step !== 6 && (
                <>
                  <span className="text-[10px] text-white/30 tracking-widest uppercase">Paso {step} / {totalSteps}</span>
                  <div className="flex gap-1 mt-1">
                    {[...Array(totalSteps)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-300 ${i < step ? 'w-8 bg-[#FFD700]' : 'w-8 bg-white/10'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              {step === 6 && (
                <span className="text-[10px] text-[#FFD700] tracking-widest uppercase">Preview</span>
              )}
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="pt-24 pb-32 px-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">Figurita 1</span>
                <h2 className="text-3xl font-black font-bebas tracking-wider mt-2">Subí una foto</h2>
                <p className="text-white/40 text-sm mt-2">De frente, buena luz, que se vea bien la cara. La magia depende de esto.</p>
              </div>
              <div onClick={() => fileInputRef.current?.click()} className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${errors.honoreePhoto ? 'border-red-500/50 bg-red-500/5' : 'border-white/20 hover:border-[#FFD700]/50 bg-white/[0.02]'}`}>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-32 h-40 object-cover rounded-xl mx-auto" />
                    <button onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setFormData({ ...formData, honoreePhoto: '' }) }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4"><Camera size={28} className="text-[#FFD700]" /></div>
                    <p className="text-white/60 font-medium">Tocá para subir foto</p>
                    <p className="text-white/30 text-xs mt-1">JPG, PNG · Máx 5MB</p>
                  </>
                )}
              </div>
              {errors.honoreePhoto && <p className="text-red-400 text-xs text-center">{errors.honoreePhoto}</p>}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10">
                <Check size={16} className="text-[#FFD700] mt-0.5 flex-shrink-0" />
                <p className="text-white/50 text-xs">La imagen que subas se ELIMINA una vez creada la figurita y NO permanece en nuestro sistema.</p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">Figurita 1</span>
                <h2 className="text-3xl font-black font-bebas tracking-wider mt-2">Elegí el equipo</h2>
                <p className="text-white/40 text-sm mt-2">La camiseta de tu equipo, con escudo propio.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TEAMS.map((team) => (
                  <button key={team.id} onClick={() => updateField('team', team.id)} className={`p-4 rounded-xl border transition-all ${formData.team === team.id ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                    <div className="w-12 h-12 mx-auto mb-2"><img src={team.shield} alt={team.name} className="w-full h-full object-contain" /></div>
                    <p className="text-[10px] text-white/60 text-center">{team.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">Figurita 1</span>
                <h2 className="text-3xl font-black font-bebas tracking-wider mt-2">Los datos del crack</h2>
                <p className="text-white/40 text-sm mt-2">Los datos del cumpleañero, sin importar la edad. ¡Todos pueden ser la estrella!</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Nombre</label>
                  <input type="text" value={formData.childName} onChange={(e) => updateField('childName', e.target.value)} placeholder="Thiago" className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.childName ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                  {errors.childName && <p className="text-red-400 text-xs mt-1">{errors.childName}</p>}
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Apellido <span className="text-white/30">(opcional)</span></label>
                  <input type="text" value={formData.honoreeName} onChange={(e) => updateField('honoreeName', e.target.value)} placeholder="González" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Apodo <span className="text-white/30">(opcional)</span></label>
                  <input type="text" value={formData.nickname} onChange={(e) => updateField('nickname', e.target.value)} placeholder="El Pulga" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Edad</label>
                  <input type="number" value={formData.honoreeAge} onChange={(e) => updateField('honoreeAge', e.target.value)} placeholder="8" min="1" max="18" className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.honoreeAge ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                  {errors.honoreeAge && <p className="text-red-400 text-xs mt-1">{errors.honoreeAge}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">Casi listo</span>
                <h2 className="text-3xl font-black font-bebas tracking-wider mt-2">Los datos del cumple</h2>
                <p className="text-white/40 text-sm mt-2">Cuándo, dónde y cómo confirmar.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Fecha del evento</label>
                  <input type="date" value={formData.date} onChange={(e) => updateField('date', e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.date ? 'border-red-500/50' : 'border-white/10'} text-white focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Desde</label>
                    <input type="time" value={formData.startTime} onChange={(e) => updateField('startTime', e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.startTime ? 'border-red-500/50' : 'border-white/10'} text-white focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                    {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime}</p>}
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Hasta</label>
                    <input type="time" value={formData.endTime} onChange={(e) => updateField('endTime', e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.endTime ? 'border-red-500/50' : 'border-white/10'} text-white focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                    {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Lugar</label>
                  <input type="text" value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Club Atlético River Plate" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Dirección</label>
                  <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Av. Figueroa Alcorta 7597, CABA" className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.address ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">WhatsApp para confirmar</label>
                  <div className="flex gap-2">
                    <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 flex items-center"><span className="text-sm">🇦🇷 +54</span></div>
                    <input type="tel" value={formData.contactWhatsApp} onChange={(e) => updateField('contactWhatsApp', e.target.value.replace(/\D/g, ''))} placeholder="9 11 1234 5678" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Vestimenta / Pilcha <span className="text-white/30">(opcional)</span></label>
                  <input type="text" value={formData.dressCode} onChange={(e) => updateField('dressCode', e.target.value)} placeholder="Casual, de sport, de gala..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <span className="text-[10px] text-[#FFD700] tracking-[0.3em] uppercase">Casi listo</span>
                <h2 className="text-3xl font-black font-bebas tracking-wider mt-2">¿Le dejás un mensajito?</h2>
                <p className="text-white/40 text-sm mt-2">Un texto corto que aparece debajo de la figurita. Es opcional.</p>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Tu mensaje <span className="text-white/30">(opcional)</span></label>
                <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} placeholder="¡Nos vemos en mi cumple! Traer pelota ⚽" rows={3} maxLength={100} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors resize-none" />
                <p className="text-white/20 text-xs mt-1 text-right">{formData.message.length}/100</p>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Email <span className="text-white/30">(para guardar tu invitación)</span></label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="vos@email.com" className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-white/30 focus:border-[#FFD700]/50 focus:outline-none transition-colors`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">Resumen</p>
                <div className="flex items-center gap-3">
                  {previewUrl && <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <p className="text-white font-bold text-sm">{formData.childName || 'Tu hijo'}</p>
                    <p className="text-white/40 text-xs">{formData.honoreeAge || '--'} años · {TEAMS.find(t => t.id === formData.team)?.name || 'Argentina'}</p>
                    <p className="text-white/40 text-xs">{formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : '--'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && createdInvitation && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="text-center mb-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                  <Star size={28} className="text-[#FFD700]" />
                </motion.div>
                <h2 className="text-3xl font-black font-bebas tracking-wider">¡Tu figurita está lista!</h2>
                <p className="text-white/40 text-sm mt-2">Vista previa con marca de agua. Al pagar, recibís la versión HD sin marca lista para compartir.</p>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="relative">
                  <PlayerCard event={createdInvitation} />
                  <Watermark />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <Calendar size={16} className="text-[#FFD700]" />
                  <div><p className="text-white/40 text-[10px] uppercase tracking-wider">Fecha</p><p className="text-white text-sm">{formData.date || '--'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <Clock size={16} className="text-[#FFD700]" />
                  <div><p className="text-white/40 text-[10px] uppercase tracking-wider">Horario</p><p className="text-white text-sm">{formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : '--'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <MapPin size={16} className="text-[#FFD700]" />
                  <div><p className="text-white/40 text-[10px] uppercase tracking-wider">Lugar</p><p className="text-white text-sm">{formData.location || formData.address || '--'}</p></div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="pt-4">
                {paymentStatus === 'idle' && (
                  <>
                    <button onClick={() => setShowPaymentModal(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0e27] font-bold text-lg tracking-wide hover:opacity-90 transition-all shadow-lg shadow-[#FFD700]/20">
                      Activar mi invitación · ARS $10.000
                    </button>
                    <p className="text-center text-white/30 text-xs mt-3">
                      La preview tiene marca de agua. Pagá para recibir la versión HD sin marca.
                    </p>
                  </>
                )}
                {paymentStatus === 'pending' && (
                  <div className="text-center p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
                    <p className="text-[#FFD700] font-bold mb-2">⏳ Esperando confirmación de pago</p>
                    <p className="text-white/60 text-sm mb-4">
                      Una vez que pagues, envianos el comprobante por WhatsApp para activar tu invitación.
                    </p>
                    <button 
                      onClick={() => {
                        const mensaje = `Hola! Acabo de pagar la invitación de ${formData.childName}. ¿Podés activarla?`
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank')
                      }}
                      className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#16a34a] transition-all"
                    >
                      📱 Enviar comprobante por WhatsApp
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl">
            <div className="text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6">
                <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 border border-[#FFD700]/30 mx-auto flex items-center justify-center relative overflow-hidden">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><Star size={32} className="text-[#FFD700]" /></motion.div>
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/20 to-transparent" animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                </div>
              </motion.div>
              <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-black font-bebas text-[#FFD700] mb-2">Creando la figurita...</motion.h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/40 text-sm">Buscando la mejor pose...</motion.p>
              <div className="w-48 h-1 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: "easeInOut" }} />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showPaymentModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative z-10 w-full max-w-sm">
                <div className="bg-[#1a1f3a] rounded-2xl border border-[#FFD700]/30 overflow-hidden shadow-2xl shadow-[#FFD700]/10">
                  <div className="relative px-6 pt-8 pb-6 text-center">
                    <div className="absolute inset-0 bg-[#FFD700]/5" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-3xl" />
                    <div className="relative">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center border-2 border-[#FFD700]/50"><span className="text-2xl">✨</span></motion.div>
                      <h2 className="text-xl font-bold text-white mb-2">¡Activá tu invitación!</h2>
                      <p className="text-sm text-gray-300">{formData.childName} ya tiene su figurita lista.</p>
                    </div>
                  </div>
                  <div className="px-6 pb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">Para activarla definitivamente y recibir:</p>
                    <div className="space-y-2.5">
                      {[{ icon: "🔗", text: "Link permanente" }, { icon: "📱", text: "Confirmaciones por WhatsApp" }, { icon: "🎨", text: "Diseño premium" }, { icon: "🛟", text: "Soporte" }, { icon: "🚀", text: "Invitación lista para compartir" }].map((benefit, index) => (
                        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0e27]/60">
                          <span className="text-sm">{benefit.icon}</span><span className="text-sm text-gray-200">{benefit.text}</span><span className="ml-auto text-[#00D4FF]">✓</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Activala por:</p>
                    <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }} className="text-3xl font-black text-[#FFD700]">ARS $10.000</motion.p>
                    <p className="text-xs text-gray-500 mt-1">Activación única · Sin suscripción</p>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleActivate} className="w-full py-3.5 bg-[#FFD700] text-[#0a0e27] font-bold text-base rounded-xl hover:bg-[#e6c200] transition-colors shadow-lg shadow-[#FFD700]/20">Pagar y activar ahora</motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPaymentModal(false)} className="w-full py-3 bg-transparent text-gray-400 font-medium text-sm rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-300 transition-colors">Ver más tarde</motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {step <= 5 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
            <div className="max-w-lg mx-auto flex gap-3">
              {step > 1 && <button onClick={handleBack} className="px-6 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">Atrás</button>}
              <button onClick={handleNext} className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1a1a3e] font-bold text-lg tracking-wide hover:opacity-90 transition-all shadow-lg shadow-[#FFD700]/20">{step === totalSteps ? 'Ver mi figurita →' : 'Continuar →'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}