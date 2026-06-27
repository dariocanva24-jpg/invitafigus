import { useState } from 'react';

// ============================================
// CONFIGURACIÓN: reemplazá esto con tu URL
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfCJ0VhY5hIsK7jjsLRl2KNCs_E4d8GgcaG8cysUvApLdxICckQBqXQC9dE1CLATIGVQ/exec';

export default function PhotoUploadPOC() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // ============================================
  // PASO A: El usuario selecciona una foto
  // ============================================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError(null);
    setResult(null);

    if (!selected) return;

    // Validar formato
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Formato no válido. Usá JPG, PNG o WEBP.');
      return;
    }

    // Validar tamaño
    if (selected.size > MAX_SIZE) {
      setError('La foto supera los 5MB.');
      return;
    }

    setFile(selected);

    // Preview local (sin subir nada todavía)
    setPreview(URL.createObjectURL(selected));
  };

  // ============================================
  // PASO B: Enviar la foto a Apps Script
  // ============================================
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // Creamos un FormData (como un formulario HTML)
      const formData = new FormData();
      formData.append('file', file);

      // Enviamos a Apps Script
      const response = await fetch(`${SCRIPT_URL}?action=uploadPhotoPOC`, {
        method: 'POST',
        body: formData
        // NO pongas headers aquí — fetch lo maneja solo
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Error del servidor');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER: Lo que se ve en pantalla
  // ============================================
  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>🧪 FASE 1: Subir foto a Drive</h2>

      {/* Selector de archivo */}
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ marginBottom: '16px', display: 'block' }}
      />

      {/* Preview local */}
      {preview && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#666' }}>Vista previa:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div style={{
          padding: '12px',
          background: '#fee',
          color: '#c33',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Botón de subir */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          width: '100%',
          padding: '12px',
          background: !file || loading ? '#ccc' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: !file || loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Subiendo...' : '📤 Subir a Google Drive'}
      </button>

      {/* Resultado exitoso */}
      {result && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#efe',
          color: '#363',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <p><strong>✅ ¡Subida exitosa!</strong></p>
          <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            <strong>URL:</strong> {result.url}
          </p>
          <p style={{ fontSize: '12px' }}>
            <strong>FileID:</strong> {result.fileId}
          </p>

          {/* Imagen desde Drive */}
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '12px', color: '#666' }}>¿Se ve la imagen desde Drive?</p>
            <img
              src={result.url}
              alt="Desde Drive"
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          {/* Link para probar en incógnito */}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '12px',
              color: '#2563eb'
            }}
          >
            → Abrir en pestaña nueva (probar en incógnito)
          </a>
        </div>
      )}
    </div>
  );
}