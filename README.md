# BubbleMesh — Landing

Landing page de **BubbleMesh** — infraestructura de IA especializada por sector.

Sitio estático (HTML + CSS + JS, sin build) publicado con **GitHub Pages**.

## Estructura

```
.
├── index.html
├── .nojekyll
└── assets/
    ├── css/styles.css        Sistema de diseño v2.0 (dark · glass · violeta→magenta)
    ├── js/main.js            Nav, FAQ acordeón, reveal on scroll
    ├── images/               Imágenes WebP optimizadas
    ├── team/                 Avatares del equipo (WebP)
    └── video/                Video de fondo del hero (MP4, sin audio) + poster WebP
```

## Optimización de assets

- **Imágenes** convertidas a **WebP** (de ~19 MB a ~390 KB).
- **Video** del hero re-codificado a H.264 con `+faststart` y **audio eliminado** (de 4.3 MB a 1.6 MB). Reproduce en loop, `muted`, `autoplay`, `playsinline`.

## Desarrollo local

```bash
python3 -m http.server -d . 8000
# http://localhost:8000
```

---

*Diseño y contenido según `DESIGN.md`, `CONTENIDO.md` y `PROJECT.md` de BubbleMesh · TheFirstBubble.*
