// Lógica de la página de un módulo individual (modulo.html?n=X): video + reflexión.

function obtenerParametroN() {
  const params = new URLSearchParams(window.location.search);
  const n = parseInt(params.get("n"), 10);
  return Number.isFinite(n) ? n : null;
}

function construirPreguntasForm(preguntas, respuestasPrevias) {
  const wrap = document.getElementById("preguntas-wrap");
  wrap.innerHTML = "";
  preguntas.forEach((pregunta, i) => {
    const grp = document.createElement("div");
    grp.className = "form-group";
    const valorPrevio = (respuestasPrevias && respuestasPrevias["p" + i]) || "";
    grp.innerHTML = `
      <label for="pregunta-${i}">${pregunta}</label>
      <textarea id="pregunta-${i}" required>${valorPrevio}</textarea>
    `;
    wrap.appendChild(grp);
  });
}

async function guardarRespuesta(damaId, n, preguntas) {
  const respuestas = {};
  preguntas.forEach((_, i) => {
    respuestas["p" + i] = document.getElementById("pregunta-" + i).value.trim();
  });

  const ref = db.collection("damas").doc(damaId);
  const doc = await ref.get();
  const dama = doc.data();
  const progreso = dama.progreso || {};

  progreso["m" + n] = {
    completado: true,
    respuestas,
    fecha: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const totalCompletados = MODULOS.filter((m) => progreso["m" + m.n] && progreso["m" + m.n].completado).length;

  await ref.update({
    progreso,
    totalCompletados,
    ultimaVisita: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

async function iniciarModulo() {
  const damaId = localStorage.getItem("damaId");
  if (!damaId) {
    window.location.href = "index.html";
    return;
  }

  const n = obtenerParametroN();
  const mod = MODULOS.find((m) => m.n === n);
  if (!mod) {
    window.location.href = "modulos.html";
    return;
  }

  const contenido = document.getElementById("contenido-modulo");
  const cargando = document.getElementById("cargando");

  let dama, progreso;
  try {
    const doc = await db.collection("damas").doc(damaId).get();
    if (!doc.exists) {
      window.location.href = "index.html";
      return;
    }
    dama = doc.data();
    progreso = dama.progreso || {};
  } catch (err) {
    console.error(err);
    cargando.innerHTML = '<p style="color:#D6337F;">No pudimos cargar tus datos. Verifica tu conexión o la configuración de Firebase.</p>';
    return;
  }

  // Bloquea el acceso si el módulo anterior no está completo.
  if (n > 1 && !(progreso["m" + (n - 1)] && progreso["m" + (n - 1)].completado)) {
    window.location.href = "modulos.html";
    return;
  }

  const yaCompletado = !!(progreso["m" + n] && progreso["m" + n].completado);

  document.getElementById("modulo-titulo").textContent = mod.titulo;
  document.getElementById("modulo-contador").textContent = `Módulo ${n} de ${TOTAL_MODULOS}`;
  document.getElementById("video-iframe").src = `https://www.youtube-nocookie.com/embed/${mod.youtubeId}`;

  construirPreguntasForm(PREGUNTAS_REFLEXION, yaCompletado ? progreso["m" + n].respuestas : null);

  const btnEnviar = document.getElementById("btn-enviar-reflexion");
  const exitoMsg = document.getElementById("exito-msg");

  if (yaCompletado) {
    exitoMsg.textContent = "✅ Ya completaste este módulo. Puedes actualizar tus respuestas si quieres.";
    exitoMsg.classList.add("visible");
    btnEnviar.textContent = "Actualizar respuesta";
  }

  document.getElementById("form-reflexion").addEventListener("submit", async (e) => {
    e.preventDefault();
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="spinner"></span> Guardando…';
    try {
      await guardarRespuesta(damaId, n, PREGUNTAS_REFLEXION);
      exitoMsg.textContent = "✅ ¡Reflexión guardada! Ya puedes continuar al siguiente módulo.";
      exitoMsg.classList.add("visible");
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Actualizar respuesta";
      actualizarNavegacion(n, true);
    } catch (err) {
      console.error(err);
      exitoMsg.textContent = "No pudimos guardar tu reflexión. Intenta de nuevo.";
      exitoMsg.style.background = "#FDEAF0";
      exitoMsg.style.color = "#D6337F";
      exitoMsg.classList.add("visible");
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar respuesta";
    }
  });

  actualizarNavegacion(n, yaCompletado);

  cargando.classList.add("hidden");
  contenido.classList.remove("hidden");
}

function actualizarNavegacion(n, completado) {
  const nav = document.getElementById("nav-modulos");
  nav.innerHTML = "";

  const btnDashboard = document.createElement("a");
  btnDashboard.href = "modulos.html";
  btnDashboard.className = "btn btn-secondary";
  btnDashboard.textContent = "← Ver todos los módulos";
  nav.appendChild(btnDashboard);

  if (completado && n < TOTAL_MODULOS) {
    const btnSiguiente = document.createElement("a");
    btnSiguiente.href = `modulo.html?n=${n + 1}`;
    btnSiguiente.className = "btn btn-primary";
    btnSiguiente.textContent = "Siguiente módulo →";
    nav.appendChild(btnSiguiente);
  } else if (completado && n === TOTAL_MODULOS) {
    const btnFin = document.createElement("a");
    btnFin.href = "modulos.html";
    btnFin.className = "btn btn-primary";
    btnFin.textContent = "🎉 Ver mi camino completo";
    nav.appendChild(btnFin);
  }
}

document.addEventListener("DOMContentLoaded", iniciarModulo);
