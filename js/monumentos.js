// ============================================================
//  monumentos.js  –  Módulo de monumentos y cultura
//  Misma lógica de distancia (Haversine) que restaurantes.js
// ============================================================

const monumentos = {
  arcos: {
    nombre: "Arcos de Guadalajara",
    resumen: "Símbolo icónico de la ciudad, construidos en 1961 para conmemorar los 400 años de su fundación. Presentan un estilo neoclásico y albergan fuentes con esculturas de Mariano Azuela y José Clemente Orozco.",
    ubicacion: "Av. Vallarta, Guadalajara",
    anio: 1961,
    estilo: "Neoclásico",
    info: "https://es.wikipedia.org/wiki/Arcos_del_tercer_milenio",
    mapa: "https://www.google.com/maps/search/?api=1&query=Arcos+de+Guadalajara",
    latitud: 20.6750,
    longitud: -103.3863
  },
  rotonda: {
    nombre: "Rotonda de los Jaliscienses Ilustres",
    resumen: "Ubicada en el Centro Histórico, esta estructura rinde homenaje a personalidades destacadas de Jalisco. Fue inaugurada en 1952 y contiene 98 urnas con restos de figuras históricas.",
    ubicacion: "Centro Histórico, Guadalajara",
    anio: 1952,
    estilo: "Neoclásico",
    info: "https://www.guadalajara.gob.mx/",
    mapa: "https://www.google.com/maps/search/?api=1&query=Rotonda+Jaliscienses+Ilustres+Guadalajara",
    latitud: 20.6771,
    longitud: -103.3468
  },
  minerva: {
    nombre: "Glorieta de La Minerva",
    resumen: "Escultura de bronce de 8 metros de altura, creada por Joaquín Arias en 1957. Representa a la diosa romana Minerva y lleva la leyenda: \"Justicia, Sabiduría y Fortaleza, custodian a esta leal Ciudad\".",
    ubicacion: "Av. Vallarta / Av. López Mateos, Guadalajara",
    anio: 1957,
    estilo: "Escultura monumental",
    info: "https://es.wikipedia.org/wiki/Glorieta_La_Minerva",
    mapa: "https://www.google.com/maps/search/?api=1&query=Glorieta+Minerva+Guadalajara",
    latitud: 20.6731,
    longitud: -103.3867
  },
  cabanas: {
    nombre: "Instituto Cultural Cabañas",
    resumen: "Edificio neoclásico inaugurado en 1810, originalmente un hospicio para huérfanos. Hoy es un museo con importantes murales de José Clemente Orozco, como \"El Hombre de Fuego\".",
    ubicacion: "Plaza Tapatía, Centro Histórico",
    anio: 1810,
    estilo: "Neoclásico",
    info: "https://museocabanas.jalisco.gob.mx/",
    mapa: "https://www.google.com/maps/search/?api=1&query=Instituto+Cultural+Cabanas+Guadalajara",
    latitud: 20.6689,
    longitud: -103.3406
  },
  degollado: {
    nombre: "Teatro Degollado",
    resumen: "Construido en 1856 e inaugurado en 1866, es uno de los teatros neoclásicos mejor conservados de Hispanoamérica. Alberga a la Orquesta Filarmónica de Jalisco y el Ballet Folklórico de la Universidad de Guadalajara.",
    ubicacion: "Plaza de la Liberación, Centro Histórico",
    anio: 1866,
    estilo: "Neoclásico",
    info: "https://www.tripadvisor.com.mx/Attraction_Review-g150798-d152686-Reviews-or20-Teatro_Degollado-Guadalajara_Guadalajara_Metropolitan_Area.html",
    mapa: "https://www.google.com/maps/search/?api=1&query=Teatro+Degollado+Guadalajara",
    latitud: 20.6688,
    longitud: -103.3440
  },
  catedral: {
    nombre: "Catedral de Guadalajara",
    resumen: "Situada en el Centro Histórico, fue fundada en 1561 por fray Pedro de Ayala. Es una de las catedrales más importantes de América Latina, con una arquitectura que mezcla estilos gótico, barroco y neoclásico.",
    ubicacion: "Plaza de Armas, Centro Histórico",
    anio: 1561,
    estilo: "Gótico · Barroco · Neoclásico",
    info: "https://www.arquidiocesisgdl.org.mx/",
    mapa: "https://www.google.com/maps/search/?api=1&query=Catedral+de+Guadalajara",
    latitud: 20.6752,
    longitud: -103.3441
  }
};

// ----------------------------------------------------------
// Función de distancia Haversine (igual que restaurantes.js)
// ----------------------------------------------------------
function calcularDistanciaMonumento(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ----------------------------------------------------------
// Genera tarjetas ordenadas por distancia (= generarTarjetasRestaurantes)
// ----------------------------------------------------------
function generarTarjetasMonumentos(latUsuario, lonUsuario) {
  const grid = document.getElementById('monumentoGrid');
  if (!grid) return;

  // 1. Calcular distancias
  const lista = Object.keys(monumentos).map(id => {
    const m = monumentos[id];
    const dist = calcularDistanciaMonumento(latUsuario, lonUsuario, m.latitud, m.longitud);
    return { id, ...m, distancia: dist };
  });

  // 2. Ordenar de más cercano a más lejano
  lista.sort((a, b) => a.distancia - b.distancia);

  // 3. Generar HTML de tarjetas
  grid.innerHTML = lista.map(m => `
    <div class="card fade-in">
      <div class="card-image-placeholder" style="background: linear-gradient(135deg, #1A2E5A, #3A6EC0); display:flex; align-items:center; justify-content:center;">
        <i class="fas fa-landmark" style="font-size:48px; color:rgba(255,255,255,0.9);"></i>
      </div>
      <div class="card-body">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <span style="font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px;
                       background:#C8A028; color:#fff; letter-spacing:0.4px;">
            ${m.anio}
          </span>
          <span style="font-size:11px; color:#999;">${m.estilo}</span>
        </div>
        <h3 class="card-title">${m.nombre}</h3>
        <p class="card-text">${m.resumen}</p>
        <div class="card-location">
          <i class="fas fa-map-marker-alt"></i> ${m.ubicacion}
        </div>
        <div class="card-distance">
          <i class="fas fa-location-arrow"></i>
          <strong>${m.distancia.toFixed(2)} km</strong> de distancia
        </div>
        <div class="card-footer">
          <a href="${m.mapa}" class="btn btn-small btn-primary" target="_blank">
            <i class="fas fa-map"></i> Ver en Mapa
          </a>
          <a href="${m.info}" class="btn btn-small btn-secondary" target="_blank">
            <i class="fas fa-info-circle"></i> Más info
          </a>
        </div>
      </div>
    </div>
  `).join('');

  console.log('Monumentos ordenados por cercanía:', lista.map(m => `${m.nombre} – ${m.distancia.toFixed(2)} km`));
}

// ----------------------------------------------------------
// Fallback sin geolocalización
// ----------------------------------------------------------
function generarTarjetasMonumentosSinUbicacion() {
  const grid = document.getElementById('monumentoGrid');
  if (!grid) return;

  const lista = Object.values(monumentos);

  grid.innerHTML = lista.map(m => `
    <div class="card fade-in">
      <div class="card-image-placeholder" style="background: linear-gradient(135deg, #1A2E5A, #3A6EC0); display:flex; align-items:center; justify-content:center;">
        <i class="fas fa-landmark" style="font-size:48px; color:rgba(255,255,255,0.9);"></i>
      </div>
      <div class="card-body">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <span style="font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px;
                       background:#C8A028; color:#fff; letter-spacing:0.4px;">
            ${m.anio}
          </span>
          <span style="font-size:11px; color:#999;">${m.estilo}</span>
        </div>
        <h3 class="card-title">${m.nombre}</h3>
        <p class="card-text">${m.resumen}</p>
        <div class="card-location">
          <i class="fas fa-map-marker-alt"></i> ${m.ubicacion}
        </div>
        <p style="font-size:12px; color:#E04820; margin-bottom:15px;">
          Activa tu ubicación para ver la distancia
        </p>
        <div class="card-footer">
          <a href="${m.mapa}" class="btn btn-small btn-primary" target="_blank">
            <i class="fas fa-map"></i> Ver en Mapa
          </a>
          <a href="${m.info}" class="btn btn-small btn-secondary" target="_blank">
            <i class="fas fa-info-circle"></i> Más info
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

console.log('Monumentos cargados:', Object.keys(monumentos));