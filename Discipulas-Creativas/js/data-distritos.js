// Datos generados automáticamente desde Distritos_MIA_Alfabetico.xlsx
// Distrito -> lista de iglesias/grupos
const DISTRITOS = ["Algeciras", "Campo Alegre", "Florencia Central", "Florencia Nuevo Amanecer", "Florencia Redención", "Garzón", "La Plata", "Neiva Central", "Neiva Jardín", "Neiva Sur", "Pitalito Norte", "Pitalito Sur", "Puerto Rico", "San Vicente"];

const IGLESIAS_POR_DISTRITO = {
  "Algeciras": ["Shalom Algeciras", "Central Algeciras", "Eben Ezer Algeciras", "Santana Ramos", "Paraíso Algeciras", "Nueva Jerusalén Algeciras"],
  "Campo Alegre": ["Central Campo Alegre", "Emmanuel Campo Alegre", "Sinaí Campo Alegre", "Libertad Hobo", "Jehová Nissi", "Sión Rivera", "Renacer Hobo"],
  "Florencia Central": ["Central Florencia", "Jerusalén Florencia", "Canaán Yurayaco", "Esmirna Curillo", "Belén", "Renacer la Gloria", "Efeso Ceilan", "Filadelfia"],
  "Florencia Nuevo Amanecer": ["Nuevo Amanecer", "Orión Florencia", "Nazareth Florencia", "Sinaí Solano", "Lirios", "Olivos", "Luz Celestial", "Paraiso San Antonio"],
  "Florencia Redención": ["Nuevo Amanecer", "Orión Florencia", "Nazareth Florencia", "Sinaí Solano", "Lirios", "Olivos", "Luz Celestial", "Paraiso San Antonio"],
  "Garzón": ["Renacer Garzón", "Gigantes de la Fe", "Eben Ezer Suaza", "Horeb Zuluaga", "Sion Silvania", "Jerusalen Guadalupe", "Nueva Esperanza Garzón"],
  "La Plata": ["Edén La Plata", "Getsemaní Getzem", "Maranatha Agrado", "Elohim Paicol", "Tesalia"],
  "Neiva Central": ["Neiva Central", "Roca Eterna", "AMAS CABI", "Getsemaní Neiva", "Bethel Aipe", "Salem (San Andrés)", "Tello", "Palermo", "Orión Neiva"],
  "Neiva Jardín": ["Jardín", "Nueva Jerusalén", "Fuente de Vida (Vegalarga)", "Siervos de Dios", "Luz de Oriente"],
  "Neiva Sur": ["Manantial Neiva", "Bethel Río Chiquito", "Edén Neiva", "Filadelfia Neiva", "Renacer Caguán"],
  "Pitalito Norte": ["Pitalito Central", "Acevedo", "Maito", "Timaná San Antonio", "Esperanza Marimba"],
  "Pitalito Sur": ["Nuevo Edén", "Maranatha Criollo", "Palestina Pitalito", "Remanente Isnos", "Paraíso Pitalito", "Emanuel Bordones", "Jerusalén Bruselas"],
  "Puerto Rico": ["Horeb Puerto Rico", "Emmanuel Puerto Rico", "Gilgal Doncello", "Edén Doncello", "Fuente Vida - La Granada", "Bethel Guacamayas", "Paraíso las Palmas"],
  "San Vicente": ["Sión San Vicente", "Manantial Campo Hermoso", "La Victoria San Vicente", "Bethel Macarena", "Sinaí la Novia", "Renacer la Cristalina", "Remanente San Juan", "Luz de Esperanza Tailandia", "Rayo de Luz", "Maranatha Las Damas"],
};

if (typeof module !== "undefined") { module.exports = { DISTRITOS, IGLESIAS_POR_DISTRITO }; }