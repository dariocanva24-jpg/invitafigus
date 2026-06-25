import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import AlbumCover from "../components/invitation/AlbumCover";
import PlayerCard from "../components/invitation/PlayerCard";
import EventInfo from "../components/invitation/EventInfo";
import CountdownTimer from "../components/invitation/CountdownTimer";
import RSVPForm from "../components/invitation/RSVPForm";
import ShareButtons from "../components/invitation/ShareButtons";

const InvitationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getEventBySlug, activateInvitation, setCurrentInvitation } = useApp();
  const event = getEventBySlug(slug);
  const isActive = event?.status === 'active';

  const [showCard, setShowCard] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [albumOpened, setAlbumOpened] = useState(false);

  useEffect(() => {
    if (!event) return;

    const alreadyShown = sessionStorage.getItem(`paymentModalShown_${slug}`);
    if (alreadyShown) return;

    const modalTimer = setTimeout(() => {
      setShowPaymentModal(true);
      sessionStorage.setItem(`paymentModalShown_${slug}`, "true");
    }, 7000);

    return () => clearTimeout(modalTimer);
  }, [event, slug]);

  const handleAlbumOpen = () => {
    setAlbumOpened(true);
    setShowCard(true);
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Invitación pendiente de activación
          </h2>
          <p className="text-gray-400 mb-6">
            Esta invitación aún no fue activada. El organizador debe confirmar el pago para habilitarla.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#FFD700] text-[#0a0e27] font-bold rounded-lg hover:bg-[#e6c200] transition-colors"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  const handleActivateNow = () => {
    if (event?.id) {
      activateInvitation(event.id);
    }
    window.open('https://mpago.la/1X2RD5k', '_blank');
    setShowPaymentModal(false);
  };

  const handleSeeLater = () => {
    if (event?.id) {
      activateInvitation(event.id);
    }
    setShowPaymentModal(false);
  };

  const handleNavigateToCreate = () => {
    setCurrentInvitation(null);
    navigate('/crear');
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
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

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={handleSeeLater}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 w-full max-w-sm"
            >
              <div className="bg-[#1a1f3a] rounded-2xl border border-[#FFD700]/30 overflow-hidden shadow-2xl shadow-[#FFD700]/10">
                <div className="relative px-6 pt-8 pb-6 text-center">
                  <div className="absolute inset-0 bg-[#FFD700]/5" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center border-2 border-[#FFD700]/50"
                    >
                      <span className="text-2xl">✨</span>
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      ¡Tu invitación está lista!
                    </h2>
                    <p className="text-sm text-gray-300">
                      Ya podés verla y compartirla.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">
                    Para activarla definitivamente y recibir:
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { icon: "🔗", text: "Link permanente" },
                      { icon: "📱", text: "Confirmaciones por WhatsApp" },
                      { icon: "🎨", text: "Diseño premium" },
                      { icon: "🛟", text: "Soporte" },
                      { icon: "🚀", text: "Invitación lista para compartir" },
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0e27]/60"
                      >
                        <span className="text-sm">{benefit.icon}</span>
                        <span className="text-sm text-gray-200">{benefit.text}</span>
                        <span className="ml-auto text-[#00D4FF]">✓</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Activala por:</p>
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-3xl font-black text-[#FFD700]"
                  >
                    ARS $10.000
                  </motion.p>
                  <p className="text-xs text-gray-500 mt-1">Activación única · Sin suscripción</p>
                </div>

                <div className="px-6 pb-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleActivateNow}
                    className="w-full py-3.5 bg-[#FFD700] text-[#0a0e27] font-bold text-base rounded-xl hover:bg-[#e6c200] transition-colors shadow-lg shadow-[#FFD700]/20"
                  >
                    Activar ahora
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSeeLater}
                    className="w-full py-3 bg-transparent text-gray-400 font-medium text-sm rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Ver más tarde
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvitationPage;