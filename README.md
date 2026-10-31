# English Listening & Writing Master 🎧✍️

Práctica interactiva de inglés: números del 10 al 100, la hora (o'clock, half past, quarter past, quarter to) y escritura de respuestas con la estructura `Does he/she like...?`

Es un sitio estático (HTML + CSS + JS), sin instalación ni build.

## Estructura

```
english-listening/
├── index.html
├── styles.css
├── script.js
├── README.md
└── .gitignore
```

## Probar en local

Abre `index.html` con doble clic en Chrome o Edge (el audio usa la voz del navegador).

## Subir a GitHub

```bash
cd english-listening
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/english-listening.git
git push -u origin main
```

> Crea primero el repositorio vacío en github.com (sin README ni .gitignore) y cambia `TU-USUARIO` por tu usuario.

## Publicar en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. **Add New → Project** y elige el repositorio `english-listening`.
3. Deja todo por defecto: *Framework Preset* = **Other**, sin *Build Command* ni *Output Directory*.
4. Pulsa **Deploy**. Cada `git push` a `main` publica una nueva versión automáticamente.
