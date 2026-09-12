// ⚠️ PEGA AQUÍ los datos de tu proyecto de Firebase.
// Los obtienes en: Firebase Console → ⚙️ Configuración del proyecto → General →
// "Tus apps" → app web → "Configuración del SDK".
// Instrucciones completas en README.md.

const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI.firebaseapp.com",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI.appspot.com",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI",
};

// Inicializa Firebase (usa el SDK "compat" cargado por <script> en cada página,
// así no se necesita un paso de compilación para subir el sitio a GitHub Pages).
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
