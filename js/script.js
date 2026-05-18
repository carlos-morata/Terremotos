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

// Firebase Auth
const auth = firebase.auth();

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
                <button class='fav-btn'>Añadir a Favoritos</button>
                `
      )
      .addTo(map);

      markers.on("popupopen", () => {
        const popupElement = markers.getPopup().getElement();
        const favButton = popupElement.querySelector(".fav-btn");

        favButton.addEventListener("click", () => {
          addEarthquakeFavorites(pin);
        })
      })
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
      let color;
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

// MODAL REGISTRO DE USUARIOS
let modalRegister = document.getElementById("register-modal");
let openRegister = document.getElementById("register-open");
let closeRegister = document.getElementById("register-close");

openRegister.addEventListener("click", () => {
  modalRegister.style.display = "block";
});

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

// Crear Usuario
document.getElementById("register-form").addEventListener("submit", async (event) => {
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
    return;

  } else if (!email) {
    alert(`El campo ${email} está incompleto.`);
    return;

  } else if (!passwordValidation.test(password)) {
    alert(
      `Contraseña incompleta ${password}. Debe tener al menos 1 mayúscula y mínimo 6 carácteres.`);
      return;

  } else if (password != repitePassword) {
    alert(`Las contraseñas deben coincidir.`);
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Añadir a colección "users"
    await db.collection("users").doc(user.uid).set({
      username,
      email,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      favorites: []
    });

    alert("Usuario registrado correctamente!");
    modalRegister.style.display = "none";
    event.target.reset();

  } catch (error) {
    console.error(error);
  }
});

// Inicio de Sesión
document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  
  if (auth.currentUser) {
    alert("Ya hay una sesión iniciada.");
    modalLogin.style.display = "none";
    return;
  }

  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    alert(`Sesión iniciada: ${userCredential.user.email}`);
    modalLogin.style.display = "none";
    event.target.reset();
  } catch (error) {
    console.error(error);
  }
});

// Cerrar Sesión
const logoutButton = document.getElementById("logout-open");
logoutButton.addEventListener("click", async () => {
  if(!auth.currentUser) {
    return;
  }

  try {
    await auth.signOut();
    alert("Has cerrado sesión correctamente.");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("No se ha podido cerrar sesión.");
  }
})


// Cambio usuario sin registrar a registrado
const RegisterLoginBtn = document.querySelectorAll(".user-close");
const openLogout = document.getElementById("logout-open");
const welcomeText = document.getElementById("info-text");

auth.onAuthStateChanged(async (user) => {
  if(user) {
    RegisterLoginBtn.forEach((button) => {
      button.style.display = "none";
    });
    openLogout.style.display = "block";
    // Terremotos Favoritos
    getUserFavorites();
  } else {
    getUserFavorites();
  }

  try {
    // Sacar el username del usuario
    const userDoc = await db.collection("users").doc(user.uid).get();

    if(userDoc.exists) {
      const userData = userDoc.data();
      welcomeText.innerHTML = `¡Hola ${userData.username}! Tu experiencia sísmica acaba de mejorar: guarda, organiza y sigue los terremotos que quieras tener bajo control.`;
    }
  } catch (error) {
      console.error(error);
    }
})

// Añadir Terremotos a Favoritos
const addEarthquakeFavorites = async (earthquake) => {
  const user = auth.currentUser;

  if(!user) {
    alert("Debes iniciar sesión para guardar terremotos favoritos.");
    return;
  }

  try {
    await db
      .collection("users")
      .doc(user.uid)
      .collection("favorites")
      .doc(earthquake.id)
      .set({
        id: earthquake.id,
        title: earthquake.properties.title,
        magnitude: earthquake.properties.mag,
        place: earthquake.properties.place,
        time: earthquake.properties.time,
        url: earthquake.properties.url,
        coordinates: earthquake.geometry.coordinates,
        savedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert("¡Terremoto añadido a favoritos con éxito!");
      getUserFavorites();
  } catch (error) {
    console.error(error);
  }
}

// Mostrar Terremotos Favoritos
const getUserFavorites = async () => {
  const user = auth.currentUser;
  const favoriteContainer = document.getElementById("favorites-earthquake-container");

  favoriteContainer.innerHTML = "";

  if(!user) {
    favoriteContainer.innerHTML = '<p class="alert-text-earthquake">Inicia sesión para ver tus terremotos favoritos.</p>';
    return;
  }

  try {
    const earthquakeFavorite = await db
      .collection("users")
      .doc(user.uid)
      .collection("favorites")
      .orderBy("savedAt", "desc")
      .get();

      if(earthquakeFavorite.empty) {
        favoriteContainer.innerHTML = '<p class="alert-text-earthquake">No tienes terremotos favoritos añadidos todavía.</p>';
        return;
      }

      earthquakeFavorite.forEach((doc) => {
        const earthquake = doc.data();
        const date = new Date(earthquake.time).toLocaleString("es-ES");

        const favoriteArticle = document.createElement("article");
        favoriteArticle.className = "favorite-earthquake-article"

        favoriteArticle.innerHTML = `
          <h3 class="favorite-earthquake-title">${earthquake.title}</h3>
          <p class="favorite-earthquake-text"><span>Fecha:</span> ${date}</p>
          <p class="favorite-earthquake-text"><span>Lugar:</span> ${earthquake.place}</p>
          <p class="favorite-earthquake-text"><span>Código:</span> ${earthquake.code}</p>
          <p class="favorite-earthquake-text"><span>Magnitud:</span> ${earthquake.magnitude}</p>
          <a href="${earthquake.url}" target="_blank" class="favorite-earthquake-link">Ver más información</a>
          <button class="delete-fav-btn">Eliminar</button>
        `;

        const deleteButton = favoriteArticle.querySelector(".delete-fav-btn");

        deleteButton.addEventListener("click", async () => {
          const user = auth.currentUser;

          await db
            .collection("users")
            .doc(user.uid)
            .collection("favorites")
            .doc(doc.id)
            .delete();

            getUserFavorites();
        });

        favoriteContainer.appendChild(favoriteArticle);
      });
      
  } catch (error) {
    console.error(error);
  }
}