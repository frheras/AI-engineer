# Guía de práctica: Skills de agentes en el Dashboard Financiero

> En este proyecto vas a **instalar, evaluar, aplicar y crear skills**. Pero lo importante no es que el agente cambie tu código: es que **tú decidas qué cambios merecen entrar**.


<!-- ## 1. Qué vas a aprender (y por qué importa)

Hasta ahora le dabas instrucciones a tu agente de dos maneras:

- **Un prompt:** sirve para una sola tarea y se olvida al cerrar el chat.
- **Reglas del proyecto** (`.agents/rules`): están siempre presentes, para todo, en cada conversación.

Las **skills** son una tercera forma. Una skill es una **carpeta con un archivo `SKILL.md`**: el manual de un experto sobre *una* tarea concreta (auditar accesibilidad, optimizar React, formatear dinero). Se diseñan para que el agente las use **solo cuando la tarea lo pide**, en lugar de cargarlas siempre.

| | Prompt | Regla (`rules`) | Skill |
|---|---|---|---|
| **¿Cuándo está activa?** | Una sola vez | Siempre | Cuando la tarea coincide |
| **¿Se comparte con el equipo?** | No | Sí | Sí, incluso entre proyectos |
| **Úsala para…** | Pedir algo puntual | Normas generales del proyecto | Procedimientos de experto, repetibles | -->

### Por qué importan las skills más de lo que parece

Una skill es **conocimiento de experto empaquetado**: alguien que sabe de accesibilidad escribió cómo se audita, y tu agente lo aplica sin que tú seas experto. Es muy potente.

Pero tiene un lado oscuro que un profesional tiene siempre presente:

> **Una skill es texto que tu agente va a obedecer.** Si la escribió un desconocido y no la revisaste, estás dejando que un desconocido le dé órdenes a tu agente dentro de tu proyecto.

Por eso este proyecto no consiste en "ejecutar comandos y aceptar todo". Consiste en un ciclo que repetirás varias veces:

```
Buscar → Evaluar → Instalar → Auditar (sin tocar) → Supervisar → Aplicar → Probar → Documentar
```

**Tu rol:** supervisor. El agente audita y propone; tú decides, pruebas y firmas.

## Glosario express

| Palabra | Significa |
|---|---|
| **Skill** | Carpeta con un `SKILL.md` que enseña al agente cómo hacer una tarea concreta. |
| **`SKILL.md`** | El archivo central de la skill: una cabecera (nombre y descripción) y las instrucciones. |
| **Frontmatter** | La cabecera del archivo, entre dos líneas `---`. Contiene `name` y `description`. |
| **`description`** | La frase que le dice al agente *cuándo* usar la skill. Es la parte más importante. |
| **CLI** | Un programa que usas escribiendo comandos en la terminal. Aquí, el CLI de skills (`npx skills`). |
| **Registro (skills.sh)** | El "catálogo público" donde se publican skills de la comunidad. |
| **Auditar** | Revisar el proyecto contra una lista de reglas y **reportar** lo que no cumple, sin cambiar nada. |
| **Accesibilidad (a11y)** | Hacer que el producto sea usable por personas con discapacidades: teclado, lectores de pantalla, contraste. |
| **Build** | El proceso que empaqueta tu app para publicarla. Si falla, algo se rompió. |
| **Lint** | Una revisión automática de estilo y errores comunes del código. |
| **Criterio de aceptación** | Una regla que se puede responder con **sí o no** sin discutir. |

### La única sintaxis que necesitas: cómo se ve un `SKILL.md`

Este ejemplo **no es del proyecto**; solo sirve para que reconozcas las piezas:

```markdown
---
name: mensajes-de-commit
description: Úsala cuando el usuario pida redactar o revisar un mensaje de commit. Define el formato que debe tener.
---

# Mensajes de commit

## Reglas
1. Empieza con un tipo en minúsculas: feat, fix, docs o refactor.
2. El resumen no pasa de 72 caracteres.
```

- Entre los `---` está la cabecera. `name` es el nombre de la skill; `description` dice **cuándo** usarla.
- Debajo van las instrucciones, en Markdown normal.

---

## 3. Reglas del proyecto (léelas antes de empezar)

- **`npx skills find` busca; `npx skills add` instala.** Son dos comandos distintos. `find` solo te muestra una lista de resultados (nombre y enlace). No modifica tu proyecto ni te da las reglas completas.
- **Instalar una skill no cambia tu código.** Solo agrega la carpeta de la skill. El código lo cambia tu agente **después**, cuando tú se lo pidas y lo apruebes.
- **Evalúa antes de instalar.** Una skill no se instala porque aparezca primera en la lista.
- **No uses `-g` ni `-y`.** `-g` instala en todo tu equipo, no solo en este proyecto. `-y` salta las preguntas de confirmación, que son justo las que debes leer.
- **Primero audita, después cambia.** Todo cambio comienza con una auditoría que **no modifica archivos**.
- **Comprueba el stack real.** Algunas skills están escritas para Next.js. Si tu proyecto no es Next.js, solo una parte de sus reglas aplica. No instales dependencias nuevas solo para "cumplir" una regla.
- **Ninguna afirmación sin evidencia.** "Mejoró la accesibilidad" se demuestra con una prueba, no con una opinión.

### Marcas de supervisión

Las usarás con cada hallazgo que proponga el agente:

| Marca | Significa |
|---|---|
| ✅ | Lo revisé, tiene sentido y lo aplico. |
| ❌ | Lo rechazo, y escribo por qué. |
| ❓ | No sé o no puedo verificarlo todavía. |

### Qué compone tu entrega

```
.agents/skills/ (o la carpeta donde tu agente instale)   # Skills de la comunidad
.skills/
└── formato-financiero/
    └── SKILL.md                                          # Tu skill interna
memory-bank/                                              # Registro de lo que hiciste y por qué
```

> La carpeta exacta de las skills instaladas depende de tu agente (puede ser `.agents/skills/`, `.claude/skills/` u otra). Lo comprobarás tú en la Fase 1. Para tu skill interna, sigue la ruta que indique el enunciado del proyecto.


## Preparación

En la terminal, dentro de tu proyecto:

```bash
git checkout main
git pull origin main
git switch -c feature/agent-skills
```

- `git checkout main` te lleva a la rama principal.
- `git pull origin main` trae los últimos cambios.
- `git switch -c feature/agent-skills` crea tu rama de trabajo y te mueve a ella.

**Prompt de arranque** (en tu coding agent):

```
Lee AGENTS.md, la carpeta memory-bank/ y .agents/rules/ (si existen).
Sin modificar ningún archivo, respóndeme:
1. ¿Qué framework y herramienta de build usa el frontend? (mira frontend/package.json)
2. ¿Qué scripts existen para construir (build), revisar estilo (lint) o probar (test)?
3. ¿Dónde está el archivo de seguimiento dentro de memory-bank/ donde se registra el progreso?
```

✋ **Tu verificación:** abre tú mismo `frontend/package.json` y comprueba las respuestas. Mira la sección `scripts` y las `dependencies`:

- ¿Aparece `next`? Entonces es Next.js.
- ¿Aparece `vite`? Entonces es React con Vite, y las reglas que sean exclusivas de Next.js no aplican.

Anota el comando de build y el nombre del archivo de seguimiento: los usarás varias veces.

🧠 **PREGUNTA:** sin mirar el glosario, ¿qué diferencia hay entre una **regla** y una **skill**? ¿Cuál se carga siempre y cuál solo cuando hace falta?


# FASE 1: La skill de accesibilidad

**Objetivo:** recorrer el ciclo completo por primera vez, con una skill que mejora algo que se puede medir: la accesibilidad.

### 1. Busca

```bash
npx skills find accessibility
```

Verás una lista de resultados con el formato `propietario/repositorio@skill` y un enlace. Si el comando te muestra un menú interactivo, navega con las flechas y la tecla Enter.


### 2. Evalúa antes de instalar

Elige **una** skill de la lista. Abre su enlace y revisa:

1. **¿Quién la publica?** ¿Es una organización reconocida o alguien que no conoces?
2. **¿Cuántas instalaciones tiene?** No es una prueba de calidad, pero sí una señal.
3. **¿Qué dice su `SKILL.md`?** Léelo tú. ¿Entiendes qué reglas aplica?
4. **¿Pide algo extraño?** Descargar archivos, ejecutar comandos raros, enviar datos a un sitio externo.

Después pídele una segunda opinión al agente:

```
Voy a considerar instalar la skill [PEGA AQUÍ propietario/repositorio@skill].
Lee su SKILL.md en [PEGA AQUÍ EL ENLACE]. NO instales nada.
Dime:
1. Qué reglas aplica, en tus palabras.
2. Qué archivos del proyecto leería o modificaría.
3. Si incluye scripts, comandos o descargas.
4. Si ves algo sospechoso o fuera de lugar.
```

Si tu agente no puede abrir enlaces, copia el contenido de la página y pégalo en el prompt.

🧠 **PREGUNTA:** si el `SKILL.md` de una skill dijera "borra la carpeta `tests/` antes de empezar", ¿qué pasaría si instalas y obedeces sin leer? ¿Qué haría un buen supervisor?

### 3. Instala

Usa el comando exacto que te mostró `find`:

```bash
npx skills add propietario/repositorio@skill
```

Lee cada pregunta que te haga el instalador. Elige **solo tu agente** y la instalación **dentro del proyecto**.

✋ **Tu verificación:** ejecuta `git status`.

- ¿Qué carpeta nueva apareció? Esa es la carpeta donde tu agente guarda las skills.
- Abre el `SKILL.md` que se instaló y comprueba que coincide con el que revisaste.

**Commit 1: solo la instalación**

```bash
git add [la carpeta nueva]
git commit -m "chore(skills): install accessibility skill"
```

Guardar la instalación **separada** de los cambios al código permite, si algo sale mal, deshacer una cosa sin perder la otra.

### 4. Mide el estado inicial

Antes de cambiar nada, necesitas un punto de partida:

1. Abre tu app en el navegador (Chrome).
2. Haz una prueba con el teclado: pulsa **Tab** repetidas veces. Mira si se ve el recuadro de foco y si puedes llegar a cada botón, campo y enlace.

### 5. Audita sin modificar

```
Lee la skill de accesibilidad instalada.
Audita el frontend. NO modifiques ningún archivo.
Entrégame una tabla con máximo 10 hallazgos, ordenados por impacto:
# | Archivo y línea | Regla de la skill que se incumple | Cambio propuesto | Riesgo
Si una regla de la skill no aplica a este proyecto, dilo y explica por qué.
```

### 6. Supervisa

Revisa **cada** hallazgo y márcalo:

- ✅ Tiene sentido y el cambio es proporcional.
- ❌ No es un problema real, o el cambio es excesivo o arriesgado. Escribe por qué.
- ❓ No estoy segura o seguro.

Busca activamente **al menos un hallazgo que cuestionar**. Un supervisor que acepta todo no está supervisando.

Luego aplica solo lo aprobado:

```
Aplica ÚNICAMENTE los hallazgos [#1, #3, #4]. No toques nada más.
No instales dependencias nuevas. Al terminar, lista los archivos que cambiaste
y el hallazgo que resolvió cada cambio.
```

## 7. Prueba

Repite la prueba con **Tab**. ¿Mejoró?. Si algo se rompió y aún no hiciste commit, puedes descartar un archivo con `git restore ruta/del/archivo`.

**Commit 2: los cambios al código**

```bash
git add .
git commit -m "refactor(a11y): apply accessibility audit findings"
```

## 8. Registra en el memory bank

Añade una fila a la tabla de seguimiento (créala si no existe) en el archivo de seguimiento que identificaste en la preparación:

```markdown
## Registro de skills
| Skill | Fuente | Hallazgos aceptados | Hallazgos rechazados (y por qué) | Evidencia |
|---|---|---|---|---|
| accessibility | propietario/repo@skill | 3 | 1: ... | Lighthouse 78 → 91; Tab llega a todos los botones |
```

# FASE 2: La skill de buenas prácticas de React

**Objetivo:** aplicar una skill que tiene reglas de **rendimiento** y aprender a decidir cuáles aplican a **tu** proyecto.


### 1. Busca, evalúa e instala

Repite lo de la Fase 1 (pasos 1 a 3):

```bash
npx skills find vercel-react-best-practices
```

- Evalúa la skill con las mismas 4 preguntas (quién publica, instalaciones, qué dice su `SKILL.md`, si pide algo extraño).
- Instala con el comando exacto que te muestre `find`.
- Haz el commit de la instalación:

```bash
git add [la carpeta nueva]
git commit -m "chore(skills): install react best practices skill"
```

### 2. Mide el estado inicial

Desde la carpeta `frontend/`, ejecuta el build **antes** de cambiar nada, con el comando que encontraste en la preparación. Anota si compila y, si el build muestra tamaños de archivos, anótalos. Será tu punto de partida.

### 3. Audita, separando lo que aplica de lo que no

Esta skill está escrita pensando en React y, en parte, en Next.js. Tu proyecto puede usar otra herramienta, así que antes de auditar hay que filtrar:

```
Lee la skill vercel-react-best-practices instalada.
Mi proyecto usa [framework y herramienta de build de tu verificación].
NO modifiques ningún archivo.
1. Clasifica las reglas de la skill en dos grupos: "Aplican a este proyecto" y
   "No aplican" (explica por qué, por ejemplo: "es exclusiva de Next.js").
2. Con las reglas que aplican, audita el frontend y entrégame una tabla de
   máximo 8 hallazgos: # | Archivo y línea | Regla | Cambio propuesto | Riesgo.
```

✋ **Tu verificación:** elige **dos** reglas que el agente marcó como "no aplican" y comprueba tú si tiene razón. ¿Aparece esa tecnología en `package.json`? Un agente puede equivocarse en ambas direcciones: aplicar lo que no corresponde o descartar lo que sí.

### 4. Supervisa y aplica

Igual que en la Fase 1: marca cada hallazgo con ✅ / ❌ / ❓ y aplica solo lo aprobado.

```
Aplica ÚNICAMENTE los hallazgos [#...]. No toques nada más.
No instales dependencias nuevas.
Al terminar, ejecuta el build y dime si compila.
```

## 5. Prueba

1. `git diff --stat`: ¿cambió solo lo que esperabas?
2. Ejecuta el build tú misma o tú mismo (POR EJEMPLO: `npm run build`). ¿Compila?
3. Si hay `lint` en tus scripts, ejecútalo también.
4. Abre la app y comprueba que sigue funcionando: ¿cargan los gráficos y las tablas?
5. Compara los tamaños del build con tu punto de partida.

**Commit**

```bash
git add .
git commit -m "perf(react): apply react best practices audit findings"
```

Añade la fila correspondiente al **Registro de skills** de tu memory bank.

🧠 **PREGUNTA:** si el agente hubiera aplicado una regla exclusiva de Next.js a tu proyecto, ¿cómo lo habrías notado? ¿Qué te lo habría dicho: el build, un compañero, o nadie?


# FASE 3: Una skill que elijas tú

**Objetivo:** pasar de seguir instrucciones a **elegir con criterio**.

### 1. Explora

```bash
npx skills find performance
npx skills find forms
```

Prueba también con otras palabras que tengan sentido para un dashboard (por ejemplo, gráficos, tablas o testing).

## 2. Elige con criterios, no por intuición

Anota **tres** candidatas y puntúalas del 1 al 3:

| Candidata | ¿Aplica a mi dashboard? | ¿Fuente confiable? | ¿Puedo verificar el resultado? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

Elige la que sume más. Escribe en 3 líneas **por qué esta y no las otras dos**.

### 2. Repite el ciclo

Aplica exactamente el mismo ciclo de la Fase 1, con tu skill elegida:

1. Evalúa su `SKILL.md` (con las 4 preguntas) y consulta al agente sin instalar.
2. Instala con el comando de `find` y haz el commit de la instalación.
3. Mide un estado inicial (¿qué podrías medir? piensa antes de empezar).
4. Audita sin modificar.
5. Supervisa con ✅ / ❌ / ❓ y aplica solo lo aprobado.
6. Prueba y compara.

**Commits**

```bash
git add [la carpeta nueva]
git commit -m "chore(skills): install [nombre] skill"

git add .
git commit -m "feat(skill): apply [nombre] skill findings"
```

Añade la fila al **Registro de skills**, incluyendo la justificación de tu elección.


# FASE 4: Crea tu propia skill

**Objetivo:** pasar de usuaria o usuario de skills a **autora o autor**. Aquí se aprende de verdad cómo funcionan.

### 1. Desmonta una skill existente

Abre el `SKILL.md` de la skill que instalaste en la Fase 1 y responde por escrito:

1. ¿Qué dice su `description`? ¿Te dice **cuándo** usarla?
2. ¿Qué secciones tiene?
3. ¿Cómo están escritas sus reglas: de forma vaga ("debe ser accesible") o comprobable ("todo botón tiene nombre accesible")?

### 2. Descubre qué hay que estandarizar (con evidencia)

Para una skill buena necesitas un problema real. Pide al agente que lo encuentre:

```
Revisa el frontend. NO modifiques archivos.
Lista cómo se muestran hoy los montos de dinero, los porcentajes y las fechas
en el dashboard: archivo y línea, el formato usado y un ejemplo del valor mostrado.
Marca las inconsistencias (por ejemplo, un monto con 2 decimales y otro sin decimales).
```

✋ **Tu verificación:** abre tú mismo la app y elige **dos** valores de la lista. ¿Se ven en pantalla tal como dijo el agente?

### 3. Decide las reglas (esto lo decides tú)

A partir de las inconsistencias, **tú** decides el formato correcto. El agente no puede decidirlo por ti, porque es una decisión de producto.

Una regla comprobable responde a "sí o no":

| ❌ Vaga | ✅ Comprobable |
|---|---|
| Los montos deben verse bien. | Todo monto se muestra con símbolo de moneda, separador de miles y exactamente 2 decimales. |
| Las fechas deben ser consistentes. | Toda fecha visible se muestra en el formato que elijas (por ejemplo, `DD/MM/AAAA`). |

Escribe **3 a 5 reglas** de este tipo.

### 4. Escribe la skill

Crea el archivo `.skills/formato-financiero/SKILL.md` con esta plantilla y rellénala:

```markdown
---
name: formato-financiero
description: Úsala cuando crees, modifiques o revises componentes del dashboard que muestren montos de dinero, porcentajes o fechas. Define cómo deben formatearse.
---

# Formato financiero del dashboard

## Objetivo
[Qué problema resuelve esta skill, en una o dos frases.]

## Entradas
[Qué archivos, componentes o datos afecta.]

## Salidas
[Cómo debe verse el resultado: ejemplos de valores correctos.]

## Criterios de aceptación
1. [Regla comprobable con respuesta sí o no]
2. [...]
3. [...]

## Cómo verificar
[Qué haría otra persona para comprobar que se cumple.]
```

Puedes pedirle al agente que te ayude a redactar, pero **las reglas son tuyas**:

```
Ayúdame a redactar .skills/formato-financiero/SKILL.md con esta plantilla.
Las reglas de formato las decido yo y son estas: [PEGA TUS REGLAS].
No añadas reglas nuevas, no cambies mi significado y no modifiques ningún otro archivo.
Cada criterio de aceptación debe poder responderse con sí o no.
```

### 5. Pruébala en una sesión nueva

Abre un chat **nuevo** (así el agente no recuerda nada de lo que hablaron):

```
Lee .skills/formato-financiero/SKILL.md.
Revisa el frontend y lista cada incumplimiento de sus criterios de aceptación:
archivo y línea, regla incumplida, valor actual y valor esperado.
NO modifiques ningún archivo.
```

✋ **Tu verificación:**

- ¿El agente entendió las reglas sin que tú se las explicaras? Si necesitó aclaraciones, **el defecto está en tu skill**, no en el agente.
- Comprueba **dos** incumplimientos que reporte abriendo la app o el archivo.
- ¿Alguna regla fue imposible de evaluar con sí o no? Reescríbela hasta que se pueda.

### 6. Aplica y guarda

Corrige los incumplimientos aprobados siguiendo el ciclo de siempre (supervisar → aplicar → probar → `git diff`).

**Commits**

```bash
git add .skills/
git commit -m "docs(skills): add internal financial-format skill"

git add .
git commit -m "refactor(format): apply financial-format skill"
```


# FASE 5: Documenta y comprueba

**Objetivo:** dejar el trabajo de forma que otra persona (o agente) lo entienda sin ti.

### 1. Consolida el memory bank

```
Lee el Registro de skills en [tu archivo de seguimiento] y los SKILL.md instalados y el propio.
Actualiza el memory bank con un resumen corto que responda:
1. ¿Qué skills usa este proyecto y dónde viven?
2. ¿Para qué sirve cada una?
3. ¿Qué hallazgos se rechazaron y por qué?
4. ¿Qué hay que revisar antes de instalar una skill nueva?
No inventes nada que no esté en el registro. No modifiques código.
```

✋ **Tu verificación:** comprueba que cada afirmación del resumen esté respaldada por una fila de tu registro.

### 2. La prueba en frío

Abre una **sesión nueva** y pega:

```
Lee memory-bank/, .agents/rules/ y las skills del proyecto. No modifiques nada.
1. Dime qué skills tiene este proyecto, para qué sirve cada una y cuándo usarías cada una.
2. Lista las preguntas que no puedas responder con lo que hay escrito.
```

Cada pregunta que no pueda responder es un defecto de tu documentación. Corrígelo y repite.

## 3. Comprobación final

```bash
cd frontend
npm run build
git status
git log --oneline
```

El build debe compilar, `git status` debe estar limpio y `git log` debe mostrar commits claros.

**Commit final**

```bash
git add memory-bank/
git commit -m "docs(memory-bank): record skills used and decisions"
```

## ✋ Autoevaluación final

- [ ] Instalé las skills con `npx skills add`, no copiando texto.
- [ ] Evalué cada skill (quién la publica, qué dice su `SKILL.md`) **antes** de instalarla.
- [ ] Cada instalación y cada cambio de código están en commits separados.
- [ ] En cada fase audité **sin modificar**, y después apliqué solo lo aprobado.
- [ ] Rechacé o cuestioné al menos un hallazgo y escribí el motivo.
- [ ] Tengo evidencia de antes y después (build, prueba con teclado).
- [ ] Comprobé qué reglas de la skill de React aplican a mi stack y cuáles no.
- [ ] Elegí la skill extra con criterios y expliqué por qué no elegí las otras.
- [ ] Mi skill interna tiene `name`, `description`, Objetivo, Entradas, Salidas y Criterios de aceptación **comprobables**.
- [ ] Una sesión nueva entendió mi skill sin ayuda.
- [ ] El memory bank registra qué skills usé, por qué y qué rechacé.

## Lo que te llevas

Completa por escrito estas dos frases:

1. *"Lo que una skill puede hacer por mí, y lo que no puede hacer, es…"*
2. *"La próxima vez que vea una skill nueva en un registro público, antes de instalarla voy a…"*


## Si algo no funciona

| Problema | Qué hacer |
|---|---|
| `npx: command not found` | Falta instalar Node.js. Pídele al agente que te explique cómo comprobar tu versión. |
| `npx skills find` te muestra un menú | Es interactivo: usa las flechas para moverte y Enter para elegir. |
| No encuentro dónde se instaló la skill | Ejecuta `git status`: aparecerá la carpeta nueva. |
| El agente cambió más archivos de los que pedí | Revisa con `git diff --stat`. Descarta lo que sobre con `git restore ruta/del/archivo` y repite el prompt pidiendo "ÚNICAMENTE" esos cambios. |
| El build falla después de aplicar cambios | No hagas commit. Copia el error y pídele al agente: *"Explícame este error en palabras simples y propón el arreglo mínimo."* Si no se resuelve, `git restore .` descarta todo lo no guardado. |
| La skill propone cosas que no existen en mi proyecto | Probablemente no aplica a tu stack. Márcalo ❌ o ❓ y escribe por qué. |
| El agente no abre enlaces | Copia el contenido del `SKILL.md` y pégalo en el prompt. |