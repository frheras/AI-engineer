# Guía de proyecto: configuración de tu agente de IA personal con OpenClaw

### Objetivo principal (infraestructura)
Desplegar, configurar y personalizar un asistente de IA privado y autoalojado en un VPS utilizando OpenClaw, conectándolo a un modelo de IA mediante LiteLLM.

### Objetivo de entrega (versionado)
Dado que este proyecto es de infraestructura y no de desarrollo de software, el resultado funcional es la prioridad. No obstante, para cumplir con la entrega, se utilizará un repositorio en GitHub exclusivamente para respaldar los archivos de configuración e identidad del asistente (workspace), aplicando buenas prácticas de seguridad.

## Pasos a seguir

### Paso 1: acceso al VPS
Abre tu terminal o tu editor VS Code, lo que te permitirá recibir asistencia de Copilot si la necesitas.

Conéctate al servidor mediante SSH utilizando las credenciales facilitadas por la plataforma del curso:

```bash
ssh tu_usuario@ip_de_tu_vps
```

### Paso 2: instalación y configuración básica
Sigue estrictamente la guía oficial de instalación de la lección de 4Geeks "Configurando tu asistente de IA personal". El orden de los pasos es importante:

- Instala OpenClaw en el VPS sin omitir fases.
- Conecta el modelo de IA a través de LiteLLM, eligiendo el modelo adecuado según costo, latencia y contexto.
- Inicia el sistema y verifica en el chat local que el asistente responde correctamente antes de continuar.

### Paso 3: personalización del asistente
Una vez que el entorno esté en funcionamiento, personaliza la identidad y el comportamiento del agente conversando directamente con él desde el chat local.

Ejemplo de instrucción que puede enviarse al chat:

> "Quiero configurarte. Establece tu nombre como Kai, tu emoji como 🤖 y tu saludo como '¡Hola, soy Kai, ¿en qué puedo ayudarte hoy?'"

### Paso 4: respaldo del workspace en GitHub
OpenClaw almacena la configuración del asistente y el historial de chats en la carpeta `~/.openclaw/workspace`. Se subirá esta carpeta a GitHub como evidencia de entrega.

#### 1. Generar e integrar la clave SSH en el servidor
Genera una clave SSH para comunicarte de forma segura con GitHub:

```bash
ssh-keygen -t rsa -b 4096 -C "tu_correo@example.com"
```

Inicia el agente SSH y añade la clave privada:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

Muestra la clave pública y cópiala por completo:

```bash
cat ~/.ssh/id_rsa.pub
```

Ve a tu cuenta de GitHub en `Settings > SSH and GPG keys > New SSH key` y pégala.

#### 2. Conectar el workspace y asegurar la privacidad
Navega a la carpeta de trabajo en el VPS:

```bash
cd ~/.openclaw/workspace
```

⚠️ Control de seguridad obligatorio antes del push

Antes de subir el workspace, es necesario asegurarse de no filtrar credenciales, tokens o contraseñas, como archivos `.env` o configuraciones privadas de LiteLLM. Para garantizarlo, se recomienda revisar los archivos y el `.gitignore`:

```bash
ls -la
cat .gitignore
```

Si se detectan archivos con claves secretas, por ejemplo `openclaw.json` o `.env`, deben añadirse explícitamente al `.gitignore` para que Git los ignore automáticamente:

```bash
echo "openclaw.json" >> .gitignore
echo ".env" >> .gitignore
```

De esta forma, la carpeta del workspace se subirá limpia a GitHub, con solo los archivos seguros e identificativos, como `IDENTITY.md`, sin comprometer las credenciales.

#### 3. Inicializar el repositorio y subir la entrega
Crea un repositorio vacío en tu cuenta de GitHub, por ejemplo `openclaw-personal-assistant`.

Ejecuta los siguientes comandos en el VPS para realizar el respaldo:

```bash
git init
git remote add origin git@github.com:tu_usuario/openclaw-personal-assistant.git
git add .
git commit -m "feat: configuracion inicial e identidad de OpenClaw"
git branch -M main
git push -u origin main
```

Por último, verifica en la interfaz de GitHub que los archivos de configuración e identidad se hayan subido correctamente y que no haya información confidencial expuesta.