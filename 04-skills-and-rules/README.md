# Skills de agentes: enseñarle a tu agente a hacer bien una tarea

Una **skill (habilidad de agente)** es un paquete reutilizable que le enseña al agente a realizar bien un tipo de tarea. En su forma más simple es una **carpeta con un archivo `SKILL.md`**, que contiene instrucciones, y opcionalmente scripts, documentos de referencia y otros recursos.

> Su rasgo más importante es este: el agente **no la lee siempre**. La carga **cuando la tarea lo requiere**.


### Lo que una skill NO es

- **No es un prompt pegado cada vez.** Un prompt vive en una conversación; una skill vive en el proyecto y se reutiliza.
- **No es una regla.** Las reglas son normas generales que se aplican siempre; la skill es un procedimiento para una tarea concreta.
- **No es una herramienta.** Una herramienta (por ejemplo, un servidor MCP) le da al agente la *capacidad de hacer* algo, como consultar una base de datos. Una skill le enseña *cómo hacerlo bien*.
- **No es una spec.** La spec dice *qué* construir; la skill dice *cómo trabajar* en tareas recurrentes.


```text
TAREA REPETIDA
      ↓
PROCEDIMIENTO IDENTIFICADO
      ↓
SKILL (descripción + instrucciones + recursos)
      ↓
ACTIVACIÓN (el agente la carga cuando corresponde)
      ↓
EJECUCIÓN (guiada por reglas, contexto y spec)
      ↓
VERIFICACIÓN (con y sin skill)
      ↓
MEJORA
```

## Anatomía de una skill

```text
add-api-endpoint/
├── SKILL.md           ← obligatorio: metadatos + instrucciones
├── references/        ← opcional: documentos de apoyo
│   └── conventions.md
├── scripts/           ← opcional: código que el agente ejecuta
│   └── check-endpoint.sh
└── assets/            ← opcional: plantillas y otros archivos
    └── endpoint.template.ts
```

Solo `SKILL.md` es obligatorio. Tiene dos partes: un encabezado (*frontmatter*) con el nombre y la descripción, y un cuerpo con las instrucciones.

Esta es una skill pequeña para nuestro caso:

```markdown
---
name: add-api-endpoint
description: Agrega un nuevo endpoint a la API de tickets siguiendo las
  convenciones del proyecto (ruta, validación, permisos, pruebas y
  documentación). Úsala cuando se pida crear o ampliar un endpoint REST.
---

# Agregar un endpoint a la API de tickets

## Antes de empezar
1. Lee la spec de la funcionalidad y localiza sus criterios de aceptación.
2. Si algo en la spec es ambiguo, pregunta antes de implementar.

## Pasos
1. Define la ruta siguiendo el patrón `/api/tickets/...`.
2. Valida la entrada antes de procesarla.
3. Comprueba que el usuario tiene permiso para esa acción.
4. Implementa la lógica en el servicio, no en el controlador.
5. Escribe una prueba por cada criterio de aceptación de la spec.
6. Actualiza la documentación de la API.

## Qué NO hacer
- No agregues dependencias nuevas.
- No modifiques endpoints existentes.

## Definición de terminado
- [ ] Todas las pruebas pasan
- [ ] Cada criterio de aceptación tiene una prueba
- [ ] La documentación refleja el nuevo endpoint
```

Observa algo: la skill **no repite lo que la spec ya dice**. Le indica al agente que *use la spec* como referencia. Así las tres piezas trabajan juntas: la spec define qué construir, la skill define cómo trabajar y las reglas siguen aplicándose de fondo.

**Portabilidad.** El formato de skills se publicó como un estándar abierto, y hoy varias herramientas de agentes lo soportan. Eso significa que una skill bien escrita no te ata a una sola herramienta. Lo que sí varía entre herramientas es **la carpeta donde buscan las skills**. Como referencia, estas son las ubicaciones habituales en dos de las herramientas más conocidas:
 
| Herramienta | Skills del **proyecto** (viajan con el repositorio) | Skills **personales** (tuyas, en todos tus proyectos) |
|---|---|---|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` |
| **GitHub Copilot** | `.github/skills/`, `.claude/skills/` o `.agents/skills/` | `~/.copilot/skills/` o `~/.agents/skills/` |
 
En ambos casos, cada skill es **una subcarpeta con su propio `SKILL.md`**. Por ejemplo, la skill de esta clase quedaría en `.claude/skills/add-api-endpoint/SKILL.md` o en `.github/skills/add-api-endpoint/SKILL.md`, y el nombre de la carpeta suele coincidir con el campo `name`.


> **Importante:** estas rutas son una foto de hoy. Las herramientas evolucionan rápido, así que antes de usarlas confirma la ubicación en la documentación vigente de la que utilices.


## Cómo crear una buena skill

Una skill no se escribe de memoria desde cero. Se **extrae de una tarea real**. Este es el proceso:


![create-skills](../00-assets/img/create-skills.png)

### Principios de redacción

| Principio | Por qué importa |
|---|---|
| **Una skill, una tarea** | Una skill que hace de todo se activa mal y es difícil de mantener |
| **Cuerpo corto** | Lo que carga se paga en contexto. La especificación recomienda mantener el cuerpo por debajo de unas 500 líneas |
| **Detalle en archivos aparte** | Si algo se necesita solo a veces, ponlo en `references/` y menciónalo en el cuerpo |
| **Explica el porqué** | "Valida la entrada *para evitar datos corruptos*" ayuda al agente a decidir en casos no previstos |
| **Scripts para lo exacto** | Si un paso debe ser determinista (formatear, validar, calcular), un script es más fiable que una instrucción |
| **Incluye un ejemplo** | Un ejemplo de entrada y salida esperada vale más que tres párrafos |


## ¿La skill realmente ayuda? Verificarla

Escribir una skill no garantiza que funcione, igual que una spec no garantiza código correcto. Hay que **verificarla**, con la misma mentalidad del apunte de SDD. Compara el trabajo **con y sin la skill**, y revisa tres cosas:

| Qué verificar | Pregunta |
|---|---|
| **Activación** | ¿Se activa cuando debe? ¿Y no se activa cuando no debe? |
| **Calidad** | ¿El resultado cumple la definición de "terminado"? ¿Es más consistente que sin la skill? |
| **Costo** | ¿Aporta más de lo que consume en contexto? |


> **Idea clave:** una skill es un artefacto que se prueba y se mejora. Si no la verificas, solo tienes la esperanza de que funcione.


## Errores frecuentes

**1. Descripción vaga o demasiado amplia.**
*Ejemplo:* "Ayuda con el backend." Se activa en cualquier cosa o en nada. *Cómo evitarlo:* di qué hace y cuándo usarla, con palabras que aparecerían en una petición real.

**2. Una skill gigante.**
*Ejemplo:* un `SKILL.md` de 800 líneas que cubre endpoints, base de datos, despliegue y pruebas. *Cómo evitarlo:* divídela por tarea y mueve el detalle ocasional a archivos de referencia.

**3. Confundir regla con skill.**
*Ejemplo:* poner "usa camelCase" dentro de una skill que solo se activa a veces, o meter un procedimiento de diez pasos en las reglas que se cargan siempre. *Cómo evitarlo:* lo que aplica siempre, regla; lo que es un procedimiento específico, skill.

**4. Instalar o ejecutar código sin revisar.**
*Ejemplo:* descargar una skill de un tercero con scripts y dejar que el agente los ejecute sin leerlos. *Cómo evitarlo:* trata las skills como código: revisa qué hacen sus scripts y qué permisos requieren antes de usarlas, y no guardes secretos ni datos sensibles dentro de ellas.

**5. Escribirla y no probarla.**
*Ejemplo:* asumir que, como el texto "se ve bien", la skill funciona. *Cómo evitarlo:* pruébala con tareas reales y revisa activación, calidad y costo. Y actualízala cuando el proyecto cambie, porque una skill desactualizada enseña mal.

> **Para recordar:** una skill es conocimiento procedimental con fecha de caducidad. Si el proceso cambia, la skill también debe cambiar.


## Para profundizar

- **Anthropic, "Introducing Agent Skills"**: anuncio original del formato. https://www.anthropic.com/news/skills
- **Anthropic Engineering, "Equipping agents for the real world with Agent Skills"**: explica la carga progresiva y el diseño de las skills. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **Especificación abierta de Agent Skills**: formato de `SKILL.md`, campos y recomendaciones de tamaño. https://agentskills.io/specification
- **Documentación de tu herramienta de agentes**: dónde se guardan las skills y cómo se activan puede variar; consulta siempre la versión vigente.