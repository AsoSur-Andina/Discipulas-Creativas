// Lógica del panel de módulos de cada dama (modulos.html)

function estaCompletado(progreso, n) {
  return !!(progreso && progreso["m" + n] && progreso["m" + n].completado);
}

function estaDesbloqueado(progreso, n) {
  if (n === 1) return true;
  return estaCompletado(progreso, n - 1);
}

function crearTarjetaModulo(mod, progreso) {
  const completado = estaCompletado(progreso, mod.n);
  const desbloqueado = estaDesbloqueado(progreso, mod.n);

  const card = document.createElement("div");
  card.className =
    "modulo-card " + (completado ? "completado" : desbloqueado ? "disponible" : "bloqueado");

  const thumbUrl = `https://img.youtube.com/vi/${mod.youtubeId}/hqdefault.jpg`;

  let estadoHtml;
  if (completado) {
    estadoHtml = '<span class="estado completado">✅ Completado</span>';
  } else if (desbloqueado) {
    estadoHtml = '<span class="estado disponible-txt">▶ Ver ahora</span>';
  } else {
    estadoHtml = '<span class="estado bloqueado">🔒 Completa el módulo anterior</span>';
  }

  card.innerHTML = `
    <div class="thumb">
      <img src="${thumbUrl}" alt="Miniatura ${mod.titulo}" loading="lazy" />
      <div class="play-icon">
        <svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.25)"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>
      </div>
    </div>
    <div class="cuerpo">
      <span class="num">Módulo ${mod.n} de ${TOTAL_MODULOS}</span>
      <h3>${mod.titulo}</h3>
      ${estadoHtml}
    </div>
    ${desbloqueado ? `<a class="card-link" href="modulo.html?n=${mod.n}"></a>` : ""}
  `;
  return card;
}

async function cargarPanelModulos() {
  const damaId = localStorage.getItem("damaId");
  const damaNombre = localStorage.getItem("damaNombre");

  if (!damaId) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("header-nombre").textContent = damaNombre || "";

  const contenedor = document.getElementById("modulos-grid");
  const cargando = document.getElementById("cargando");

  try {
    const doc = await db.collection("damas").doc(damaId).get();
    if (!doc.exists) {
      localStorage.removeItem("damaId");
      localStorage.removeItem("damaNombre");
      window.location.href = "index.html";
      return;
    }
    const dama = doc.data();
    const progreso = dama.progreso || {};
    const completados = MODULOS.filter((m) => estaCompletado(progreso, m.n)).length;
    const porcentaje = Math.round((completados / TOTAL_MODULOS) * 100);

    document.getElementById("dama-distrito-iglesia").textContent =
      `${dama.distrito} · ${dama.iglesia}`;
    document.getElementById("progreso-texto").textContent = `${completados} / ${TOTAL_MODULOS} módulos`;
    document.getElementById("progreso-relleno").style.width = porcentaje + "%";

    if (completados === TOTAL_MODULOS) {
      const msg = document.getElementById("completado-msg");
      msg.classList.remove("hidden");
      msg.textContent = "🎉 ¡Felicidades! Completaste todo el camino de Discípulas Creativas. Tu líder ya puede verlo en el panel de seguimiento.";
    }

    cargando.classList.add("hidden");
    contenedor.classList.remove("hidden");
    document.getElementById("progreso-seccion").classList.remove("hidden");
    MODULOS.forEach((mod) => contenedor.appendChild(crearTarjetaModulo(mod, progreso)));
  } catch (err) {
    console.error(err);
    cargando.innerHTML =
      '<p style="color:#D6337F;">No pudimos cargar tu progreso. Verifica tu conexión o la configuración de Firebase.</p>';
  }
}

document.getElementById("btn-salir")?.addEventListener("click", () => {
  localStorage.removeItem("damaId");
  localStorage.removeItem("damaNombre");
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", cargarPanelModulos);
