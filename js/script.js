// MAPA TERREMOTOS EN VIVO
var map = L.map("map").setView([51.505, -0.09], 1.5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

async function getMap() {
  try {
    // LLAMAR A API
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    // CONVERTIRLO A JSON
    const data = await res.json();
    // Retornar dentro de data a la propiedad features
    return data.features;
  } catch (e) {
    console.log(e);
  }
}

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

    // Añadir info a PopUp
    const markers = L.marker(coordinates_pin)
      .bindPopup(
        `
                <h3 class="popup-title">${pin.properties.title}</h3>
                <p class="popup-text"><span>Fecha: </span>${pin.properties.time}</p>
                <p class="popup-text"><span>Lugar: </span>${pin.properties.place}</p>
                <p class="popup-text"><span>Código: </span>${pin.properties.code}</p>
                <p class="popup-text"><span>Magnitud: </span>${pin.properties.mag}</p>
                <button class='fav-btn'>Añadir a Destacado</button>
                `
      )
      .addTo(map);
    markers.on("popupopen", () => {
      const favButton = document.querySelector(".fav-btn");

      if (favButton) {
        favButton.addEventListener("click", () => {
          alert(
            `El Terremoto ${pin.properties.title} ha sido guardado a tu lista.`
          );
        });
      }
    });
  });
});

// MAPA HISTORIAL DE TERREMOTOS
var filterMap = L.map("filter-map").setView([51.505, -0.09], 1.5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(filterMap);

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
  document.getElementById("add-btn").addEventListener("click", () => {
    const mag = parseFloat(document.getElementById("mag").value);
    // Capturamos input - Sacamos valor - Formateamos
    const startDate = document.getElementById("start-date").value;
    const formatStart = new Date(startDate);

    const endDate = document.getElementById("end-date").value;
    const formatEnd = new Date(endDate);

    const dataFilter = data.filter((data) => {
      const formatDate = new Date(data.properties.time);
      return (
        data.properties.mag <= mag ||
        (formatDate >= formatStart && formatDate <= formatEnd)
      );
    });

    dataFilter.map((pin) => {
      const coordinates_pin = [
        pin.geometry.coordinates[1],
        pin.geometry.coordinates[0],
      ];

      const valueMag = pin.properties.mag;
      if (valueMag <= 0) {
        color = "#f0f0f0";
      } else if (valueMag <= 1) {
        color = "#1d8919";
      } else if (valueMag <= 2) {
        color = "#8e911c";
      } else if (valueMag <= 3) {
        color = "#f9f016";
      } else if (valueMag <= 4) {
        color = "#f6ce1d";
      } else if (valueMag <= 5) {
        color = "#fb9c16";
      } else if (valueMag <= 6) {
        color = "#f61719";
      } else if (valueMag <= 7) {
        color = "#f818fa";
      }

      L.circleMarker(coordinates_pin, {
        radius: 8,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
      }).addTo(filterMap);
    });
  });
});

// Información Niveles Sísmicos
// const infoHidden = document.getElementById("container-info")
// document.getElementById("life-btn").addEventListener("click", () => {
//    infoHidden.innerHTML += `
//     <div class="info-hidden">
//       <h4>Colores Niveles Sísmicos</h4>
//       <ol class="info-list">
//         <li class="info-element">0 <i class="fa fa-circle"></i></li>
//         <li class="info-element">1 <i class="fa fa-circle"></i></li>
//         <li class="info-element">2 <i class="fa fa-circle"></i></li>
//         <li class="info-element">3 <i class="fa fa-circle"></i></li>
//         <li class="info-element">4 <i class="fa fa-circle"></i></li>
//         <li class="info-element">5 <i class="fa fa-circle"></i></li>
//         <li class="info-element">6 <i class="fa fa-circle"></i></li>
//         <li class="info-element">7 <i class="fa fa-circle"></i></li>
//       </ol>   
//     </div>
//     `
//     const lifeBtn = document.getElementById("life-btn")
//     lifeBtn.disabled = true;
// })

// MODAL REGISTRO DE USUARIOS
let modalRegister = document.getElementById("register-modal");
let openRegister = document.getElementById("register-open");
let closeRegister = document.getElementById("register-close");

openRegister.addEventListener("click", () => {
  modalRegister.style.display = "block";
})

closeRegister.addEventListener("click", () => {
  modalRegister.style.display = "none";
})

// MODAL INICIO DE SESIÓN
let modalLogin = document.getElementById("login-modal");
let openLogin = document.getElementById("login-open");
let closeLogin = document.getElementById("login-close");

openLogin.addEventListener("click", () => {
  modalLogin.style.display = "block";
});
closeLogin.addEventListener("click", () => {
  modalLogin.style.display = "none";
})

// MODAL INFORMACIÓN ESCALA DE MAGNITUD
let modalInfo = document.getElementById("info-modal");
let closeInfo = document.getElementById("close-info");

closeInfo.addEventListener("click", () => {
  modalInfo.style.display = "none";
});

// FIRESTORE
// Objeto de Conexión
let firebaseConfig = {
  apiKey: "AIzaSyB9pXcMFfhfAQIHUKgY-0uJ_GymlsfmiLk",
  authDomain: "fir-web-e6114.firebaseapp.com",
  projectId: "fir-web-e6114",
  storageBucket: "fir-web-e6114.firebasestorage.app",
  messagingSenderId: "52533220535",
  appId: "1:52533220535:web:9247805c509834fdb6a932",
};

// Inicializar app Firebase
firebase.initializeApp(firebaseConfig);

// db representa mi BBDD //inicia Firestore
const db = firebase.firestore();

// REGISTRO DE USUARIO
// Crear elemento de Registro
const createUser = (user) => {
  db.collection("registerUsers")
    .add(user)
    .then((docRef) => {
      alert(`Has sido registrado correctamente. Su id es: ${docRef.id}`);
    })
    .catch((error) =>
      console.error(
        `Ha habido un error en su registro: ${error}. Inténtelo de nuevo por favor.`
      )
    );
};

// Crear Registro
document.getElementById("register-form").addEventListener("submit", (event) => {
  // Evitar comportamiento por defecto
  event.preventDefault();

  // Capturar valores del usuario
  const username = event.target.username.value.trim();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();
  const repitePassword = event.target.repitePassword.value.trim();

  // Regex para Contraseña
  const passwordValidation = /^(?=.*[A-Z]).{6,}$/;

  // Validación de los input
  if (!username) {
    alert(`El campo ${username} está incompleto.`);
  } else if (!email) {
    alert(`El campo ${email} está incompleto.`);
  } else if (!password) {
    alert(
      `Contraseña incompleta ${password}. Debe tener al menos 1 mayúscula y mínimo 6 carácteres.`
    );
  } else if (password != repitePassword) {
    alert(`Las contraseñas deben coincidir.`);
  }

  // Añadir valores a la colección Usuario
  createUser({
    username,
    email,
    password,
  });
  // Resetear Formulario
  event.target.reset();
});

// Eliminar Usuario
const deleteUser = () => {
  const email = prompt(`Introduce su email para eliminar su usuario.`);
  db.collection("registerUsers")
    .doc(email)
    .delete()
    .then(() => {
      alert(`Su usuario con email ${email} ha sido eliminado.`);
    })
    .catch(() => {
      alert(
        `Su usuario con email ${email} no se ha podido eliminar. Inténtelo de nuevo.`
      );
    });
};