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

export function sendToGoogleForm(data) {
  return new Promise((resolve) => {
    // Crear un iframe invisible
    const iframe = document.createElement('iframe');
    iframe.name = 'googleFormIframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Crear un formulario
    const form = document.createElement('form');
    form.action = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
    form.method = 'POST';
    form.target = 'googleFormIframe';

    // Función para agregar campos
    const addField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      form.appendChild(input);
    };

    // Agregar todos los campos
    addField(ENTRIES.nombre, data.nombre);
    addField(ENTRIES.edad, data.edad);
    addField(ENTRIES.equipo, data.equipo);
    addField(ENTRIES.fecha, data.fecha);
    addField(ENTRIES.hora, data.hora);
    addField(ENTRIES.lugar, data.lugar);
    addField(ENTRIES.lugar2, data.lugar);
    addField(ENTRIES.contacto, data.contacto);
    addField(ENTRIES.telefono, data.telefono);
    addField(ENTRIES.email, data.email);

    // Agregar campos requeridos por Google
    addField('fvv', '1');
    addField('draftResponse', '[]');
    addField('pageHistory', '0');

    // Agregar formulario al DOM y enviar
    document.body.appendChild(form);
    form.submit();

    console.log('✅ Formulario enviado a Google Forms');

    // Limpiar después de 3 segundos
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      resolve(true);
    }, 3000);
  });
}