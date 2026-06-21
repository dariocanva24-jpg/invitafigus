import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teams, getTeamsByCategory } from '../../data/teams';
import { Shield, ChevronRight, Star } from 'lucide-react';

export default function TeamSelector({ onSelect, selectedTeam }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTeam, setHoveredTeam] = useState(null);

  const categories = [
    { id: 'all', label: 'Todos', icon: Shield },
    { id: 'seleccion', label: 'Selecciones', icon: Star },
    { id: 'argentina', label: 'Argentina', icon: Shield },
    { id: 'internacional', label: 'Internacional', icon: Star },
  ];

  const filteredTeams = activeCategory === 'all' 
    ? teams 
    : getTeamsByCategory(activeCategory);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Título */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bebas text-white mb-2 tracking-wider">
          ELEGÍ TU EQUIPO
        </h2>
        <p className="text-gray-400 text-sm md:text-base font-montserrat">
          Seleccioná el escudo para tu invitación futbolera
        </p>
      </motion.div>

      {/* Tabs de categorías */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-figus-orange to-figus-pink text-white shadow-lg shadow-figus-orange/30'
                  : 'bg-figus-card text-gray-300 hover:text-white border border-gray-700'
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Grid de escudos - GRANDES */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTeams.map((team) => {
            const isSelected = selectedTeam?.id === team.id;
            const isHovered = hoveredTeam === team.id;

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredTeam(team.id)}
                onHoverEnd={() => setHoveredTeam(null)}
                onClick={() => onSelect(team)}
                className={`relative cursor-pointer group rounded-2xl p-4 md:p-6 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-figus-orange/20 to-figus-pink/20 border-2 border-figus-orange shadow-xl shadow-figus-orange/20' 
                    : 'bg-figus-card border border-gray-700 hover:border-gray-500'
                }`}
              >
                {/* Badge seleccionado */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-figus-orange text-white rounded-full p-1.5 z-10"
                  >
                    <ChevronRight size={14} />
                  </motion.div>
                )}

                {/* Escudo - GRANDE */}
                <div className="relative w-full aspect-[5/6] mb-3 md:mb-4">
                  <motion.div
                    animate={{
                      filter: isHovered || isSelected ? 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.5))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                    }}
                    className="w-full h-full"
                  >
                    <img 
                      src={team.shield} 
                      alt={team.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </motion.div>
                </div>

                {/* Nombre del equipo */}
                <div className="text-center">
                  <h3 className={`font-bebas text-lg md:text-xl tracking-wider transition-colors ${
                    isSelected ? 'text-figus-orange' : 'text-white group-hover:text-figus-orange'
                  }`}>
                    {team.shortName}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 font-montserrat">
                    {team.name}
                  </p>
                </div>

                {/* Indicador de hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-figus-orange/0 transition-all"
                  animate={{
                    borderColor: isHovered && !isSelected ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 107, 53, 0)'
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Equipo seleccionado - Preview grande */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-figus-card to-figus-dark border border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-40 md:w-40 md:h-48 flex-shrink-0">
                <img 
                  src={selectedTeam.shield} 
                  alt={selectedTeam.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bebas text-white tracking-wider">
                  {selectedTeam.name}
                </h3>
                <p className="text-figus-orange font-montserrat text-sm mt-1">
                  {selectedTeam.category === 'seleccion' 
                    ? `${selectedTeam.worldCups} ⭐ Campeonatos del Mundo` 
                    : `Fundado en ${selectedTeam.foundation}`}
                </p>
                <div className="flex gap-2 mt-3 justify-center md:justify-start">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: selectedTeam.colors.primary }}
                    title="Color principal"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: selectedTeam.colors.secondary }}
                    title="Color secundario"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
