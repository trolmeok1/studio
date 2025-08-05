# Cómo ejecutar este proyecto localmente y distribuirlo

¡Hola! Esta es una guía rápida para que puedas tener una copia de esta aplicación funcionando en tu propia computadora y para que entiendas cómo tus usuarios pueden "instalarla" en sus teléfonos.

## Aclaración Importante sobre los Costos

Es fundamental que entiendas la diferencia entre usar esta herramienta de desarrollo (Firebase Studio) y los servicios de Firebase que tu aplicación utiliza.

*   **Desarrollar aquí es GRATIS:** La acción de chatear conmigo, generar código, editar tus archivos y sincronizarlos con tu repositorio de GitHub **no tiene ningún costo**. No hay un límite en la cantidad de cambios que puedes hacer. Puedes usar Firebase Studio como tu entorno de desarrollo sin preocuparte por una factura.

*   **Los servicios de Firebase tienen un costo POTENCIAL:** El costo de Firebase se asocia a los recursos que tu aplicación **consume cuando está en producción** (es decir, cuando los usuarios reales la usan). Servicios como Firebase Hosting, Firestore, Authentication, etc., tienen un **generoso nivel gratuito (plan Spark)**. Solo pagarías si tu aplicación se vuelve muy popular y supera los límites de este nivel gratuito. Siempre puedes revisar los límites y precios en la [página oficial de precios de Firebase](https://firebase.google.com/pricing).

En resumen: **Crear y editar no cuesta. Usar los servicios a gran escala, sí.**

---

## Parte 1: Cómo ejecutar el proyecto en tu computadora

Sigue estos pasos para tener una copia funcional en tu máquina local.

### Requisitos

- **Node.js:** Asegúrate de tener instalado Node.js (que incluye npm). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **Git:** Necesitarás Git para subir tu código a GitHub. Puedes descargarlo desde [git-scm.com](https://git-scm.com/).

### Pasos

1.  **Copia los archivos del proyecto:** Necesitarás recrear la estructura de archivos y el contenido en tu computadora. La forma más fácil es copiar el contenido de cada archivo de este entorno a archivos con el mismo nombre y en la misma carpeta en tu máquina local. Los archivos más importantes que necesitarás son `package.json`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json` y toda la carpeta `src/`.

2.  **Crea una carpeta para tu proyecto:** En tu computadora, abre una terminal o línea de comandos y crea una nueva carpeta.

    ```bash
    mkdir mi-proyecto-teamlink
    cd mi-proyecto-teamlink
    ```

3.  **Inicializa el proyecto y copia los archivos:** Dentro de la nueva carpeta, crea los archivos y carpetas para que coincidan con la estructura de este proyecto en la nube y pega el contenido que copiaste.

4.  **Instala las dependencias:** Una vez que tengas el `package.json` en tu carpeta, puedes instalar todas las librerías. En tu terminal, ejecuta:

    ```bash
    npm install
    ```

5.  **Ejecuta la aplicación:** Para iniciar la aplicación en modo de desarrollo, ejecuta:

    ```bash
    npm run dev
    ```

    Esto iniciará un servidor local. Generalmente, podrás ver tu aplicación abriendo **http://localhost:3000** en tu navegador.

---

## Parte 2: Cómo Publicar (Desplegar) tu Aplicación en Internet

Una vez que tengas el proyecto en tu computadora, sigue estos pasos para publicarlo en Firebase Hosting y obtener una URL pública.

### Requisitos Previos

- Haber completado la "Parte 1".
- Tener tu proyecto de Firebase ya creado en la [consola de Firebase](https://console.firebase.google.com/).

### Pasos

1.  **Instala las herramientas de Firebase:** Si no las tienes, abre tu terminal y ejecuta:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Inicia sesión en Firebase:** En la misma terminal, dentro de la carpeta de tu proyecto, ejecuta:
    ```bash
    firebase login
    ```
    Esto abrirá una ventana en tu navegador para que inicies sesión con tu cuenta de Google.

3.  **Configura el Hosting:** Ahora, vincula tu carpeta local con tu proyecto de Firebase. Ejecuta:
    ```bash
    firebase init hosting
    ```
    Sigue las instrucciones que aparecerán:
    - **"Please select an option"**: Elige `Use an existing project`.
    - **Selecciona tu proyecto**: Elige el nombre de tu proyecto de Firebase en la lista.
    - **"What do you want to use as your public directory?"**: Escribe `out` y presiona Enter.
    - **"Configure as a single-page app (rewrite all urls to /index.html)?"**: Escribe `y` y presiona Enter.
    - **"File out/index.html already exists. Overwrite?"**: Escribe `N` (No) y presiona Enter.

4.  **Construye la versión de producción:** Antes de subirla, tienes que "compilar" tu aplicación. Ejecuta:
    ```bash
    npm run build
    ```
    Esto creará una carpeta `out` optimizada para producción.

5.  **¡Despliega!** Este es el último paso. Ejecuta:
    ```bash
    firebase deploy --only hosting
    ```
    Después de unos momentos, la terminal te dará tu **URL de Hosting**. ¡Será algo como `https://tu-proyecto.web.app`!

¡Listo! Ya puedes compartir esa URL con quien quieras.

---

## Parte 3: Cómo "instalar" la aplicación en un teléfono (PWA)

Este proyecto es una **Aplicación Web Progresiva (PWA)**. Se instala directamente desde el navegador y se comporta como una app nativa, **sin necesidad de una tienda de aplicaciones**.

**Punto clave:** La aplicación, una vez "instalada", **NO se abre en el navegador con la barra de direcciones**. Se abre en su propia ventana, a pantalla completa.

### Pasos para que cualquier usuario instale la App:

Una vez que tengas tu URL pública del paso anterior:

1.  **Abrir la URL** en el navegador Google Chrome en un teléfono Android.
2.  El navegador podría mostrar un aviso para **"Añadir a la pantalla de inicio"**.
3.  Si no aparece, el usuario debe tocar el **menú de los tres puntos (⋮)** en la esquina superior derecha.
4.  Seleccionar la opción **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
5.  Confirmar la acción.

Un ícono de la aplicación aparecerá en el menú del teléfono. ¡Así de simple!

---
## (Opcional) Sube tu proyecto a GitHub

Es una excelente práctica guardar tu código en un repositorio de control de versiones como GitHub.

1.  **Crea un nuevo repositorio en GitHub:** Ve a [GitHub.com](https://github.com), inicia sesión y crea un nuevo repositorio. **No** lo inicialices con un archivo `README` o `.gitignore`, déjalo completamente vacío.

2.  **Inicializa Git en tu proyecto local:** En tu terminal, dentro de la carpeta del proyecto, ejecuta:
    ```bash
    git init -b main
    git add .
    git commit -m "Primer commit: Proyecto inicial de TeamLink Hub"
    ```

3.  **Conecta y sube tu código:** GitHub te dará una URL para tu repositorio. Úsala en los siguientes comandos:
    ```bash
    git remote add origin TU_URL_DE_REPOSITORIO_AQUI.git
    git push -u origin main
    ```
