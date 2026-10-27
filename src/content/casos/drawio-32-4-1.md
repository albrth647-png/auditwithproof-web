---
titulo: "draw.io Desktop 32.4.1"
version: "32.4.1"
fecha: "2026-10-16"
estado: "publicado"
evidencia: "ev_a94efae81586d359238a5eb1cd34b9a9ed8da7748c3f9a86d4757fe855435ca8 · ev_f0e4202c3b188da10f4be9b3693006b0ba64e3483e7ea100916e388dd413fc2e · ev_9ec17cfca1a869df4352fd6e5db03285c014f0efc2024a30ec924c337c7a22f0"
limite: "§6 declara los límites y los desconocidos; §7, la evidencia verificable"
---

# INFORME DE AUDITORÍA — draw.io Desktop 32.4.1

> 🟢 **INFORME DE MUESTRA PÚBLICA** — el producto real que se entrega en el
> paquete Entrada (150 USDT). Objetivo **open-source** (GPL-3.0) analizado
> bajo permiso implícito de su licencia. Sin cliente real: esto es la demo.
>
> **Documentos enlazados:** [plantilla](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/plantilla-informe.md) · [autorización](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/autorizacion.md) ·
> [proforma](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/proforma.md) · índice de la oferta (interno) · PLAN-EJECUCION (interno)

---

## METADATOS DEL ENCARGO

| Campo | Valor |
|---|---|
| **Cliente** | — (muestra pública) |
| **App auditada** | **draw.io Desktop v32.4.1** (JGraph) |
| **Artefacto** | `drawio-amd64-32.4.1.deb` (116,3 MB) · release `jgraph/drawio-desktop v32.4.1` |
| **SHA-256 del artefacto** | `f4455b3bba3d3b539c3cd069218fc64f0462b1b01610fe8d11acc3ca8566f32b` |
| **Verificado contra hash oficial** | ✅ **Sí** — coincide con `Files-SHA256-Hashes.txt` de la propia release |
| **Fecha de recepción** | 2026-10-16 (recepción y entrega el mismo día — el artefacto es público) |
| **Fecha de entrega** | 2026-10-16 (plazo contratado: 48 h) |
| **Analista** | [albrth647-png](https://github.com/albrth647-png) · motor **REA 6.5.0 + Ghidra 12.1.4** |
| **Alcance acordado** | Paquete **Entrada** — ver [proforma](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/proforma.md) |
| **Licencia del objetivo** | GPL-3.0-only (análisis de código público, permitido) |

**Ejecuciones de análisis** (ambas en GitHub Actions, artefacto descargado y analizado *en la nube*; el operador solo recibió KB de evidencia):

| Run | Alcance | Resultado | Duración |
|---|---|---|---|
| [`38856900076`](https://github.com/albrth647-png/Ghidra/actions/runs/38856900076) | `app.asar` **completo** (inventario amplio) + nativo Ghidra | ⚠️ Parcial (límite de 300 s) + ✅ nativo completo | 9 m 15 s |
| [`38858685634`](https://github.com/albrth647-png/Ghidra/actions/runs/38858685634) | **Proceso main** (`src/main`) — vectores Electron | ✅ **Completo** | ~40 s |

---

## 1. RESUMEN EJECUTIVO

**Estado global:** 🟢 **Sin hallazgos críticos.** La postura de seguridad base de draw.io es correcta; los puntos a vigilar son de **cobertura y mantenimiento**, no de fallo activo.

**Hallazgos en una línea:**

| Métrica | Valor |
|---|---|
| Dependencias con versión (SBOM) | **82** paquetes (9 directas) |
| CVEs activos (cruce de 5 candidatos con BD públicas) | **0** — todas las versiones están en rangos corregidos |
| Ventanas BrowserWindow | **5** → 4 con configuración verificable, **1 dinámica NO verificable** |
| Config correcta donde se pudo ver | ✅ `contextIsolation:true` + `nodeIntegration:false` + `webSecurity:true` + `webviewTag:false` en **4/4** |
| Superficie IPC | **35 operaciones** · 28 canales literales · 29 handlers en main |
| Validación de sender observada | **2 candidatos** de 29 handlers (enforcement **desconocido**) |
| Secretos embebidos (alcance auditado) | **0** detectados |
| Duplicidad en el árbol de dependencias | **3 familias** (debug, ms, semver) |

**Recomendación principal:** revisar manualmente la ventana construida con opciones **dinámicas** (`electron.js:565`) y ampliar la validación de sender en los canales IPC; ninguna exige acción inmediata.

---

## 2. SBOM — Árbol de dependencias

### 2.1 Métricas de inventario (run 1 — asar completo)

| Métrica | Valor | Evidence |
|---|---|---|
| Ficheros relevantes inventariados | **1.292** | `ev_a94efae8…` |
| Bytes de texto leídos | **34.027.540** (34 MB) | `ev_a94efae8…` |
| Nodos AST visitados | **3.267.398** | `ev_a94efae8…` |
| Hallazgos emitidos | **3.246** | `ev_a94efae8…` |
| Fallos de parseo | **0** | `ev_a94efae8…` |
| Grafo de aplicación | 4.804 nodos · 7.121 aristas | `jag_25dd177b…` |
| Grafo semántico | 33.455 nodos · 19.074 relaciones | `jsrg_7814efb4…` |
| **Desconocidos declarados** | **92.468** | ver §6 |

### 2.2 Dependencias directas (9) — del manifiesto empaquetado

| Paquete | Declarado | Instalado (lockfile) | Rol |
|---|---|---|---|
| `electron-updater` | ^6.8.9 | **6.8.9** | auto-actualización |
| `electron-store` | ^11.0.2 | **11.0.2** | persistencia local (`.configuration`) |
| `electron-log` | ^5.4.4 | **5.4.4** | logs |
| `electron-context-menu` | ^5.1.0 | **5.1.0** | UI |
| `@cantoo/pdf-lib` | ^2.7.3 | **2.11.1** | generación PDF |
| `compression` | ^1.8.1 | **1.8.2** | HTTP |
| `crc` | ^4.3.2 | **4.3.2** | checksums |
| `buffer` | ^6.0.3 | **6.0.3** | polyfill |
| `tslib` | ^2.8.1 | **2.8.1** | runtime TS |

> **Runtime Electron:** el manifiesto del asar **no** declara Electron (es devDependency de build).
> Fuente externa verificada hoy: `package-lock.json` del tag `v32.4.1` → **Electron 44.7.0**,
> `electron-builder` 26.17.0. **No se pudo confirmar desde el propio artefacto** → §6.

### 2.3 SBOM completo: 82 paquetes con versión

> Lista íntegra en [`evidencia/sbom-drawio-32.4.1.txt`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/sbom-drawio-32.4.1.txt)
> (derivada de cada `package.json` de `node_modules` **dentro del asar**).

Fragmento:

```
electron-updater@6.8.9      electron-store@11.0.2     electron-log@5.4.4
@cantoo/pdf-lib@2.11.1      ajv@8.20.0                semver@7.7.4 / 7.8.5
builder-util-runtime@9.7.0  electron-dl@5.0.0         fs-extra@10.1.0
debug@2.6.9 / 4.4.3         ms@2.0.0 / 2.1.3          graceful-fs@4.2.11
… (82 en total)
```

### 2.4 Hallazgos del árbol

| # | Hallazgo | Detalle | Riesgo |
|---|---|---|---|
| 1 | **3 familias duplicadas** | `debug` (2.6.9 **y** 4.4.3) · `ms` (2.0.0 **y** 2.1.3) · `semver` (7.7.4 **y** 7.8.5) | 🟡 Inconsistencia — dos líneas de mantenimiento conviven |
| 2 | **Línea antigua empaquetada** | `debug@2.6.9` (rama 2017) llega vía dependencia transita | 🟡 Señal de árbol envejecido (no CVE activo, ver §3) |
| 3 | Dependencias que no esperabas | `ajv`+`ajv-formats` (JSON-Schema), `negotiator@0.6.4`, `on-headers@1.1.0` — cadena de `compression`/HTTP | 🟡 Superficie transita heredada de la cadena `compression → http` |

---

## 3. RIESGO — Cruce de vulnerabilidades (CVE)

> **Método:** cruce de las versiones del SBOM con **BD públicas** (NVD/GitHub Advisory/GitLab GLAD/Snyk)
> — consulta **2026-10-16**. Alcance de esta muestra: **5 candidatos relevantes**, no todo el catálogo NVD (§6.7).

| # | CVE / GHSA | Producto | Afecta a | Instalado | Estado |
|---|---|---|---|---|---|
| 1 | **CVE-2024-39698** (GHSA-9jxc-qjr9-vjxq) | `electron-updater` — validación de firma Windows manipulable | `< 6.3.0-alpha.6` | **6.8.9** | ✅ **No afecta** |
| 2 | **CVE-2026-54673** (GHSA-p2f4-r6v6-j797) | `builder-util-runtime` — cabeceras de credencial filtradas en redirect | `< 9.7.0` | **9.7.0** | ✅ **Corregido** — *en el suelo exacto del fix* |
| 3 | **CVE-2026-54672** (GHSA-7g7r-gx96-252g) | `app-builder-lib`/`electron-builder` — `LD_LIBRARY_PATH` en AppImage (build) | `< 26.15.0` | **26.17.0** | ✅ **Corregido** (fase de build; ver §6.6) |
| 4 | **CVE-2026-102672** (GHSA-vv43-5jgx-7qv8) | **Electron** — race en Squirrel.Mac (solo macOS) | rangos `≤39.8.x / ≤41.10.4 / <42.0.0-beta.2` | **44.7.0** | ✅ **No afecta** |
| 5 | **CVE-2026-70604** (GHSA-v3j7-r9gq-3gjw) | **Electron** — CORS de esquemas custom con `supportFetchAPI` | `≤39.8.9 / 40.≤9.3 / 41.≤4.0 / <42.0.0` | **44.7.0** | ✅ **No afecta** |

### 3.1 Contexto del riesgo

- **Ninguno de los 5 CVEs consultados afecta** a esta build — la higiene de dependencias de draw.io es **buena** (mantenedor activo, Electron reciente 44.7.0).
- **Único matiz:** `builder-util-runtime` está **justo en 9.7.0**, la primera versión corregida de CVE-2026-54673 — **margen cero**: cualquier pin por debajo (resolución de lockfile antiguo, espejo desactualizado) lo haría vulnerable. Merece vigilancia, no pánico.
- Corroboración externa: Snyk reporta *"3 vulnerabilities, none affect the latest version (6.8.9)"* para `electron-updater`.

### 3.2 Cadena de dependencia (ejemplo)

```
draw.io → electron-updater@6.8.9 → builder-util-runtime@9.7.0  ← suelo del fix CVE-2026-54673
draw.io → compression@1.8.2 → negotiator@0.6.4 / on-headers@1.1.0  (cadena HTTP heredada)
```

---

## 4. EXPOSICIÓN — Arquitectura de seguridad (Electron)

> Datos del **run 2** (proceso main completo) — `ev_f0e4202c…`.

### 4.1 Vectores globales

| Vector | Estado | Riesgo | Evidence |
|---|---|---|---|
| `contextIsolation` | ✅ `true` en **4/4** ventanas con opciones literales | 🟢 | `ev_f0e4202c…` |
| `nodeIntegration` | ✅ `false` en **4/4** | 🟢 | `ev_f0e4202c…` |
| `webSecurity` | ✅ `true` en **4/4** | 🟢 | `ev_f0e4202c…` |
| `webviewTag` | ✅ `false` en **4/4** | 🟢 | `ev_f0e4202c…` |
| `sandbox` | 🟠 `true` declarado solo en **1/5** (`progress-bar.js`) — las demás **no lo declaran** y REA **no asume defaults** (`absence_means_default:false`) | 🟡 | `ev_f0e4202c…` |
| CSP (Content-Security-Policy) | ⬜ **No evidenciada en este alcance** (vive en el HTML del renderer, fuera del proceso main) | ⬜ §6.5 | — |

### 4.2 Las 5 ventanas (`BrowserWindow`)

| # | Ubicación | `contextIsolation` | `nodeIntegration` | `sandbox` | Preload | Nota |
|---|---|---|---|---|---|---|
| 1 | `electron.js:911-921` | ✅ true | ✅ false | ⬜ no declarado | `electron-preload.js` (expresión dinámica) | Ventana principal |
| 2 | **`electron.js:565`** | ⚠️ **DINÁMICA** | ⚠️ **DINÁMICA** | ⚠️ DINÁMICA | — | **Opciones no literales → NO verificables estáticamente** |
| 3 | `progress-bar.js:36-53` | ✅ true | ✅ false | ✅ **true** | — | **Config más estricta** del conjunto |
| 4 | `electron.js:3094-3111` (offscreen) | ✅ true | ✅ false | ⬜ no declarado | `electron-preload.js` (dinámico) | `offscreen` parcialmente dinámico |
| 5 | `electron.js:1228-1238` | ✅ true | ✅ false | ⬜ no declarado | `electron-preload.js` (dinámico) | — |

> `25 webPreferences` explícitos contados en total · `preload_entrypoints: 0` — el preload **se referencia** con plantillas dinámicas (`` `${__dirname}/…` ``) pero **no se resuelve como entrypoint** → §6.
>
> **Hallazgo — «preload dinámico no resoluble»:** las 3 ventanas que usan `electron-preload.js`
> lo referencian con una plantilla que no se resuelve estáticamente, así que **no se puede
> demostrar qué preload carga cada una**. No se declara inseguro: se declara **no demostrado** (§6.2).

### 4.3 Canales IPC expuestos (35 operaciones)

**29 handlers en main · 28 canales literales · 3 operaciones dinámicas · 0 sin emparejar (`unpaired_literal: 0`)**

| Grupo | Canales |
|---|---|
| **Ficheros / edición** | `export` · `export-error` · `export-finalize` · `import-success` · `import-error` · `svg-data` · `xml-data` · `xml-data-error` · `newfile` · `fileChanged` · `draftRemoved` · `isModified-result` · `saveAndClose-result` |
| **Ventana / UI** | `zoomIn` · `zoomOut` · `resetZoom` · `toggleFullscreen` · `openDevTools` |
| **Actualizaciones** | `checkForUpdates` · `installUpdate` · `toggleAutoUpdate` |
| **Configuración** | `toggleSpellCheck` · `toggleGoogleFonts` · `toggleStoreBkp` |
| **Transporte renderer↔main** | `rendererReq` · `mainResp` · `app-load-finished` · `render-finished` |
| **Dinámico (no resoluble)** | `action` (send/on/once desde renderer) — **3 operaciones** con canal calculado en runtime |

### 4.4 Validación de sender

| Métrica | Valor | Lectura |
|---|---|---|
| Candidatos a validación observados | **2** (mecanismo `comparison:!=`, `expected: null`, **`enforcement: unknown`**) | 🟠 Solo 2 de 29 handlers tienen observación de validación |
| Transmisiones renderer emparejadas | 1 (`paired_renderer_transmissions`) | 🟢 Sin canales literales sin emparejar |
| Ambigüedades | 0 | 🟢 |

> ⚠️ **Lectura honesta (limitación #7 del proveedor):** la ausencia de observaciones en el resto de handlers
> **NO prueba** que no validen — solo que REA no las encontró en sintaxis estático. Ver §6.

### 4.5 Puente preload (`contextBridge`) — 2 APIs, 6 miembros

| API | Miembros expuestos | `unknown_members` | Resolución |
|---|---|---|---|
| `electron` | `listenOnce` · `registerMsgListener` · `request` · `sendMessage` | 0 | sintaxis directa |
| `process` | `type` · `versions` | 0 | sintaxis directa |

> **Superficie mínima y de propósito acotado** — patrón correcto (no se expone `require`, ni `ipcRenderer`, ni `fs`). 🟢

### 4.6 Candidatos a endpoint y almacenamiento

| Tipo | Hallazgo | Interpretación tras revisión |
|---|---|---|
| 7 × `endpoint` (candidatos) | `lastWinSize` · `updateCheckIntervalHours` · `enableStoreBkp` · `dontCheckUpdates` · `lastUpdateCheck` · `enableSpellCheck` · `isGoogleFontsEnabled` — mecanismo `call:store.get` | 🟡 **Falsos positivos candidatos**: son claves de `electron-store`, **no URLs de red**. REA los marca `interpretation: candidate`; la revisión manual los descarta como red. *(Ejemplo del valor de declarar candidatos en vez de afirmar.)* |
| 1 × `storage` | `.configuration` (fichero de `electron-store`) | Persistencia local — revisar cifrado si hubiera datos sensibles (paquete Estándar) |

---

## 5. SECRETOS EMBEBIDOS

> ⚠️ Este apartado reporta **presencia** de datos sensibles. No se prueba, no se extrae, no se ejecuta acceso.

**Barrido léxico sobre la evidencia de ambos runs** (5 familias de patrones):

| Patrón | Coincidencias |
|---|---|
| `Bearer …` (tokens) | **0** |
| Formatos de clave (`sk-…` / `AKIA…` / `ghp_…` / `xox…`) | **0** |
| Credenciales en URL (`user:pass@host`) | **0** |
| Asignaciones `api_key/secret/token = "…"` | **0** |
| JWT (`eyJ….…`) | **0** |

**Resultado: 0 secretos detectados en el alcance auditado** (proceso main + 34 MB del asar leídos en run 1).
El alcance completo del bundle está sujeto a §6.1 (run 1 interrumpido).

---

## 6. LÍMITES Y DESCONOCIDOS

> 🔴 **Sección obligatoria.** Ninguna SaaS de due diligence declara esto. **La transparencia es el producto.**

### 6.1 Limitaciones del análisis (declaradas por REA)

**Run 1 (asar completo):**

1. El análisis de código fuente **se interrumpió**: `timeout 300000 ms` + `heap 1.098.907.648 B` agotado en `drawio/src/main/webapp/js/app.min.js` (bundle minificado gigante).
2. `extensions.min.js` — timeout propio · `dropbox.html`, `github.html`, `gitlab.html` — **1 cuerpo JS inline cada uno NO analizado** (declarados con nombre).
3. Vínculos CommonJS/ESM resueltos **solo dentro del contenedor inventariado**.
4. El JavaScript se parseó como **texto inerte — nada se ejecutó**.
5. *«Unavailable facts remain explicit and must not be read as absence»* — los hechos no disponibles son explícitos y **no deben leerse como ausencia**.
6. Rutas dinámicas u ofuscadas pueden quedar sin resolver.

**Run 2 (proceso main):**

7. Los canales IPC dinámicos (p. ej. `action`) **no se emparejan nunca por similitud textual**.
8. La identidad de las APIs de Electron sigue alias léxicos verificados — reasignaciones arbitrarias no se evalúan.
9. **Defaults, alcance y enforcement en runtime quedan sin probar** (análisis estático).
10. Las validaciones de sender/origen son **solo observaciones**: REA no afirma que implementen una política de autorización completa.

### 6.2 Lo que NO se pudo determinar

| Pregunta | Por qué | Cómo se resuelve |
|---|---|---|
| **Configuración de seguridad de `electron.js:565`** | Opciones construidas dinámicamente — no literales | Revisión manual de código (paquete Estándar) |
| **¿Qué preload carga cada ventana?** | `preload_entrypoints: 0` — referenciado con plantilla dinámica (`` `${__dirname}/…` ``) | Revisión manual del preload + prueba en runtime |
| **CSP real del renderer** | Vive en HTML fuera del proceso main analizado | Análisis del HTML/`app.min.js` con presupuesto mayor |
| **Versión exacta de Electron dentro del binario** | El manifiesto del asar no la declara; 44.7.0 proviene del lockfile del **tag** | Strings del binario / `--version` (no ejecutamos) |
| **Comportamiento en runtime** | Análisis **100 % estático**: nada se ejecutó | Auditoría dinámica (paquete Pro) |
| **Artefactos AppImage / Windows / macOS** | Solo se audita el **.deb** (CVE-2026-54672 afecta a builds AppImage) | Auditar cada artefacto por separado |
| **¿Los 27 handlers restantes validan sender?** | No se hallaron patrones estáticos (limitación #7 — **no es ausencia**) | Revisión manual / fuzzing de canales |
| **¿Hay secretos fuera del alcance leído?** | Run 1 cubrió 34 MB antes de agotar límites | Reejecución con partición del bundle |

### 6.3 Supuestos del análisis

- El `.deb` descargado de la release oficial **es** el que se despliega (hash **verificado** contra el publicado ✅).
- El `package-lock.json` del tag refleja la build real (no verificado contra el binario).
- El encargo se hizo en **modo binario** (artefacto publicado). El **modo fuente** (§2.3 de la
  plantilla: compilar el tag y comparar fichero a fichero con el asar) no se aplicó; habría
  reducido el presupuesto de lectura del bundle.
- La versión declarada (32.4.1) corresponde al artefacto (consistente con nombre y manifiesto).

### 6.4 Cobertura declarada (por familias de hechos)

- Run 1: **12 familias de hechos, todas en estado `partial`** · límites activos: `heap 1 GB`, `timeout 300 s`, `file ceiling 20.000`, `node ceiling 100.000`.
- **92.468 desconocidos registrados** con ID propio (cada uno reconsultable) — la incertidumbre está **contabilizada**, no oculta.

### 6.5 CSP y HTML

No se emitieron hechos de CSP — **esto no significa que no exista**, significa que estaba fuera del alcance de los dos runs (§6.2).

### 6.6 Alcance de artefactos

Solo `drawio-amd64-32.4.1.deb`. Las builds AppImage/Windows/macOS de la misma release **pueden diferir** (p. ej. CVE-2026-54672 es exclusivo de AppImage).

### 6.7 Cruce CVE

Consulta de **5 candidatos** el **2026-10-16** en NVD/GHSA/GLAD/Snyk — **no es un escaneo exhaustivo** de las 82 versiones contra todo el catálogo. El paquete Estándar incluye escaneo completo.

---

## 7. EVIDENCIA

### 7.1 Huellas de cada operación

| # | Operación | Evidence ID | Confianza | Cobertura |
|---|---|---|---|---|
| 1 | `analyze_javascript_application` (asar completo) | `ev_a94efae81586d359238a5eb1cd34b9a9ed8da7748c3f9a86d4757fe855435ca8` | `derived` | `partial` (interrumpido) |
| 2 | `analyze_javascript_application` (proceso main) | `ev_f0e4202c3b188da10f4be9b3693006b0ba64e3483e7ea100916e388dd413fc2e` | `derived` | `partial` (limitaciones §6.1) |
| 3 | `binary_overview` (Ghidra — nativo) | `ev_9ec17cfca1a869df4352fd6e5db03285c014f0efc2024a30ec924c337c7a22f0` | `derived` | 10 limitaciones |

### 7.2 Integridad verificada

| Artefacto | SHA-256 |
|---|---|
| `drawio-amd64-32.4.1.deb` | `f4455b3bba3d3b539c3cd069218fc64f0462b1b01610fe8d11acc3ca8566f32b` ✅ *(coincide con hash oficial)* |
| `app.asar` (raíz run 1) | `e64b9650c0b8241ca9a7d33b56386a385bceee63270cec701d3a467347b697e6` |
| Directorio `src/main` (raíz run 2) | `04b32cf796534f828ddb3b57568be1e7e1be27f9f8d43debc924af49b5d19596` |
| `chrome_crashpad_handler` (ELF x86_64) | `3e9742b8edaef6779c48e0966b9f433db39e59ee148854312b5a5c8612100a04` |

### 7.3 Grafos e inventarios (todos los IDs encadenados)

| Objeto | ID |
|---|---|
| Inventario run 1 | `agm_e0fe639090b97e0e12931fb0440e1c0901c2302d8aed2937c0cda396cf2a50d5` |
| Inventario run 2 | `agm_7fa81bc6b0c15cc6b72f6653aaded445a9ead21ec858a18227ea75be22b37a14` |
| Grafo aplicación run 1 | `jag_25dd177b5be54d19217508589793de164ce5e8ea2a0cba52ceeefd420fcd9799` |
| Grafo semántico run 1 | `jsrg_7814efb457d1aa30a5655a1fc37090f9f7a5c2b7bb4cbfd688af02299634672a` |
| Grafo aplicación run 2 | `jag_960f4912770a9cafef5baf5d42c847e198ea0f52926680f237e73e05481d594e` |

### 7.4 Verificación independiente

Cualquier tercero puede reproducir este informe:

```bash
# 1. Descargar el artefacto oficial y verificar hash
curl -LO https://github.com/jgraph/drawio-desktop/releases/download/v32.4.1/drawio-amd64-32.4.1.deb
sha256sum drawio-amd64-32.4.1.deb   # → f4455b3b…  ✅

# 2. Reejecutar el análisis (REA 6.5.0)
rea analyze-javascript-application <asar-o-src/main> --json

# …o lanzar el mismo workflow en la nube:
#   albrth647-png/Ghidra → Actions → REA-Audit → rellenar asset_url + sha256_url
```

### 7.5 Paquete de evidencia de este informe

| Fichero | Contenido |
|---|---|
| [`evidencia/resumen-evidencia.json`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/evidence-summary.json) | Índice verificable de runs, evidencias y hashes |
| [`evidencia/evidencia-run1-asar.json`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/evidencia-run1-asar.json) | Extracto compacto run 1 (IDs, stats, 12 limitaciones) |
| [`evidencia/evidencia-run2-main.json`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/evidencia-run2-main.json) | Run 2 completo con los **188 nodos tipados** (IPC, ventanas, bridge) |
| [`evidencia/evidencia-nativa-gidra.json`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/evidence-native-ghidra.json) | Overview nativo Ghidra (36 segmentos · 5.802 procedimientos · 2.184 strings) |
| [`evidencia/sbom-drawio-32.4.1.txt`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/sbom-drawio-32.4.1.txt) | 82 paquetes `name@version` |
| [`evidencia/package-drawio-32.4.1.json`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/package-drawio-32.4.1.json) | Manifiesto del proyecto |
| [`evidencia/sha256-drawio-amd64-32.4.1.deb.txt`](https://github.com/albrth647-png/electron-security-audit/blob/main/evidence/sha256-drawio-amd64-32.4.1.deb.txt) | Hash del artefacto |

---

## 8. RECOMENDACIONES PRIORIZADAS

| Prioridad | Hallazgo | Acción recomendada | Esfuerzo |
|---|---|---|---|
| 🔴 **P0** | — | **No hay hallazgos críticos** | — |
| 🟠 **P1** | Ventana `electron.js:565` con opciones **dinámicas no verificables** | Revisar manualmente sus `webPreferences` y fijarlas como literales | Bajo |
| 🟠 **P1** | Solo **2 candidatos** de validación de sender entre 29 handlers | Auditar la política de validación de canales IPC (paquete Estándar) | Medio |
| 🟠 **P1** | `builder-util-runtime` **en 9.7.0** (suelo exacto del fix CVE-2026-54673) | Fijar `≥9.7.0` explícitamente y vigilar releases | Bajo |
| 🟡 **P2** | `sandbox` declarado solo en 1/5 ventanas | Declarar `sandbox:true` explícito en todas las ventanas | Bajo |
| 🟡 **P2** | Árbol duplicado: `debug` ×2 · `ms` ×2 · `semver` ×2 | Deduplicar (`npm dedupe`) y eliminar la línea `debug@2.6.9` | Bajo |
| 🟡 **P2** | CSP no evidenciada en este alcance | Auditar CSP del HTML (paquete Estándar) | Medio |
| ⬜ **P3** | Solo el `.deb` auditado | Auditar AppImage/Win/macOS de la misma release | Medio |
| ⬜ **P3** | Cruce CVE de 5 candidatos | Escaneo exhaustivo de los 82 paquetes (paquete Estándar) | Medio |

> **Regla:** este informe entrega **recomendaciones, no cambios**. La remediación guiada es el
> paquete Estándar (600 USDT) — ver [proforma](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/proforma.md).

---

## CIERRE

> Este informe fue generado con **análisis estático** sobre el artefacto verificado indicado en los metadatos.
> Las secciones **§6** y **§7** documentan explícitamente el alcance, sus límites y la evidencia verificable.
> **El artefacto se analizó en la nube de GitHub Actions del analista** (donde vive Ghidra) — posible
> porque draw.io es **código público**: no hay nada confidencial que exponer, y el run queda
> **publicado** como prueba reproducible de cada cifra. En un encargo con **artefacto privado**, el
> análisis corre en el dispositivo del analista o en un runner **privado**, y el artefacto se elimina
> tras la entrega. En ningún caso el software del cliente se envía a un servicio de escaneo de
> terceros (Snyk, Sonatype, etc.): ver la [proforma](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/proforma.md) y la [autorización](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/autorizacion.md).
>
> **Resultado de la muestra:** 🟢 postura base sólida · 0 CVEs activos en el cruce · 4/5 ventanas
> con configuración correcta verificable · 0 secretos · 7 puntos declarados como no determinados.

**Siguiente paso sugerido:** comparar este informe con el de **tu** app Electron/JS —
[proforma de 150 USDT](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/proforma.md) · [lo que se firma antes](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/autorizacion.md).

---

*Informe generado con REA 6.5.0 + Ghidra 12.1.4 · workflows `rea-audit.yml` · 2026-10-16*
*Plantilla usada: [plantilla-informe.md](https://github.com/albrth647-png/electron-security-audit/blob/main/docs/es/plantilla-informe.md) — este documento es su instancia real.*
