// js/tecnologia.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-njgJVKA7Wv65Ql8dnYjFqxSaIWB1B9c",
  authDomain: "hospital-evaluacion.firebaseapp.com",
  projectId: "hospital-evaluacion",
  storageBucket: "hospital-evaluacion.firebasestorage.app",
  messagingSenderId: "918201475092",
  appId: "1:918201475092:web:e0c3866388ca58b0374701",
  measurementId: "G-XENCVH6YRE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia al formulario
const form = document.getElementById("tecnologia");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Fecha legible YYYY-MM-DD
  const fecha = new Date().toISOString().split("T")[0];

  // Obtener datos del formulario
  const sector = document.getElementById("sector").value.trim();
  const equipos = document.getElementById("equipos").value.trim();
  const estado = parseInt(document.getElementById("estado").value);
  const mantenimiento = form.querySelector("input[name='mantenimiento']:checked")?.value || "";
  const tipo_mantenimiento = document.getElementById("tipo_mantenimiento").value.trim();
  const equipos_fuera_servicio = document.getElementById("equipos_fuera_servicio").value.trim();
  const notificado_a = document.getElementById("notificado_a").value.trim();
  const tiempo_estimado_reposicion = document.getElementById("tiempo_estimado_reposicion").value.trim();
  const nuevas_tecnologias = document.getElementById("nuevas_tecnologias").value.trim();
  const observaciones = document.getElementById("observaciones").value.trim();

  // Calcular color del semáforo según estado
  let color_semaforo = "";
  if (estado >= 80) {
    color_semaforo = "Verde";
  } else if (estado >= 50) {
    color_semaforo = "Amarillo";
  } else {
    color_semaforo = "Rojo";
  }

  const data = {
    sector,
    equipos,
    estado,
    mantenimiento,
    tipo_mantenimiento,
    equipos_fuera_servicio,
    notificado_a,
    tiempo_estimado_reposicion,
    nuevas_tecnologias,
    observaciones,
    color_semaforo,
    fecha,
    timestamp: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "recursos_tecnologicos"), data);

    // Mostrar modal de éxito
    mostrarModal();

    // Resetear formulario
    form.reset();
  } catch (error) {
    console.error("Error al guardar los datos:", error);
    alert("❌ Hubo un error al enviar el formulario. Intente nuevamente.");
  }
});

// Modal de éxito (usa la función que ya está en tu HTML)
function mostrarModal() {
  const modal = document.getElementById("modal-exito");
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.display = "none";
  }, 5000);
}
