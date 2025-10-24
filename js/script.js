// MAPA GENERAL
var map = L.map("map").setView([51.505, -0.09], 1.5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// MAPA FILTRADO
var filterMap = L.map("filter-map").setView([51.505, -0.09], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(filterMap);

//Agregar marcador - Mapa General
const marker = L.marker([40.450325, -3.692854])
  .bindPopup("Aquí no hay terremoto")
  .addTo(map);

//Agregar circulo - Mapa General
const circle = L.circle([40.450325, -3.692854], {
  color: "#14213d",
  fillOpacity: 0.4,
  radius: 500,
})
  .bindPopup("")
  .addTo(map);

//Agregar marcador - Mapa General
const marker2 = L.marker([40.450325, -3.692854])
  .bindPopup("Añade los filtros que desea para ver el mapa en acción")
  .addTo(filterMap);

// MAPA GENERAL
async function getMap() {
  try {
    // LLAMAR A API
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    // CONVERTIRLO A JSON
    const data = await res.json();
    // Retornar dentro de data features
    return data.features;
  } catch (e) {
    console.log(e);
  }
}

// LLamar a función
getMap().then((data) => {
  // Agregar Marcador
  data.map((pin) => {
    // Coordenadas -> Latitud, Longitud
    const coordinates_pin = [
      pin.geometry.coordinates[1],
      pin.geometry.coordinates[0],
    ];

    // Sacamos el valor de la magnitud
    const colorMag = pin.properties.mag;
    if (colorMag <= 0) {
      color = "#f0f0f0";
    } else if (colorMag <= 1) {
      color = "#1d8919";
    } else if (colorMag <= 2) {
      color = "#8e911c";
    } else if (colorMag <= 3) {
      color = "#f9f016";
    } else if (colorMag <= 4) {
      color = "#f6ce1d";
    } else if (colorMag <= 5) {
      color = "#fb9c16";
    } else if (colorMag <= 6) {
      color = "#f61719";
    } else if (colorMag <= 7) {
      color = "#f818fa";
    }
    // Añadir Círculos magnitud
    L.circle(coordinates_pin, {
      radius: 8,
      color: color,
      fillColor: color,
      fillOpacity: 0.8,
    }).addTo(map);

    // Añadir info
    const markers = L.marker(coordinates_pin)
      .bindPopup(
        `
                <h3 class="popup-title">${pin.properties.title}</h3>
                <p class="popup-text"><span>Fecha: </span>${pin.properties.updated}</p>
                <p class="popup-text"><span>Lugar: </span>${pin.properties.place}</p>
                <p class="popup-text"><span>Código: </span>${pin.properties.code}</p>
                <p class="popup-text" id="mag"><span>Magnitud: </span>${pin.properties.mag}</p>
                <button class='fav-btn'>Añadir a Destacado</button>
                `
      )
      .addTo(map);
    markers.on("popupopen", () => {
      // Seleccionar botón
      const favButton = document.querySelector(".fav-btn");
      if (favButton) {
        favButton.addEventListener("click", () => {
          alert(
            "El terremoto que te inquieta ha sido guardado a tus destacados!"
          );
        });
      }
    });
  });
});

// Mapa Magnitud - Fecha
async function getMap2() {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const data = await res.json();
    return data.features;
  } catch (e) {
    console.log(e);
  }
}

getMap2().then((data) => {
  document.getElementById("filter-form").addEventListener("submit", (event) => {
    // Evitar comportamiento por defecto
    event.preventDefault();

    const mg = parseFloat(document.getElementById("mg").value);

    const startDate = document.getElementById("start-date").value;
    const formatStart = new Date(startDate);
    formatStart.setHours(0, 0, 0, 0);

    const endDate = document.getElementById("end-date").value;
    const formatEnd = new Date(endDate);
    formatEnd.setHours(23, 59, 59, 999);

    const dataFilters = data.filter((filterPin) => {
      const valueDate = new Date(filterPin.properties.time);
      return (
        filterPin.properties.mag <= mg &&
        valueDate >= formatStart &&
        valueDate <= formatEnd
      );
    });

    dataFilters.map((pin) => {
      // Coordenadas -> Latitud, Longitud
      const coordinates_pin = [
        pin.geometry.coordinates[1],
        pin.geometry.coordinates[0],
      ];

      // Sacamos el valor de la magnitud
      const colorMag = pin.properties.mag;
      if (colorMag <= 0) {
        color = "#f0f0f0";
      } else if (colorMag <= 1) {
        color = "#1d8919";
      } else if (colorMag <= 2) {
        color = "#8e911c";
      } else if (colorMag <= 3) {
        color = "#f9f016";
      } else if (colorMag <= 4) {
        color = "#f6ce1d";
      } else if (colorMag <= 5) {
        color = "#fb9c16";
      } else if (colorMag <= 6) {
        color = "#f61719";
      } else if (colorMag <= 7) {
        color = "#f818fa";
      }

      // Añadir info
      L.circleMarker(coordinates_pin, {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
      })
        .bindPopup(
          `
                <h3 class="popup-title">${pin.properties.title}</h3>
                <p class="popup-text"><span>Fecha: </span>${pin.properties.updated}</p>
                <p class="popup-text"><span>Lugar: </span>${pin.properties.place}</p>
                <p class="popup-text"><span>Código: </span>${pin.properties.code}</p>
                <p class="popup-text" id="mag"><span>Magnitud: </span>${pin.properties.mag}</p>
            `
        )
        .addTo(filterMap);
    });
  });
});

// Objeto de conexión
let firebaseConfig = {
  apiKey: "AIzaSyB9pXcMFfhfAQIHUKgY-0uJ_GymlsfmiLk",
  authDomain: "fir-web-e6114.firebaseapp.com",
  projectId: "fir-web-e6114",
  storageBucket: "fir-web-e6114.firebasestorage.app",
  messagingSenderId: "52533220535",
  appId: "1:52533220535:web:9247805c509834fdb6a932",
};

// Inicializaar app Firebase
firebase.initializeApp(firebaseConfig);

// db representa mi BBDD //inicia Firestore
const db = firebase.firestore();

// REGISTRO DE USUARIO
// Crear elemento
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => {
      alert(`Has sido registrado correctamente. Su id es: ${docRef.id}`);
    })
    .catch((error) => console.error("Error adding document: ", error));
};

// Crear Registro
document.getElementById("form-register").addEventListener("submit", (event) => {
  // Evitar comportamiento por defecto del formulario
  event.preventDefault();
  // Capturar valores del usuario
  const username = event.target.username.value.trim();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();

  const passwordValidation = /^(?=.*[A-Z]).{6,}$/;
  // Validar campos
  if (!username || !email) {
    alert("Hay un campo vacio. Rellénelo por favor.");
    return;
  }
  if (!passwordValidation) {
    alert(
      `Contraseña Incorrecta -> Debe tener mínimo 6 Carácteres y 1 Mayúscula`
    );
    return;
  }
  // Añadir al elemento los valores
  createUser({
    username,
    email,
    password,
  });
  // Resetear formulario
  event.target.reset();
});