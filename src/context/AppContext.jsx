import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

const DEMO_INVITATIONS = [
  {
    id: 'inv-demo-thiago-8-argentina',
    slug: 'thiago-8-argentina',
    childName: 'Thiago',
    honoreeName: 'González',
    nickname: 'Torito',
    age: 8,
    honoreeAge: 8,
    team: 'argentina',
    date: '2026-07-15',
    time: '15:00 - 19:00',
    address: 'Club Atlético River Plate, Av. Figueroa Alcorta 7597, Nuñez, CABA',
    location: 'Club Atlético River Plate',
    dressCode: 'Mufa',
    mapsUrl: 'https://maps.google.com/?q=Club+Atlético+River+Plate',
    contactWhatsApp: '5491112345678',
    honoreePhoto: 'https://http2.mlstatic.com/D_NQ_NP_2X_830236-MLA111607638669_052026-T.webp',
    createdAt: new Date().toISOString(),
    rsvpList: [],
    views: 0,
    status: 'active',
  }
];

const STORAGE_KEY = 'invitafigus_data';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const existingSlugs = new Set(parsed.invitations.map(inv => inv.slug));
      const demosToAdd = DEMO_INVITATIONS.filter(demo => !existingSlugs.has(demo.slug));
      return {
        ...parsed,
        invitations: [...demosToAdd, ...parsed.invitations],
      };
    }
  } catch (error) {
    console.error('Error cargando desde localStorage:', error);
  }

  return {
    invitations: [...DEMO_INVITATIONS],
  };
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadFromStorage);
  const [currentInvitation, setCurrentInvitation] = useState(null);

  const createInvitation = useCallback((invitationData) => {
    const newInvitation = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...invitationData,
      createdAt: new Date().toISOString(),
      rsvpList: [],
      views: 0,
    };

    const updated = {
      ...data,
      invitations: [newInvitation, ...data.invitations],
    };

    setData(updated);
    saveToStorage(updated);
    setCurrentInvitation(newInvitation);

    return newInvitation;
  }, [data]);

  const getInvitation = useCallback((id) => {
    return data.invitations.find((inv) => inv.id === id) || null;
  }, [data]);

  const getInvitationBySlug = useCallback((slug) => {
    return data.invitations.find((inv) => inv.slug === slug) || null;
  }, [data]);

  const getEventBySlug = useCallback((slug) => {
    return data.invitations.find((inv) => {
      if (inv.slug === slug) return true;
      const generatedSlug = `${inv.childName?.toLowerCase().replace(/\s+/g, '-')}-${inv.age}-${inv.team?.toLowerCase().replace(/\s+/g, '-')}`;
      return generatedSlug === slug;
    }) || null;
  }, [data]);

  const addRSVP = useCallback((invitationId, rsvpData) => {
    const updated = {
      ...data,
      invitations: data.invitations.map((inv) => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            rsvpList: [
              ...inv.rsvpList,
              {
                id: `rsvp-${Date.now()}`,
                ...rsvpData,
                confirmedAt: new Date().toISOString(),
              },
            ],
          };
        }
        return inv;
      }),
    };

    setData(updated);
    saveToStorage(updated);
  }, [data]);

  const incrementViews = useCallback((invitationId) => {
    const updated = {
      ...data,
      invitations: data.invitations.map((inv) => {
        if (inv.id === invitationId) {
          return { ...inv, views: (inv.views || 0) + 1 };
        }
        return inv;
      }),
    };

    setData(updated);
    saveToStorage(updated);
  }, [data]);

  const deleteInvitation = useCallback((id) => {
    const updated = {
      ...data,
      invitations: data.invitations.filter((inv) => inv.id !== id),
    };

    setData(updated);
    saveToStorage(updated);
  }, [data]);

  const activateInvitation = useCallback((id) => {
    const updated = {
      ...data,
      invitations: data.invitations.map((inv) => {
        if (inv.id === id) {
          return { ...inv, status: 'active' };
        }
        return inv;
      }),
    };

    setData(updated);
    saveToStorage(updated);
  }, [data]);

  const shareWhatsApp = useCallback((invitation) => {
    const slug = invitation.slug || invitation.id;
    const url = `${window.location.origin}/invitacion/${slug}`;
    const text = `🎉 ¡Te invito al cumple de ${invitation.childName}! 🎂\n\n` +
      `⚽ ${invitation.age} años · Equipo: ${invitation.team}\n` +
      `📅 ${new Date(invitation.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}\n` +
      `📍 ${invitation.location || 'A confirmar'}\n\n` +
      `👉 Confirmá tu asistencia acá: ${url}\n\n` +
      `¡Nos vemos! ⚽🎈`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }, []);

  const value = {
    invitations: data.invitations,
    currentInvitation,
    setCurrentInvitation,
    createInvitation,
    getInvitation,
    getInvitationBySlug,
    getEventBySlug,
    addRSVP,
    incrementViews,
    deleteInvitation,
    activateInvitation,
    shareWhatsApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;