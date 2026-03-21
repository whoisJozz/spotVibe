// ============================================================
//  zonaroja.js  –  Módulo de seguridad turística
//  Principios: mismo ordenamiento por cercanía que restaurantes.js
//  Extra: alerta automática si el usuario está cerca de una zona roja
// ============================================================

// ----------------------------------------------------------
// 1. CATÁLOGO DE ZONAS ROJAS
//    (coordenadas reales de Guadalajara / Zapopan)
// ----------------------------------------------------------
const zonasRojas = {
  mercado_libertad: {
    nombre: "Mercado Libertad (San Juan de Dios)",
    resumen: "Alta incidencia de carteristas y robos a turistas distraídos. Evita mostrar objetos de valor.",
    ubicacion: "Centro Histórico, Guadalajara",
    nivelRiesgo: "ALTO",
    consejo: "Ve en grupo, no saques el celular y usa bolsas cruzadas al frente.",
    mapa: "https://www.google.com/maps/search/?api=1&query=Mercado+Libertad+Guadalajara",
    latitud: 20.6698,
    longitud: -103.3388
  },
  centro_nocturno: {
    nombre: "Centro Histórico (Nocturno)",
    resumen: "Zona segura de día; de noche aumentan robos en callejones y zonas poco iluminadas.",
    ubicacion: "Centro Histórico, Guadalajara",
    nivelRiesgo: "MEDIO",
    consejo: "Regresa al hotel antes de las 10 pm o usa transporte de app.",
    mapa: "https://www.google.com/maps/search/?api=1&query=Centro+Historico+Guadalajara",
    latitud: 20.6737,
    longitud: -103.3440
  },
  periferica_norte: {
    nombre: "Periférica Norte / Zapopan Norte",
    resumen: "Zona con alta incidencia de robo de vehículos y asaltos en cruceros.",
    ubicacion: "Zapopan Norte, Jalisco",
    nivelRiesgo: "ALTO",
    consejo: "Evita estacionar en la vía pública. No te detengas en cruceros oscuros.",
    mapa: "https://www.google.com/maps/search/?api=1&query=Periferico+Norte+Zapopan",
    latitud: 20.7410,
    longitud: -103.4012
  },
  tlaquepaque_periferia: {
    nombre: "Tlaquepaque (Periferia)",
    resumen: "El centro artesanal es seguro; sus colonias periféricas reportan robos con violencia.",
    ubicacion: "San Pedro Tlaquepaque, Jalisco",
    nivelRiesgo: "MEDIO",
    consejo: "Quédate en la zona turística central y evita callejones poco transitados.",
    mapa: "https://www.google.com/maps/search/?api=1&query=Tlaquepaque+periferia+Jalisco",
    latitud: 20.6424,
    longitud: -103.3122
  },
  santa_cecilia: {
    nombre: "Santa Cecilia",
    resumen: "Colonia con reportes frecuentes de pandillerismo y robos a peatones.",
    ubicacion: "Guadalajara Norte",
    nivelRiesgo: "ALTO",
    consejo: "No es zona turística. Si llegas por error, pide un taxi de app de inmediato.",
    mapa: "https://www.google.com/maps/search/?api=1&query=Santa+Cecilia+Guadalajara",
    latitud: 20.7053,
    longitud: -103.3538
  }
};

// ----------------------------------------------------------
// 2. CONFIGURACIÓN
// ----------------------------------------------------------
// Umbral de alerta en "grados decimales".
// ~0.009° ≈ 1 km. Ajusta según qué tan sensible quieras la alerta.
const UMBRAL_ALERTA_KM = 0.018; // ~2 km de radio

// Colores de nivel de riesgo para el badge
const COLORES_NIVEL = {
  ALTO:  { bg: "#ff3b30", texto: "#fff" },
  MEDIO: { bg: "#ff9500", texto: "#fff" },
  BAJO:  { bg: "#34c759", texto: "#fff" }
};

// ----------------------------------------------------------
// 3. UTILIDADES
// ----------------------------------------------------------

/**
 * Distancia euclidiana simple (igual que en restaurantes.js).
 * Para distancias geográficas cortas funciona bien como ranking relativo.
 */
function calcularDistanciaZona(lat1, lon1, lat2, lon2) {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

/**
 * Convierte distancia en grados a kilómetros aproximados.
 * 1° ≈ 111 km en latitud.
 */
function gradosAKm(distanciaGrados) {
  return distanciaGrados * 111;
}

// ----------------------------------------------------------
// 4. LÓGICA PRINCIPAL – Verificar proximidad y ordenar
// ----------------------------------------------------------

/**
 * Calcula distancias a todas las zonas rojas, ordena de más
 * cercana a más lejana, y dispara alerta si alguna está dentro
 * del umbral configurado.
 *
 * @param {number} latUsuario
 * @param {number} lonUsuario
 * @returns {Array} Lista ordenada con campo `distancia` y `distanciaKm`
 */
function verificarProximidadZonasRojas(latUsuario, lonUsuario) {
  // 1. Mapear zonas con su distancia al usuario
  const listaZonas = Object.keys(zonasRojas).map(id => {
    const z = zonasRojas[id];
    const dist = calcularDistanciaZona(latUsuario, lonUsuario, z.latitud, z.longitud);
    return {
      id,
      ...z,
      distancia: dist,
      distanciaKm: gradosAKm(dist)
    };
  });

  // 2. Ordenar de más cercana a más lejana (igual principio que restaurantes.js)
  listaZonas.sort((a, b) => a.distancia - b.distancia);

  // 3. Filtrar las que están dentro del umbral de alerta
  const zonasPeligrosas = listaZonas.filter(z => z.distancia <= UMBRAL_ALERTA_KM);

  // 4. Disparar alerta si hay zonas cercanas
  if (zonasPeligrosas.length > 0) {
    const detalles = zonasPeligrosas
      .map(z =>
        `⚠️ ${z.nombre}\n` +
        `   Riesgo: ${z.nivelRiesgo} | ~${z.distanciaKm.toFixed(1)} km\n` +
        `   Consejo: ${z.consejo}`
      )
      .join("\n\n");

    alert(
      `🚨 ALERTA DE SEGURIDAD TURÍSTICA 🚨\n\n` +
      `Detectamos que estás cerca de ${zonasPeligrosas.length > 1 ? "zonas con riesgo" : "una zona con riesgo"}:\n\n` +
      `${detalles}\n\n` +
      `Mantente alerta y disfruta Guadalajara con seguridad. 🙏`
    );
  }

  console.log("📍 Zonas ordenadas por cercanía:", listaZonas);
  return listaZonas;
}

// ----------------------------------------------------------
// 5. FUNCIONES DE UI  (paralelas a restaurantes.js)
// ----------------------------------------------------------

/**
 * Muestra info de la zona seleccionada en el select.
 * Equivalente a showRestaurantInfo() en restaurantes.js.
 */
function showZonaRojaInfo() {
  const selected = document.getElementById("zonaSelect").value;
  const data = zonasRojas[selected];

  if (!data) {
    document.getElementById("zonaInfo").style.display = "none";
    return;
  }

  // Badge de nivel de riesgo
  const badge = document.getElementById("zonaNivelBadge");
  if (badge) {
    const colores = COLORES_NIVEL[data.nivelRiesgo] || COLORES_NIVEL.BAJO;
    badge.textContent = data.nivelRiesgo;
    badge.style.backgroundColor = colores.bg;
    badge.style.color = colores.texto;
  }

  document.getElementById("zonaInfo").style.display = "block";
  document.getElementById("zonaResumen").innerText  = data.resumen;
  document.getElementById("zonaUbicacion").innerText = data.ubicacion;
  document.getElementById("zonaConsejo").innerText   = data.consejo;
  document.getElementById("btnZonaMapa").href         = data.mapa;
}

/**
 * Usa geolocalización real, ordena las zonas por cercanía,
 * puebla el select y verifica si hay alertas activas.
 * Equivalente a selectRestaurantInfo() en restaurantes.js.
 */
function selectZonaRojaInfo() {
  const selectedAntes = document.getElementById("zonaSelect").value;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latUsuario = pos.coords.latitude;
      const lonUsuario = pos.coords.longitude;

      // Verificar proximidad y obtener lista ordenada
      const listaZonas = verificarProximidadZonasRojas(latUsuario, lonUsuario);

      // Poblar el select ordenado por cercanía
      const select = document.getElementById("zonaSelect");
      select.innerHTML = '<option value="">Selecciona una zona de riesgo...</option>';

      listaZonas.forEach(zona => {
        const option = document.createElement("option");
        option.value = zona.id;
        option.innerText =
          `${zona.nombre.toUpperCase()} · ${zona.nivelRiesgo} · ~${zona.distanciaKm.toFixed(1)} km`;
        select.appendChild(option);
      });

      // Mostrar info de la zona que estaba seleccionada (si aún existe)
      const data = zonasRojas[selectedAntes];
      if (!data) {
        document.getElementById("zonaInfo").style.display = "none";
        return;
      }

      showZonaRojaInfo(); // reutiliza la función de display
    },
    (err) => {
      console.error(`Error de ubicación (${err.code}): ${err.message}`);
      alert("Por favor activa tu ubicación para recibir alertas de seguridad.");
    }
  );
}

// ----------------------------------------------------------
// 6. MODO DEMO  –  ubicación hardcodeada para demostración
// ----------------------------------------------------------

/**
 * Simula que el usuario está justo en el Mercado Libertad.
 * Debe disparar la alerta automáticamente.
 * Llama a esta función en lugar de selectZonaRojaInfo() para el demo.
 */
function demoZonaRoja() {
  // Coordenadas hardcodeadas: Mercado Libertad, Guadalajara
  const LAT_DEMO = 20.6698;
  const LON_DEMO = -103.3388;

  console.log("🔴 MODO DEMO – Simulando usuario en Mercado Libertad");
  console.log(`   Lat: ${LAT_DEMO}, Lon: ${LON_DEMO}`);

  // Verificar proximidad con coordenadas fijas → dispara alerta
  const listaZonas = verificarProximidadZonasRojas(LAT_DEMO, LON_DEMO);

  // Poblar el select como si fuera una sesión real
  const select = document.getElementById("zonaSelect");
  if (select) {
    select.innerHTML = '<option value="">📍 DEMO – Zona simulada activa</option>';

    listaZonas.forEach(zona => {
      const option = document.createElement("option");
      option.value = zona.id;
      option.innerText =
        `${zona.nombre.toUpperCase()} · ${zona.nivelRiesgo} · ~${zona.distanciaKm.toFixed(1)} km`;
      select.appendChild(option);
    });

    // Auto-selecciona la más cercana para mostrar su info
    if (listaZonas.length > 0) {
      select.value = listaZonas[0].id;
      showZonaRojaInfo();
    }
  }
}

// ----------------------------------------------------------
// 7. INICIALIZACIÓN
// ----------------------------------------------------------
console.log("🗺️  Zonas rojas cargadas:", Object.keys(zonasRojas));

// ► Para producción (GPS real):
//   selectZonaRojaInfo();

// ► Para la demostración (coordenada hardcodeada → alerta inmediata):
demoZonaRoja();