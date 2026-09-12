// Lógica del panel de administrador: lista y filtra a todas las damas registradas
// y su avance en el camino de Discípulas Creativas.

let TODAS_LAS_DAMAS = [];

function formatearFecha(ts) {
  if (!ts || !ts.toDate) return "—";
  const d = ts.toDate();
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function contarCompletados(progreso) {
  return MODULOS.filter((m) => progreso && progreso["m" + m.n] && progreso["m" + m.n].completado).length;
}

function poblarFiltroDistrito() {
  const select = document.getElementById("filtro-distrito");
  DISTRITOS.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });
}

function renderStats(damas) {
  const total = damas.length;
  const completas = damas.filter((d) => contarCompletados(d.progreso) === TOTAL_MODULOS).length;
  const enProgreso = damas.filter((d) => {
    const c = contarCompletados(d.progreso);
    return c > 0 && c < TOTAL_MODULOS;
  }).length;
  const sinEmpezar = total - completas - enProgreso;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-completas").textContent = completas;
  document.getElementById("stat-progreso").textContent = enProgreso;
  document.getElementById("stat-sin-empezar").textContent = sinEmpezar;
}

function renderTabla(damas) {
  const tbody = document.getElementById("tabla-body");
  tbody.innerHTML = "";

  if (damas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--texto-suave); padding:30px;">No hay damas que coincidan con el filtro.</td></tr>`;
    return;
  }

  damas.forEach((dama) => {
    const completados = contarCompletados(dama.progreso);
    const porcentaje = Math.round((completados / TOTAL_MODULOS) * 100);
    const completo = completados === TOTAL_MODULOS;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${dama.nombre}</strong></td>
      <td>${dama.distrito || "—"}</td>
      <td>${dama.iglesia || "—"}</td>
      <td>
        <span class="mini-barra"><span class="relleno" style="width:${porcentaje}%;"></span></span>
        ${completados}/${TOTAL_MODULOS}
      </td>
      <td>${formatearFecha(dama.ultimaVisita)}</td>
      <td>
        <span class="pill ${completo ? "completado" : "progreso"}">
          ${completo ? "🏅 Completó la meta" : "En camino"}
        </span>
        <button class="btn-link" data-id="${dama.id}" style="margin-left:10px;">Ver detalle</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => mostrarDetalle(btn.getAttribute("data-id")));
  });
}

function aplicarFiltros() {
  const distrito = document.getElementById("filtro-distrito").value;
  const estado = document.getElementById("filtro-estado").value;
  const busqueda = normalizarBusqueda(document.getElementById("filtro-busqueda").value);

  let filtradas = TODAS_LAS_DAMAS;

  if (distrito) filtradas = filtradas.filter((d) => d.distrito === distrito);

  if (estado === "completo") {
    filtradas = filtradas.filter((d) => contarCompletados(d.progreso) === TOTAL_MODULOS);
  } else if (estado === "progreso") {
    filtradas = filtradas.filter((d) => {
      const c = contarCompletados(d.progreso);
      return c > 0 && c < TOTAL_MODULOS;
    });
  } else if (estado === "sin-empezar") {
    filtradas = filtradas.filter((d) => contarCompletados(d.progreso) === 0);
  }

  if (busqueda) {
    filtradas = filtradas.filter(
      (d) =>
        normalizarBusqueda(d.nombre).includes(busqueda) ||
        normalizarBusqueda(d.iglesia).includes(busqueda)
    );
  }

  renderTabla(filtradas);
}

function normalizarBusqueda(txt) {
  return (txt || "").toString().trim().toLowerCase();
}

function mostrarDetalle(id) {
  const dama = TODAS_LAS_DAMAS.find((d) => d.id === id);
  if (!dama) return;

  const progreso = dama.progreso || {};
  const cuerpo = document.getElementById("detalle-cuerpo");

  let modulosHtml = "";
  MODULOS.forEach((mod) => {
    const m = progreso["m" + mod.n];
    if (!m || !m.completado) {
      modulosHtml += `<div class="detalle-modulo-item"><p><strong>${mod.titulo}</strong> — sin completar</p></div>`;
      return;
    }
    let preguntasHtml = "";
    PREGUNTAS_REFLEXION.forEach((preg, i) => {
      const resp = (m.respuestas && m.respuestas["p" + i]) || "—";
      preguntasHtml += `<p class="q">${preg}</p><p>${resp}</p>`;
    });
    modulosHtml += `
      <div class="detalle-modulo-item">
        <p><strong>${mod.titulo}</strong> — completado el ${formatearFecha(m.fecha)}</p>
        ${preguntasHtml}
      </div>`;
  });

  cuerpo.innerHTML = `
    <button class="cerrar" id="btn-cerrar-detalle">&times;</button>
    <h2>${dama.nombre}</h2>
    <p style="color:var(--texto-suave); margin-top:-8px;">${dama.distrito} · ${dama.iglesia}</p>
    <p><strong>${contarCompletados(progreso)} / ${TOTAL_MODULOS}</strong> módulos completados</p>
    ${modulosHtml}
  `;

  document.getElementById("detalle-panel").classList.remove("hidden");
  document.getElementById("btn-cerrar-detalle").addEventListener("click", () => {
    document.getElementById("detalle-panel").classList.add("hidden");
  });
}

document.getElementById("detalle-panel").addEventListener("click", (e) => {
  if (e.target.id === "detalle-panel") e.target.classList.add("hidden");
});

function exportarCSV() {
  const filas = [["Nombre", "Distrito", "Iglesia", "Modulos completados", "Total modulos", "Completo", "Ultima visita"]];
  TODAS_LAS_DAMAS.forEach((d) => {
    const completados = contarCompletados(d.progreso);
    filas.push([
      d.nombre,
      d.distrito || "",
      d.iglesia || "",
      completados,
      TOTAL_MODULOS,
      completados === TOTAL_MODULOS ? "Si" : "No",
      formatearFecha(d.ultimaVisita),
    ]);
  });
  const csv = filas.map((f) => f.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "discipulas-creativas-progreso.csv";
  a.click();
  URL.revokeObjectURL(url);
}

async function cargarDamas() {
  const snap = await db.collection("damas").orderBy("nombre").get();
  TODAS_LAS_DAMAS = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  renderStats(TODAS_LAS_DAMAS);
  renderTabla(TODAS_LAS_DAMAS);
}

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("admin-email").textContent = user.email;
  document.getElementById("cargando").classList.add("hidden");
  document.getElementById("panel-contenido").classList.remove("hidden");

  poblarFiltroDistrito();
  cargarDamas().catch((err) => {
    console.error(err);
    document.getElementById("panel-contenido").innerHTML =
      '<p style="color:#D6337F;">No pudimos cargar los datos. Verifica las reglas de seguridad de Firestore (ver README) y tu conexión.</p>';
  });

  document.getElementById("filtro-distrito").addEventListener("change", aplicarFiltros);
  document.getElementById("filtro-estado").addEventListener("change", aplicarFiltros);
  document.getElementById("filtro-busqueda").addEventListener("input", aplicarFiltros);
  document.getElementById("btn-exportar").addEventListener("click", exportarCSV);
  document.getElementById("btn-logout").addEventListener("click", () => auth.signOut());
});
