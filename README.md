# InvitaFigus - Invitaciones de Cumpleaños Futboleras

App de invitaciones digitales con temática de figuritas de fútbol estilo Panini/FIFA.

## 🚀 Cómo empezar

### Paso 1: Instalar Node.js

1. Andá a [https://nodejs.org](https://nodejs.org)
2. Descargá la versión **LTS** (la que dice "Recommended for most users")
3. Instalalo con siguiente, siguiente, siguiente...
4. Verificá que se instaló abriendo una terminal (CMD o PowerShell) y escribiendo:
   ```bash
   node --version
   ```
   Debería mostrar algo como `v20.x.x`

### Paso 2: Instalar dependencias

1. Abrí una terminal en la carpeta del proyecto (la que dice `invitafigus-vite`)
2. Ejecutá:
   ```bash
   npm install
   ```
   Esto descarga todas las librerías necesarias.

### Paso 3: Correr en desarrollo

```bash
npm run dev
```

Se abre automáticamente en tu navegador en `http://localhost:3000`

### Paso 4: Ver la invitación demo

Andá a: `http://localhost:3000/invitacion/thiago-8-argentina`

## 📁 Estructura del proyecto

```
invitafigus-vite/
├── public/              # Archivos estáticos (imágenes, etc.)
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── invitation/  # Componentes de la invitación
│   │   │   ├── AlbumCover.jsx      # Portada del álbum
│   │   │   ├── PlayerCard.jsx      # Carta del jugador
│   │   │   ├── EventInfo.jsx       # Info del evento
│   │   │   ├── CountdownTimer.jsx  # Cuenta regresiva
│   │   │   ├── RSVPForm.jsx        # Formulario de confirmación
│   │   │   └── ShareButtons.jsx    # Botones para compartir
│   │   └── ui/          # Componentes UI base (botones, inputs, etc.)
│   ├── context/         # Estado global de la app
│   ├── pages/           # Páginas principales
│   │   ├── HomePage.jsx      # Página de inicio
│   │   ├── InvitationPage.jsx # Página de invitación
│   │   ├── CreatePage.jsx     # Crear nueva invitación
│   │   └── AdminPage.jsx      # Panel admin
│   ├── styles/          # Archivos CSS
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── postcss.config.js    # Configuración de PostCSS
```

## 🎨 Tecnologías usadas

- **React 18** - Framework UI
- **Vite** - Build tool (más rápido que Create React App)
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **React Router** - Navegación
- **Lucide React** - Iconos

## 🚀 Deploy a Vercel (subir a internet)

### Opción 1: Vercel CLI (más fácil)

1. Instalá Vercel global:
   ```bash
   npm install -g vercel
   ```

2. Logueate:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Opción 2: Git + Vercel (recomendado)

1. Creá un repo en GitHub
2. Subí el código:
   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/invitafigus.git
   git push -u origin main
   ```

3. Andá a [vercel.com](https://vercel.com)
4. Conectá tu cuenta de GitHub
5. Importá el proyecto
6. ¡Listo! Se deploya automáticamente

## 🔧 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Crea build de producción |
| `npm run preview` | Previsualiza el build |

## 📝 Notas

- Las invitaciones se guardan en `localStorage` (por ahora)
- El admin es: **admin / figus2026**
- La demo está en `/invitacion/thiago-8-argentina`

## 🎯 Próximos pasos

1. ✅ Migrar a Vite + React moderno
2. ⬜ Conectar backend real (Prisma/Node.js)
3. ⬜ Base de datos persistente (Supabase/PostgreSQL)
4. ⬜ Sistema de pagos (MercadoPago)
5. ⬜ Más equipos y personalización
6. ⬜ App móvil (React Native)

---

¿Dudas? Consultá con tu agente senior de programación 😎
