// services/googleForm.js

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
  email: 'entry.2118290222'
};

export function sendToGoogleForm(data) {

  return new Promise((resolve) => {

    const iframe = document.createElement('iframe');
    iframe.name = 'googleFormIframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
    form.method = 'POST';
    form.target = 'googleFormIframe';

    const addField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      form.appendChild(input);
    };

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

    addField('fvv', '1');
    addField('draftResponse', '[]');
    addField('pageHistory', '0');

    document.body.appendChild(form);
    form.submit();

    console.log('✅ Formulario enviado');

    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      resolve(true);
    }, 3000);
  });
}