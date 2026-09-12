# Ministerio de la Mujer ASA — Discípulas Creativas

Sitio web para que las hermanas de la Asociación Sur Andina completen el camino de
11 módulos (video + reflexión) y para que la administradora vea quién cumplió la meta
de certificación.

- **Sin contraseña para las damas**: solo escriben su nombre y eligen distrito e iglesia (igual que el sitio original).
- **Progreso guardado en la nube** (Firebase/Firestore), así que cada dama puede continuar desde otro dispositivo con el mismo nombre e iglesia.
- **Panel de administrador** con usuario y contraseña, que muestra quién completó cada módulo, sus respuestas, y permite exportar todo a CSV.
- Distritos e iglesias precargados desde tu Excel (14 distritos, 97 iglesias/grupos).

---

## 1. Crear el proyecto gratuito de Firebase (10 minutos, una sola vez)

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con una cuenta de Google.
2. **Crear un proyecto** → ponle un nombre, por ejemplo `ministerio-mujer-asa`. Puedes desactivar Google Analytics (no lo necesitas).
3. Dentro del proyecto, entra a **Compilación → Firestore Database → Crear base de datos**.
   - Elige **modo de producción**.
   - Elige la ubicación más cercana (por ejemplo `southamerica-east1`).
4. Ve a **Compilación → Authentication → Comenzar** → pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
5. En **Authentication → Users → Add user**, crea el usuario administrador (el correo y contraseña que usará la líder para entrar al panel). Puedes crear varios.
6. Ve a **Firestore Database → Reglas**, borra lo que haya y pega el contenido del archivo [`firestore.rules`](./firestore.rules) de esta carpeta. Haz clic en **Publicar**.
7. Ve a **⚙️ Configuración del proyecto** (el engranaje, arriba a la izquierda) → pestaña **General** → baja hasta "Tus apps" → clic en el ícono `</>` (Web) → dale un nombre (ej: "sitio") → **Registrar app**. Firebase te mostrará un bloque `firebaseConfig = { ... }`.
8. Copia esos valores (apiKey, authDomain, projectId, etc.) y pégalos en el archivo **`js/firebase-config.js`** de este proyecto, reemplazando los textos `PEGA_AQUI...`.

Con esto tu sitio ya puede leer y escribir en tu propia base de datos, sin costo (el plan gratuito de Firebase alcanza sobradamente para un ministerio de este tamaño).

---

## 2. Subir el sitio a GitHub

1. Crea un repositorio nuevo en GitHub (puede ser público o privado), por ejemplo `ministerio-mujer-asa`.
2. Desde tu computador, dentro de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Sitio Discípulas Creativas - Ministerio de la Mujer ASA"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/ministerio-mujer-asa.git
   git push -u origin main
   ```
3. En GitHub, entra al repositorio → **Settings → Pages**.
   - En "Source" elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
   - Guarda. En 1–2 minutos tu sitio quedará publicado en:
     `https://TU-USUARIO.github.io/ministerio-mujer-asa/`

Comparte ese enlace con las damas. El panel de administrador queda en:
`https://TU-USUARIO.github.io/ministerio-mujer-asa/admin/login.html`

> 💡 Si prefieres no usar Git desde la terminal, también puedes arrastrar todos estos archivos y carpetas directamente a la página web de tu repositorio en GitHub ("Add file → Upload files").

---

## 3. Estructura del sitio

```
index.html              Página de inicio y registro (nombre, distrito, iglesia)
modulos.html             Panel de la dama: sus 11 módulos y su progreso
modulo.html              Un módulo: video de YouTube + preguntas de reflexión
admin/login.html         Ingreso del administrador
admin/panel.html         Panel de seguimiento de todas las damas
css/style.css            Estilos generales (colores lila y rosa)
css/admin.css            Estilos del panel de administrador
js/firebase-config.js    ⚠️ Aquí van tus claves de Firebase (paso 1)
js/data-distritos.js     Distritos e iglesias (generado desde tu Excel)
js/modulos-data.js       Los 11 módulos: título, video de YouTube y preguntas
js/app.js                Lógica del registro
js/modulos.js            Lógica del panel de módulos
js/modulo.js             Lógica de un módulo (video + reflexión)
js/admin-login.js        Lógica de acceso del administrador
js/admin-panel.js        Lógica del panel de seguimiento
assets/img/logo.png      Logo del Ministerio de la Mujer
firestore.rules          Reglas de seguridad de la base de datos (paso 1.6)
```

## 4. Cosas que puedes personalizar tú misma

- **Títulos de los módulos**: abre `js/modulos-data.js` y cambia el texto `titulo` de cada módulo (por ahora dicen "Módulo 1", "Módulo 2"…, puedes ponerles el nombre real de cada video).
- **Preguntas de reflexión**: en el mismo archivo, en `PREGUNTAS_REFLEXION`, hoy son las mismas 2 preguntas para todos los módulos (igual que el sitio original). Si quieres preguntas distintas por módulo, dime y te ayudo a ajustarlo.
- **Colores**: en `css/style.css`, arriba del todo, están las variables `--lila`, `--rosa`, etc.
- **Logo**: reemplaza el archivo `assets/img/logo.png` por otro con el mismo nombre.
- **Distritos/iglesias**: si la lista cambia, dime y regenero `js/data-distritos.js` desde un nuevo Excel.

## 5. Cómo funciona por dentro (resumen)

- Cuando una dama se registra, se crea (o se reutiliza, si ya existía) un documento en la colección `damas` de Firestore con su nombre, distrito, iglesia y su progreso.
- El progreso se guarda como `progreso.m1`, `progreso.m2`, … `progreso.m11`, cada uno con `completado`, sus respuestas y la fecha.
- Los módulos se desbloquean en orden: para ver el módulo 3 debe haber completado el 2 (así funciona como un verdadero "camino").
- El panel de administrador solo lo puede ver quien haya iniciado sesión con un usuario creado en el paso 1.5, y allí se ve el avance de cada dama, sus respuestas y se puede exportar todo a CSV para tus reportes de certificación.

Cualquier ajuste que necesites (agregar más módulos, cambiar el flujo, agregar certificado descargable más adelante, etc.) dime y lo hacemos.
