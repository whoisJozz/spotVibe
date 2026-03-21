const restaurantes = {
  alcalde: {
    nombre: "Alcalde",
    resumen: "Mejor restaurante de Guadalajara 2024. Cocina mexicana contemporánea con menú innovador.",
    ubicacion: "Vallarta Norte",
    reserva: "https://www.opentable.com.mx/",
    info: "https://www.tripadvisor.com.mx/",
    mapa: "https://www.google.com/maps/search/?api=1&query=Alcalde+Guadalajara",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  bruna: {
    nombre: "Bruna", 
    resumen: "Cocina mexicana moderna con enfoque creativo y mixología innovadora.",
    ubicacion: "Lafayette",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=Bruna+Guadalajara",
    latitud: 20.6953102,
    longitud: -103.4219235
  },
  karne: {
    nombre: "Karne Garibaldi",
    resumen: "Famoso por su carne en su jugo. Récord Guinness por servicio rápido.",
    ubicacion: "Santa Teresita",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=Karne+Garibaldi",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  chata: {
    nombre: "La Chata",
    resumen: "Clásico tapatío desde 1942 con cocina tradicional.",
    ubicacion: "Centro Histórico",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=La+Chata+Guadalajara",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  ilatina: {
    nombre: "I Latina",
    resumen: "Restaurante hiperkitsch con tacos tropicales y propuestas creativas.",
    ubicacion: "Vallarta Poniente",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=I+Latina+Guadalajara",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  tikuun: {
    nombre: "Tikuun",
    resumen: "Fusión de cocina mexicana tradicional con técnicas internacionales.",
    ubicacion: "Colonia Americana",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=Tikuun+Guadalajara",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  xokol: {
    nombre: "Xokol",
    resumen: "Enfocado en maíz criollo y técnicas indígenas.",
    ubicacion: "Santa Teresita",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=Xokol+Guadalajara",
    latitud: 20.6825522,
    longitud: -103.3618782
  },
  el_tango_patria: {
    nombre: "El Tango Patria",
    resumen: "Cocina mexicana moderna con enfoque creativo y mixología innovadora.",
    ubicacion: "Lafayette",
    reserva: "#",
    info: "#",
    mapa: "https://www.google.com/maps/search/?api=1&query=Bruna+Guadalajara",
    latitud: 20.6953102,
    longitud: -103.4219235
  },
};

// Función para calcular distancia entre dos puntos
function calcularDistancia(lat1, lon1, lat2, lon2) {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

 function showRestaurantInfo() {

  const selected = document.getElementById("restaurantSelect").value;
  const data = restaurantes[selected];
 
  if (!data) {
    document.getElementById("restaurantInfo").style.display = "none";
    return;
  }
 
  document.getElementById("restaurantInfo").style.display = "block";
  document.getElementById("resumen").innerText = data.resumen;
  document.getElementById("ubicacion").innerText = data.ubicacion;
  document.getElementById("btnReserva").href = data.reserva;
  document.getElementById("btnInfo").href = data.info;
  document.getElementById("btnMapa").href = data.mapa;
}
console.log("Restaurantes cargados:", Object.keys(restaurantes));

function selectRestaurantInfo() {
  const selected = document.getElementById("restaurantSelect").value;

  // 1. Pedimos la ubicación
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latUsuario = pos.coords.latitude;
      const lonUsuario = pos.coords.longitude;

      // 2. Convertimos el objeto en array y calculamos distancias
      const listaRestaurantes = Object.keys(restaurantes).map(id => {
        const r = restaurantes[id];
        const dist = calcularDistancia(latUsuario, lonUsuario, r.latitud, r.longitud);
        return { id, ...r, distancia: dist };
      });

      // 3. Ordenamos de más cercano a lejano
      listaRestaurantes.sort((a, b) => a.distancia - b.distancia);
      const select = document.getElementById("restaurantSelect");
      select.innerHTML = '<option value="">Selecciona un lugar cercano...</option>';
      listaRestaurantes.forEach(lugar => {
        const option = document.createElement("option");
        option.value = lugar.id;
        // Mostramos el nombre (ID) capitalizado
        option.innerText = `${lugar.nombre.toUpperCase()} (Más cercano)`;
        select.appendChild(option);
      });

      // 4. Mostramos la info del restaurante SELECCIONADO en el HTML
      const data = restaurantes[selected];
      console.log (data);
      console.log (listaRestaurantes);

      if (!data) {
        document.getElementById("restaurantInfo").style.display = "none";
        return;
      }

      document.getElementById("restaurantInfo").style.display = "block";
      document.getElementById("resumen").innerText = data.resumen;
      document.getElementById("ubicacion").innerText = data.ubicacion;
      document.getElementById("btnReserva").href = data.reserva;
      document.getElementById("btnInfo").href = data.info;
      document.getElementById("btnMapa").href = data.mapa;

      // Opcional: Imprimir en consola el orden de cercanía
      console.log("Ranking de cercanía:", listaRestaurantes);
    },
    (err) => {
      console.error(`Error de ubicación (${err.code}): ${err.message}`);
      alert("Por favor activa tu ubicación para ver los datos correctamente.");
    }
  );
}

console.log("Restaurantes cargados:", Object.keys(restaurantes));
selectRestaurantInfo();