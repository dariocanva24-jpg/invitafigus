// ============================================
// INVITAFIGUS - CLIENTE API PARA GOOGLE SHEETS
// ============================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOfgvIPsnXLqUJFamQLIYT4Gp2uFwoAa9bmrTHFWUDB1QuP5VC41Q5J9wgJ6AGz1JebA/exec';

/**
 * Obtiene todas las invitaciones (para el panel admin)
 */
export async function fetchAllInvitations() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getAll`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener invitaciones');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetchAllInvitations:', error);
    throw error;
  }
}

/**
 * Obtiene una invitación por slug (para InvitationPage)
 */
export async function fetchInvitationBySlug(slug) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getBySlug&slug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Invitación no encontrada');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetchInvitationBySlug:', error);
    throw error;
  }
}

/**
 * Activa una invitación (cambia estado a ACTIVA)
 */
export async function activateInvitationRemote(slug) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=updateStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        slug,
        status: 'ACTIVA',
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al activar');
    }
    
    return data;
  } catch (error) {
    console.error('Error activateInvitationRemote:', error);
    throw error;
  }
}

/**
 * Elimina una invitación (soft delete - marca como ELIMINADA)
 */
export async function deleteInvitationRemote(slug) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=deleteRow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        slug,
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al eliminar');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleteInvitationRemote:', error);
    throw error;
  }
}

/**
 * Actualiza un campo de una invitación
 */
export async function updateInvitationField(slug, field, value) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=updateField`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        slug,
        field,
        value: value || '',
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al actualizar');
    }
    
    return data;
  } catch (error) {
    console.error('Error updateInvitationField:', error);
    throw error;
  }
}

/**
 * Incrementa el contador de views
 */
export async function incrementViewsRemote(slug) {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=incrementViews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        slug,
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al incrementar views');
    }
    
    return data.views;
  } catch (error) {
    console.error('Error incrementViewsRemote:', error);
    // No lanzamos error para no romper la experiencia del usuario
    return null;
  }
}