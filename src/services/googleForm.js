const FORM_ID = '1FAIpQLSc4tpPB8fAIYa0Aild2haLWU_Hjhs19pc3DkEDIO7ChP18BWg';

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
  email: 'entry.2118290222',
  apellido: 'entry.2016938440',
  apodo: 'entry.64032990',
  mensaje: 'entry.1565072136',
  vestimenta: 'entry.1597447155'
};

export function sendToGoogleForm(data) {
  return new Promise((resolve) => {
    const formData = new URLSearchParams();
    
    formData.append(ENTRIES.nombre, data.nombre || '');
    formData.append(ENTRIES.edad, data.edad || '');
    formData.append(ENTRIES.equipo, data.equipo || '');
    formData.append(ENTRIES.fecha, data.fecha || '');
    formData.append(ENTRIES.hora, data.hora || '');
    formData.append(ENTRIES.lugar, data.lugar || '');
    formData.append(ENTRIES.lugar2, data.lugar2 || data.lugar || '');
    formData.append(ENTRIES.contacto, data.contacto || '');
    formData.append(ENTRIES.telefono, data.telefono || '');
    formData.append(ENTRIES.email, data.email || '');
    formData.append(ENTRIES.apellido, data.apellido || '');
    formData.append(ENTRIES.apodo, data.apodo || '');
    formData.append(ENTRIES.mensaje, data.mensaje || '');
    formData.append(ENTRIES.vestimenta, data.vestimenta || '');
    formData.append('fvv', '1');
    formData.append('draftResponse', '[]');
    formData.append('pageHistory', '0');

    fetch(`https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }).catch(() => {
      // no-cors no devuelve respuesta, ignoramos el error
    });

    console.log('✅ Formulario enviado con datos completos');
    resolve(true);
  });
}