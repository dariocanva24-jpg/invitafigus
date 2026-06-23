// ID del formulario de Google
const FORM_ID = '1GN3ADCmswrabdqLekeLk1d-ABgZKdguLI5Yem3i6pf8';

// Entry IDs de cada pregunta
const ENTRIES = {
  nombre: 'entry.226322802',
  edad: 'entry.1127303934',
  equipo: 'entry.801892286',
  fecha: 'entry.520585545',
  hora: 'entry.1752138270',
  lugar: 'entry.1770083157',
  lugar2: 'entry.1701607236',
  contacto: 'entry.1263783837',
  telefono: 'entry.65123469',
  email: 'entry.2118290222'
};

export async function sendToGoogleForm(data) {
  const formUrl = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
  
  const formData = new FormData();
  formData.append(ENTRIES.nombre, data.nombre || '');
  formData.append(ENTRIES.edad, data.edad || '');
  formData.append(ENTRIES.equipo, data.equipo || '');
  formData.append(ENTRIES.fecha, data.fecha || '');
  formData.append(ENTRIES.hora, data.hora || '');
  formData.append(ENTRIES.lugar, data.lugar || '');
  formData.append(ENTRIES.lugar2, data.lugar || ''); // mismo valor para ambos "Dónde"
  formData.append(ENTRIES.contacto, data.contacto || '');
  formData.append(ENTRIES.telefono, data.telefono || '');
  formData.append(ENTRIES.email, data.email || '');
  
  try {
    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    console.log('✅ Datos enviados a Google Forms');
    return true;
  } catch (error) {
    console.error('❌ Error enviando a Google Forms:', error);
    return false;
  }
}