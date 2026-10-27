# auditwithproof-web

Web pública de **Audit with Proof** — una página por caso de auditoría, en el
tema de la marca (`identidad/BRAND.md`, concepto C «las barras»).

> **Fuente del plan:** `WEB.md` en el repo raíz `rea-ops` (estrategia, roadmap
> y decisiones). Este repo solo contiene el sitio.

## Cómo funciona

- **Astro 7 + Tailwind 4** → HTML/CSS estáticos, ≈0 JavaScript por página.
- **Todo corre en la nube:** `npm install` y `astro build` ocurren en GitHub
  Actions (`.github/workflows/ci.yml`). Aquí no se instala nada.
- **Colores y tipografía:** solo los tokens de `WEB.md` §3 (turquesa
  `#8FE3CF`, navy `#0A121C`, gris `#5C7186`, Poppins Bold).

## Comandos (solo en la nube o en una máquina con Node)

```bash
npm install     # ~20-40 MB de descarga, ~60-100 MB en disco
npm run dev     # preview local
npm run build   # genera dist/
```

## Publicar

1. `push` a `main` → el workflow **solo construye** y sube `dist` como artefacto.
2. Para publicar: **Actions → web-ci → Run workflow → `deploy: true`**
   (publicación = decisión explícita del operador).

## Reglas

- **Copy en español** (regla cero de `publicacion/ESTILO.md`).
- **Sin secretos**: el build no necesita ninguno.
- **Los casos no se inventan**: cada página nace de un `*.md` verificado en
  `oferta/casos/` del repo privado (colección de contenido, paso 2 del roadmap).
