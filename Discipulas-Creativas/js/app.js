// Lógica de la página de inicio: formulario de registro (nombre + distrito + iglesia).
// No usa contraseña — igual que el programa original: si el nombre + iglesia ya
// existen en la base de datos, se retoma el progreso de esa dama.

function normalizarTexto(txt) {
  return (txt || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // quita tildes para comparar
}

function poblarDistritos(selectDistrito) {
  DISTRITOS.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    selectDistrito.appendChild(opt);
  });
}

function poblarIglesias(selectIglesia, distrito) {
  selectIglesia.innerHTML = '<option value="">Selecciona tu iglesia o grupo…</option>';
  const lista = IGLESIAS_POR_DISTRITO[distrito] || [];
  lista.forEach((nombre) => {
    const opt = document.createElement("option");
    opt.value = nombre;
    opt.textContent = nombre;
    selectIglesia.appendChild(opt);
  });
  selectIglesia.disabled = lista.length === 0;
}

async function buscarOCrearDama(nombre, distrito, iglesia) {
  const nombreNormalizado = normalizarTexto(nombre);
  const query = await db
    .collection("damas")
    .where("nombreNormalizado", "==", nombreNormalizado)
    .where("iglesia", "==", iglesia)
    .limit(1)
    .get();

  if (!query.empty) {
    const doc = query.docs[0];
    // Actualiza el nombre visible y última visita, conserva el progreso existente.
    await doc.ref.update({
      nombre: nombre.trim(),
      distrito,
      ultimaVisita: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return doc.id;
  }

  const nuevo = await db.collection("damas").add({
    nombre: nombre.trim(),
    nombreNormalizado,
    distrito,
    iglesia,
    progreso: {},
    totalCompletados: 0,
    fechaRegistro: firebase.firestore.FieldValue.serverTimestamp(),
    ultimaVisita: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return nuevo.id;
}

function iniciarFormularioRegistro() {
  const form = document.getElementById("form-registro");
  const selectDistrito = document.getElementById("select-distrito");
  const selectIglesia = document.getElementById("select-iglesia");
  const inputNombre = document.getElementById("input-nombre");
  const btnSubmit = document.getElementById("btn-comenzar");
  const errorBox = document.getElementById("form-error");

  poblarDistritos(selectDistrito);

  selectDistrito.addEventListener("change", () => {
    poblarIglesias(selectIglesia, selectDistrito.value);
  });

  // Si ya hay una sesión guardada en este dispositivo, ofrece continuar directo.
  const damaGuardada = localStorage.getItem("damaId");
  const nombreGuardado = localStorage.getItem("damaNombre");
  const continuarWrap = document.getElementById("continuar-wrap");
  if (damaGuardada && nombreGuardado && continuarWrap) {
    continuarWrap.classList.remove("hidden");
    document.getElementById("continuar-nombre").textContent = nombreGuardado;
    document.getElementById("btn-continuar").addEventListener("click", () => {
      window.location.href = "modulos.html";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("visible");

    const nombre = inputNombre.value.trim();
    const distrito = selectDistrito.value;
    const iglesia = selectIglesia.value;

    if (!nombre || !distrito || !iglesia) {
      errorBox.textContent = "Por favor completa tu nombre, distrito e iglesia.";
      errorBox.classList.add("visible");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner"></span> Ingresando…';

    try {
      const damaId = await buscarOCrearDama(nombre, distrito, iglesia);
      localStorage.setItem("damaId", damaId);
      localStorage.setItem("damaNombre", nombre.trim());
      window.location.href = "modulos.html";
    } catch (err) {
      console.error(err);
      errorBox.textContent =
        "No pudimos conectar con la base de datos. Verifica tu conexión a internet o que la configuración de Firebase esté correcta.";
      errorBox.classList.add("visible");
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Comenzar mi camino";
    }
  });
}

document.addEventListener("DOMContentLoaded", iniciarFormularioRegistro);
