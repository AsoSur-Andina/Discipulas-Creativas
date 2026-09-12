// Contenido de los módulos del camino "Discípulas Creativas".
// Para cambiar un título, video o pregunta, edita este archivo y vuelve a subirlo a GitHub.
//
// youtubeId: el código que va después de "v=" en la URL de YouTube.

const PREGUNTAS_REFLEXION = [
  "¿A quién animé esta semana?",
  "¿Con quién me conecté a través de algo que compartí?",
];

const MODULOS = [
  { n: 1, titulo: "Módulo 1", youtubeId: "GTAE-9enobE" },
  { n: 2, titulo: "Módulo 2", youtubeId: "BVfEVHRgN80" },
  { n: 3, titulo: "Módulo 3", youtubeId: "PiXd2b528zU" },
  { n: 4, titulo: "Módulo 4", youtubeId: "dM_hH9MyGUM" },
  { n: 5, titulo: "Módulo 5", youtubeId: "ZTivyeO5IBU" },
  { n: 6, titulo: "Módulo 6", youtubeId: "XrkzVxZZID8" },
  { n: 7, titulo: "Módulo 7 · Seminario", youtubeId: "k_rTSxdcMcs" },
  { n: 8, titulo: "Módulo 8", youtubeId: "h8kU7DcH3Wg" },
  { n: 9, titulo: "Módulo 9", youtubeId: "prVqmEdsEis" },
  { n: 10, titulo: "Módulo 10", youtubeId: "9uL8y1vanWk" },
  { n: 11, titulo: "Módulo 11 · Episodio final", youtubeId: "Ib2aRTIPCIM" },
];

const TOTAL_MODULOS = MODULOS.length;

if (typeof module !== "undefined") {
  module.exports = { MODULOS, PREGUNTAS_REFLEXION, TOTAL_MODULOS };
}
