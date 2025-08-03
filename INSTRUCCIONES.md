# Cómo ejecutar este proyecto localmente

¡Hola! Esta es una guía rápida para que puedas tener una copia de esta aplicación funcionando en tu propia computadora.

Como este es un entorno de desarrollo en la nube, no hay un botón de "descarga directa". Sin embargo, puedes replicar el proyecto siguiendo estos pasos.

## Requisitos

- **Node.js:** Asegúrate de tener instalado Node.js (que incluye npm). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **Git:** Aunque no es estrictamente necesario para copiar los archivos, es la herramienta estándar para manejar proyectos de código (opcional pero recomendado).

## Pasos

### 1. Copia los archivos del proyecto

Necesitarás recrear la estructura de archivos y el contenido en tu computadora. La forma más fácil es copiar el contenido de cada archivo de este entorno a archivos con el mismo nombre y en la misma carpeta en tu máquina local.

Los archivos más importantes que necesitarás son:

- `package.json` (¡muy importante para las dependencias!)
- `tailwind.config.ts`
- `next.config.ts`
- `tsconfig.json`
- Toda la carpeta `src/` con sus subcarpetas y archivos.

### 2. Crea una carpeta para tu proyecto

En tu computadora, abre una terminal o línea de comandos y crea una nueva carpeta.

```bash
mkdir mi-proyecto-teamlink
cd mi-proyecto-teamlink
```

### 3. Inicializa el proyecto y copia los archivos

Dentro de la nueva carpeta, crea los archivos y carpetas para que coincidan con la estructura de este proyecto en la nube y pega el contenido que copiaste.

### 4. Instala las dependencias

Una vez que tengas el archivo `package.json` en tu carpeta, puedes instalar todas las librerías y herramientas que hemos usado. En tu terminal, ejecuta:

```bash
npm install
```

Este comando leerá el `package.json` y descargará todo lo necesario (React, Next.js, ShadCN, Tailwind, etc.).

### 5. Ejecuta la aplicación

¡Ya casi está! Para iniciar la aplicación en modo de desarrollo, ejecuta:

```bash
npm run dev
```

Esto iniciará un servidor local. Generalmente, podrás ver tu aplicación abriendo la siguiente dirección en tu navegador web:

**http://localhost:3000** (o el puerto que te indique la terminal).

¡Y listo! Con estos pasos tendrás una réplica exacta de la aplicación funcionando en tu propia computadora, lista para que continúes desarrollándola.