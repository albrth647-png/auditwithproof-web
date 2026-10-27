---
titulo: "Beekeeper Studio 6.1.6"
version: "6.1.6"
fecha: "2026-10-26"
estado: "publicado"
evidencia: "ev_dc211c4b688597c1b42ce2c03ecfc675855a56de6a4985dd2950936a168a2cc2"
limite: "§6.2: 8 preguntas que no se pudieron responder"
---

# FICHA — Beekeeper Studio 6.1.6 (Linux amd64)

**Qué es:** cliente de bases de datos de escritorio (PostgreSQL, MySQL, SQLite, SQL Server,
MongoDB, Redis…) que guarda **credenciales de producción** en el equipo del usuario.
**Por qué importa:** si el renderer de una app así se compromete, lo que hay detrás no es una
cuenta de red social: son las bases de datos de la empresa.

| | |
|---|---|
| Versión analizada | **6.1.6** (tag `v6.1.6`) |
| Artefacto | `beekeeper-studio_6.1.6_amd64.deb` · **281.298.876 B** (268,3 MiB) |
| Fecha del snapshot | **2026-10-26** |
| Modo | **Binario + fuente público** (procedencia declarada en §2.1) |
| Evidencia | `ev_dc211c4b688597c1b42ce2c03ecfc675855a56de6a4985dd2950936a168a2cc2` |

---

## 1. RESUMEN EJECUTIVO

1. El binario distribuido **coincide con el digest oficial** del release (sha256, §2.1).
2. La ventana principal se crea con **`sandbox: false`** — el renderer **no** va aislado por el
   sandbox del sistema operativo. Está declarado a propósito en el fuente y **confirmado en los
   bytes del bundle** (§4).
3. Esa misma ventana tiene **`@electron/remote` habilitado** (`remoteMain.enable(webContents)`) y
   el paquete figura como **dependencia directa** del proyecto (§4).
4. `contextIsolation: true` y `nodeIntegration: false` están correctamente configurados: el
   renderer **no** obtiene Node por su cuenta (§4).
5. Se resolvieron **11 handlers IPC** (`ipcMain.handle`) y **10 escuchas** (`ipcMain.on`) con canal
   literal; **hay más canales que el análisis estático no resolvió** (§4.1 y §6.2).
6. **Ninguna de estas observaciones es una vulnerabilidad explotada.** Son configuración y
   estructura, verificadas en bytes. Lo que no se pudo comprobar está en §6.

---

## 2. SBOM Y PROCEDENCIA

### 2.1 Procedencia del build

| Comprobación | Resultado | Fuente |
|---|---|---|
| Tag de referencia | `v6.1.6` | repositorio público |
| Licencia | **GPL-3.0-or-later** (edición Community). Los ficheros bajo `**/src-commercial` tienen **licencia comercial aparte** | `LICENSE.md` + `LICENSE-COMMERCIAL.md` del tag |
| sha256 del `.deb` medido en CI | `750e29237ae2bd488d69dd994ff1dc5691d3335f9abff9f6def4539bf1302b3c` | bytes descargados |
| sha256 publicado por GitHub | `sha256:750e29237ae2bd488d69dd994ff1dc5691d3335f9abff9f6def4539bf1302b3c` | API del release |
| Coincidencia | ✅ **idéntico** | las dos anteriores |
| Fichero analizado | `dist/main.js`, extraído del `.asar` del `.deb` verificado arriba | `input_path` de la evidencia (directorio `jsdir` con el fichero copiado) |

> **Lo que prueba:** que el artefacto analizado es el que el fabricante publicó.
> **Lo que no prueba:** que ese fuente sea seguro. Son afirmaciones distintas.
> **No se hizo** la comparación fichero a fichero del build (§2.3 de la plantilla): esta ficha no
> recompila el proyecto. Se declara en §6.2.

### 2.2 Dependencias

| Dato | Valor | Fuente |
|---|---|---|
| Paquetes en el `.asar` | **1.603** | SBOM del artefacto (1.603 líneas `nombre@versión`) |
| Dependencias directas declaradas | **130** | `package.json` del paquete |
| `@electron/remote` | instalado **2.1.3** · declarado `^2.0.10` · **dependencia directa** | SBOM + `package.json` |
| Electron | **39.8.10** — *declarado* en `apps/studio/package.json` (devDependencies) | repositorio del tag |
| Empaquetador | electron-builder `^26.11.1` | repositorio del tag |

> ⚠️ **Electron 39.8.10 es una declaración de compilación, no una medida del binario.** El SBOM
> del `.asar` no contiene el runtime de Electron. Se repite en §6.2.

---

## 3. RIESGO — Dependencias vulnerables

**No incluido en esta ficha.** No se ejecutó un escaneo de CVE contra el SBOM, así que aquí no se
afirma ni «0 CVE» ni «N CVE». Forma parte del informe completo, no de esta ficha.

---

## 4. EXPOSICIÓN — Arquitectura de seguridad (Electron)

| Vector | Estado | Evidencia |
|---|---|---|
| `contextIsolation` | ✅ **`true`** | artefacto (`literal true`) + fuente `WindowBuilder.ts:55` |
| `nodeIntegration` | ✅ **`false`** | artefacto (`literal false`) + fuente `WindowBuilder.ts:54` |
| `sandbox` | 🔴 **`false`** (explícito) | artefacto (`literal false`) + fuente `WindowBuilder.ts:57` + **bytes del bundle** (`sandbox: false`) |
| `spellcheck` | `false` (explícito) | artefacto + fuente `WindowBuilder.ts:56` |
| `preload` | **dinámico** (`preloadPath`) | artefacto (`dynamic: preloadPath`) + fuente `WindowBuilder.ts:53` + bytes (`preload: preloadPath,`) |
| CSP | **no medida** | ver §6.2 |
| `@electron/remote` | 🔴 **habilitado para la ventana principal** | fuente `WindowBuilder.ts:13` (`require('@electron/remote/main')`) y `:75` (`remoteMain.enable(this.win.webContents)`) + SBOM |

**Lectura correcta de `sandbox: false`:** no significa «sin aislamiento de contexto». Significa que
el proceso renderer **no** corre dentro del sandbox del sistema operativo de Chromium. Con
`contextIsolation: true` y `nodeIntegration: false`, el renderer sigue sin acceso directo a Node;
el impacto de un compromiso del renderer es mayor, pero **no se convierte por sí solo en ejecución
de código en el sistema**. Es configuración, y se reporta como configuración.

**Sobre `@electron/remote`:** Electron retiró este módulo del núcleo por su superficie de riesgo y
lo mantiene como paquete aparte, precisamente porque permite al renderer alcanzar objetos del
proceso main. Aquí está **habilitado** para la ventana principal y es **dependencia directa**. Lo
que no se pudo determinar es qué llega a exponerse al renderer: depende del preload, y el preload
es dinámico (§4.2 y §6.2).

### 4.1 Canales IPC expuestos

Registros con **canal literal** en el proceso main, según el artefacto:

| Tipo | Nº | Canales |
|---|---|---|
| `ipcMain.handle` (con respuesta) | **11** | `bksConfigSource`, `closeWindow`, `fileHelpers:save`, `isFullscreen`, `isMaximized`, `maximizeWindow`, `minimizeWindow`, `platformInfo`, `requestPorts`, `setFullscreen`, `unmaximizeWindow` |
| `ipcMain.on` (escuchas) | **10** | entre ellas `menu-click` y `userActive`; una (`oe`) con nombre **no verificable** |

**Doble verificación de los 11:** el artefacto los extrae del AST y el grep sobre los bytes del
bundle devuelve **exactamente los mismos 11** canales en llamadas `handle("…")`. Coinciden.

**Validación de remitente:** el artefacto declara **0 observaciones**. En los ficheros revisados
(`security.ts`, `WindowBuilder.ts`, `queryHandlers.ts`) **no se identificó** un validador de
remitente. No se afirma que no exista: se declara en §6.2.

> 🔴 **El total de canales es mayor que 21.** `apps/studio/src/handlers/queryHandlers.ts` declara
> los canales `query/execute` y `query/cancel` como claves de un objeto, y **ninguno de los dos
> aparece** entre los 21 registros resueltos. Es decir: hay registros que el análisis estático no
> resolvió. Publicar «21 canales» como total sería falso; el total **no está determinado**.

### 4.2 Puente preload

| Aspecto | Valor | Fuente |
|---|---|---|
| Ruta del preload | **dinámica** (`preloadPath`) | artefacto + fuente + bytes |
| `preload_entrypoints` resueltos | **0** | artefacto |
| `context_bridge_apis` / miembros expuestos | **0 / 0** (no resueltos, no «ninguno») | artefacto |

> **Hallazgo — «preload dinámico no resoluble»:** la ruta se construye en runtime, así que ningún
> análisis estático sabe **qué fichero** corre en el lado privilegiado. Consecuencia: no se puede
> demostrar qué APIs llegan al renderer. No es un límite del método: es un **hallazgo**, y se
> repite como pregunta exacta en §6.2.

---

## 5. SECRETOS EMBEBIDOS

**No incluido en esta ficha.** No se ejecutó un escaneo de secretos sobre el bundle. No se afirma
«0 secretos».

---

## 6. LÍMITES Y DESCONOCIDOS

### 6.1 Limitaciones del análisis

- El análisis es **estático**: no ejecuta la app ni afirma su comportamiento en runtime.
- La evidencia se generó sobre **`dist/main.js`** (proceso main), no sobre el renderer completo. El
  sujeto registrado es el directorio `jsdir` que el pipeline crea al copiar ese fichero: **no** es
  el `.asar` completo.
- El grafo retenido está **recortado al tope de 100.000 nodos** (`truncated: true`, cobertura
  `partial`). Los conteos de §4 son los que declara el analizador; **no** se recalcularon sobre el
  grafo retenido.
- Solo se observan las dependencias **empaquetadas** en el `.asar` (1.603), no las de compilación.
- El SBOM del `.asar` **no incluye el runtime de Electron**: la versión 39.8.10 es declaración del
  repositorio, no medida del binario.

### 6.2 Lo que NO se pudo determinar

| Pregunta | Por qué no se pudo responder | Cómo se podría resolver |
|---|---|---|
| **¿Qué preload carga la ventana?** | la ruta es dinámica (`preloadPath`) | instrumentación en runtime |
| **¿Qué APIs llegan al renderer?** | depende del preload anterior | runtime + revisión del preload compilado |
| **¿Cuántos canales IPC hay en total?** | hay registros por clave dinámica (`query/execute`, `query/cancel` no aparecen) | resolver el bucle de registro o instrumentar `ipcMain` en runtime |
| **¿Valida el remitente cada handler?** | no se identificó un validador; el artefacto declara 0 observaciones | revisar los 11 módulos de handlers + runtime |
| **¿El binario corresponde fichero a fichero al fuente?** | no se recompiló el proyecto (§2.3) | build reproducible y comparación fichero a fichero |
| **¿Hay CVEs en las 1.603 dependencias?** | no se ejecutó escaneo (§3) | escaneo contra OSV/GHSA + contexto de explotabilidad |
| **¿Hay secretos embebidos?** | no se ejecutó escaneo (§5) | escaneo de secretos sobre el bundle |
| **¿Qué CSP aplica la app?** | no se extrajo el HTML/CSP del renderer | leer el `index.html` empaquetado y las cabeceras |

---

## 7. EVIDENCIA

| Qué | Dónde |
|---|---|
| Evidencia del análisis (proceso main) | `evidencia-js.json` · `evidence_id ev_dc211c4b688597c1b42ce2c03ecfc675855a56de6a4985dd2950936a168a2cc2` |
| Muestras verificables en KB (bytes crudos) | `muestras.txt` del run `40368945575` (2.331 B) |
| Run de la evidencia | `40365009151` · repo `albrth647-png/Ghidra` · workflow `rea-audit.yml` |
| Integridad del artefacto | sha256 medido = digest oficial (§2.1) |

**Cómo se verificó cada hecho de §4** (regla: ningún dato con una sola fuente):

| Hecho | Fuente 1 (artefacto) | Fuente 2 (fuente) | Fuente 3 (bytes) |
|---|---|---|---|
| `sandbox: false` | `literal false` | `WindowBuilder.ts:57` | `sandbox: false` |
| `nodeIntegration: false` | `literal false` | `WindowBuilder.ts:54` | — |
| `contextIsolation: true` | `literal true` | `WindowBuilder.ts:55` | — |
| `preload` dinámico | `dynamic: preloadPath` | `WindowBuilder.ts:53` | `preload: preloadPath,` |
| `@electron/remote` habilitado | paquete en SBOM (2.1.3) | `WindowBuilder.ts:13,75` | — |
| 11 handlers literales | 11 nodos `handle` | — | 11 canales `handle("…")` idénticos |

---

## 8. RECOMENDACIONES PRIORIZADAS

1. **Revisar si `sandbox: false` es necesario.** Si no lo es, activarlo; si lo es, documentar por qué
   y qué lo compensa.
2. **Revisar el uso de `@electron/remote`.** Está habilitado para la ventana principal y es
   dependencia directa: confirmar qué necesita y si puede sustituirse por IPC explícito.
3. **Hacer explícita la ruta del preload** (o publicar su hash) para que la superficie privilegiada
   sea auditable de forma estática.
4. **Documentar la validación de remitente** en los handlers IPC (o añadirla donde falte).
5. **Publicar la versión de Electron del binario** (o el SBOM del runtime) para que la declaración
   del repositorio y el artefacto sean la misma cosa.

---

*Ficha generada el 2026-10-26 sobre el artefacto publicado. Una ficha caduca: se fecha, no se
reescribe. Los hechos son los medidos; lo que no se midió está en §6 y no se afirma.*
