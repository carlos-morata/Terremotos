// MAPA GENERAL
var map = L.map('map').setView([51.505, -0.09], 1.5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// MAPA FILTRADO
var filterMap = L.map('filter-map').setView([51.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(filterMap);

//Agregar marcador
const marker = L.marker([40.450325, -3.692854])
.bindPopup("Aquí no hay terremoto")
.addTo(map);

//Agregar circulo
const circle = L.circle([40.450325, -3.692854], {
    color: '#14213d',
    fillOpacity: 0.4,
    radius: 500
})
.bindPopup("")
.addTo(map);

// MAPA GENERAL
async function getMap () {
    try {
        // LLAMAR A API
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
        // CONVERTIRLO A JSON
        const data = await res.json();
        // Retornar dentro de data features
        return data.features;
    }
    catch(e) {
        console.log(e);
    }
}

// LLamar a función
getMap().then(data => {

    // Agregar Marcador
    data.map(pin => {
        // Coordenadas -> Latitud, Longitud
        const coordinates_pin = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]]

        // Sacamos el valor de la magnitud
        const colorMag = pin.properties.mag;
        if(colorMag <= 0) {
            color = "#f0f0f0"
        } else if(colorMag <= 1) {
            color = '#1d8919'
        } else if(colorMag <= 2) {
            color = '#8e911c'
        } else if(colorMag <= 3) {
            color = '#f9f016'
        } else if(colorMag <= 4) {
            color = '#f6ce1d'
        } else if(colorMag <= 5) {
            color = '#fb9c16'
        } else if(colorMag <= 6) {
            color = '#f61719'
        } else if(colorMag <= 7) {
            color = '#f818fa'
        }
        // Añadir Círculos magnitud 
        L.circle(coordinates_pin, {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 0.8
        }).addTo(map)

        // Añadir info
        const markers = L.marker(coordinates_pin)
        .bindPopup(`
                <h3 class="popup-title">${pin.properties.title}</h3>
                <p class="popup-text"><span>Fecha: </span>${pin.properties.updated}</p>
                <p class="popup-text"><span>Lugar: </span>${pin.properties.place}</p>
                <p class="popup-text"><span>Código: </span>${pin.properties.code}</p>
                <p class="popup-text" id="mag"><span>Magnitud: </span>${pin.properties.mag}</p>
                <button class='fav-btn'>Añadir a Destacado</button>
                `).addTo(map)        
            marker.on("popupopen", () => {
                // Seleccionar botón
                const favButton = document.querySelector(".fav-btn")
                if(favButton) {
                    favButton.addEventListener("click", () => {
                        alert("El terremoto que te inquieta ha sido guardado a tus destacados!")
                    })
                }
            })
    })
})

// Objeto de conexión
let firebaseConfig = { 
    apiKey: "AIzaSyB9pXcMFfhfAQIHUKgY-0uJ_GymlsfmiLk",
    authDomain: "fir-web-e6114.firebaseapp.com",
    projectId: "fir-web-e6114",
    storageBucket: "fir-web-e6114.firebasestorage.app",
    messagingSenderId: "52533220535",
    appId: "1:52533220535:web:9247805c509834fdb6a932"
}

// Inicializaar app Firebase
firebase.initializeApp(firebaseConfig)

// db representa mi BBDD //inicia Firestore
const db = firebase.firestore() 

// REGISTRO DE USUARIO
// Crear elemento
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => {
      alert(`Has sido registrado correctamente. Su id es: ${docRef.id}`)
    })
    .catch((error) => console.error("Error adding document: ", error))
};

// Crear Registro
document.getElementById("form-register").addEventListener("submit", (event) => {
  // Evitar comportamiento por defecto del formulario
    event.preventDefault()
    // Capturar valores del usuario
    const username = event.target.username.value.trim()
    const email = event.target.email.value.trim()
    const password = event.target.password.value.trim()
    // Validar campos
  if (!username || !email || !password) {
    alert("Hay un campo vacio. No se ha salvado")
    return
}
  // Añadir al elemento los valores
  createUser({
    username,
    email,
    password
  })
  // Resetear formulario
  event.target.reset()
})

// INICIO SESIÓN USUARIO
