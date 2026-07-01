import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { fetchInvitationBySlug, incrementViewsRemote } from "../services/googleSheetsApi";
import AlbumCover from "../components/invitation/AlbumCover";
import PlayerCard from "../components/invitation/PlayerCard";
import EventInfo from "../components/invitation/EventInfo";
import CountdownTimer from "../components/invitation/CountdownTimer";
import RSVPForm from "../components/invitation/RSVPForm";
import ShareButtons from "../components/invitation/ShareButtons";

const WHATSAPP_NUMBER = '5493885212331';

const InvitationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getEventBySlug, setCurrentInvitation } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCard, setShowCard] = useState(false);
  const [albumOpened, setAlbumOpened] = useState(false);

  useEffect(() => {
    const loadInvitation = async () => {
      setLoading(true);
      try {
        const remoteEvent = await fetchInvitationBySlug(slug);
        
        if (remoteEvent) {
          const localData = JSON.parse(localStorage.getItem('invitafigus_data') || '{}');
          const localInv = localData.invitations?.find(inv => inv.slug === slug);
          const fotoFromAdmin = localStorage.getItem(`foto_${slug}`);
          
          // ← FIX: Leer campos con salto de linea al final (bug del Google Sheet)
          const apellido = remoteEvent['Apellido\n'] || remoteEvent.Apellido || remoteEvent.apellido || remoteEvent['Apellido '] || '';
          const apodo = remoteEvent['Apodo\n'] || remoteEvent.Apodo || remoteEvent.apodo || remoteEvent['Apodo '] || '';
          const mensaje = remoteEvent['Mensaje\n'] || remoteEvent.Mensaje || remoteEvent.mensaje || remoteEvent['Mensaje '] || '';
          const vestimenta = remoteEvent['Vestimenta\n'] || remoteEvent.Vestimenta || remoteEvent.vestimenta || remoteEvent['Vestimenta '] || '';
          
          const mappedEvent = {
            id: `inv-${remoteEvent.slug}`,
            slug: remoteEvent.slug,
            childName: remoteEvent.nombre,
            honoreeName: apellido,
            nickname: apodo,
            age: remoteEvent.edad,
            honoreeAge: remoteEvent.edad,
            team: remoteEvent.equipo?.toLowerCase().replace(/\s+/g, '-') || 'argentina',
            date: remoteEvent.fecha,
            time: remoteEvent.hora,
            address: remoteEvent.lugar,
            location: remoteEvent.lugar,
            dressCode: vestimenta,
            mapsUrl: remoteEvent.maps_url,
            contactWhatsApp: remoteEvent.telefono,
            honoreePhoto: remoteEvent.foto_url || fotoFromAdmin || localInv?.honoreePhoto || '',
            message: mensaje,
            status: remoteEvent.estado?.toLowerCase(),
            views: remoteEvent.views,
          };
          setEvent(mappedEvent);
          
          incrementViewsRemote(slug).catch(() => {});
        } else {
          const localEvent = getEventBySlug(slug);
          setEvent(localEvent);
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        const localEvent = getEventBySlug(slug);
        setEvent(localEvent);
        if (!localEvent) {
          setError('Invitación no encontrada');
        }
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [slug, getEventBySlug]);

  const handleAlbumOpen = () => {
    setAlbumOpened(true);
    setShowCard(true);
  };

  const handleNavigateToCreate = () => {
    setCurrentInvitation(null);
    navigate('/crear');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
            <span className="text-3xl">⚽</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Creá tu invitación!
          </h2>
          <p className="text-gray-400 mb-6">
            Esta invitación está en proceso o aún no fue creada. Convertí a tu hijo en la estrella del partido.
          </p>
          <button
            onClick={() => navigate('/crear')}
            className="w-full px-6 py-3 bg-[#FFD700] text-[#0a0e27] font-bold rounded-lg hover:bg-[#e6c200] transition-colors mb-3"
          >
            Crear mi invitación
          </button>
          <button
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
            className="w-full px-6 py-3 bg-[#22c55e] text-white font-bold rounded-lg hover:bg-[#16a34a] transition-colors"
          >
            📱 Consultar por WhatsApp
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 max-w-md mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-4 pb-24">
        <AnimatePresence>
          {!albumOpened && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.5 } }}
              className="mb-6"
            >
              <AlbumCover 
                honoreeName={event.honoreeName || event.childName} 
                team={event.team} 
                onOpen={handleAlbumOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-6"
            >
              <PlayerCard event={event} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <EventInfo event={event} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-6"
            >
              <CountdownTimer date={event.date} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-6"
            >
              <RSVPForm event={event} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mb-6"
            >
              <ShareButtons event={event} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="pt-4 pb-8"
            >
              <div className="h-px w-full bg-white/10 mb-6" />
              <div className="text-center space-y-4">
                <p className="text-white/40 text-sm">
                  ¿Te gustó? Creá la tuya
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNavigateToCreate}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#ec4899] text-white font-bold text-base tracking-wide hover:opacity-90 transition-all shadow-lg shadow-[#FF6B35]/20"
                >
                  Volver y crear la mía →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvitationPage;