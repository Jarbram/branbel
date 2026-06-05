# Branbel · Invitaciones Digitales

Plataforma de invitaciones digitales personalizadas. Sitio estático (HTML/CSS/JS)
desplegable en Vercel. Cada invitación vive en su propia carpeta autocontenida.

## Estructura

```
/                       Landing del negocio (index.html) — una pantalla + CTA a WhatsApp
/vitalia-joao/          Invitación de boda (Vitalia & Joao)
    index.html          Invitación principal
    fotos.html          Galería / subida de fotos
    confirmaciones.html Panel privado de RSVP (clave en confirmaciones.js)
    script.js · fotos.js · confirmaciones.js
    styles.css · song.mp3
```

Con `cleanUrls` de Vercel:
- `/`                → landing
- `/vitalia-joao`    → invitación
- `/vitalia-joao/fotos`, `/vitalia-joao/confirmaciones`

## Cómo agregar una nueva invitación

1. Copia la carpeta: `cp -r vitalia-joao/ nombre-evento/`
2. Edita los textos en `nombre-evento/index.html` y los datos en sus `.js`
   (Supabase `EVENT_SLUG`, clave del panel, canción).
3. Listo: queda publicada en `/nombre-evento`.

Cada carpeta es independiente: cambiar una no afecta a las demás.

## Datos (Supabase)

RSVP y fotos en tiempo real vía Supabase (anon key, pública por diseño).
El panel `/…/confirmaciones` requiere una política de lectura (SELECT) en la
tabla `rsvp`. La clave del panel es solo una capa visual.

## WhatsApp del landing

El número del botón "Contáctame por WhatsApp" está en `index.html`,
atributo `data-phone` del enlace `#wa-cta` (formato internacional sin `+`).
