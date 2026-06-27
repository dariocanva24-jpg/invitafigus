// ============================================
// INVITAFIGUS - CLIENTE API PARA GOOGLE SHEETS
// ============================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEYDyS7rEW_GVnTlsNPamRo8l0xaeNYMo6V-jmBV-wrYy_uJq4V0-9PDBLu7Y_XtUlcA/exec';

export async function fetchAllInvitations() {
  try {
    const cacheBuster = Date.now();
    const response = await fetch(`${SCRIPT_URL}?action=getAll&_cb=${cacheBuster}`);
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

export async function fetchInvitationBySlug(slug) {
  try {
    const cacheBuster = Date.now();
    const response = await fetch(`${SCRIPT_URL}?action=getBySlug&slug=${encodeURIComponent(slug)}&_cb=${cacheBuster}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Invitacion no encontrada');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetchInvitationBySlug:', error);
    throw error;
  }
}

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

export async function updateInvitationField(rowIndex, field, value) {
  const maxRetries = 2;
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`${SCRIPT_URL}?action=updateField`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          rowIndex,
          field,
          value: value || '',
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al actualizar');
      }
      
      return data;
      
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
}

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
    return null;
  }
}