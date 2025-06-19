// js/recursoshumanos.js

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
const form = document.getElementById("rrhh");

// Evento al enviar el formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener la fecha legible (YYYY-MM-DD)
  const fecha = new Date().toISOString().split("T")[0];

  // Obtener los datos del formulario
  const data = {
    sector: document.getElementById("sector").value,
    turnos_cubiertos: form.turnos_cubiertos.value,
    dificultades_turnos: document.getElementById("dificultades_turnos").value,
    horarios_cumplidos: form.horarios_cumplidos.value,
    comentarios_horarios: document.getElementById("comentarios_horarios").value,
    tiempo_cumplido: form.tiempo_cumplido.value,
    demoras: document.getElementById("demoras").value,
    necesidades: document.getElementById("necesidades").value,
    desempeno: document.getElementById("desempeno").value,
    comunicacion_interna: form.comunicacion_interna.value,
    comentarios_comunicacion: document.getElementById("comentarios_comunicacion").value,
    observaciones: document.getElementById("observaciones").value,
    timestamp: serverTimestamp(),
    fecha: fecha,
    semaforo: calcularSemaforo(form)
  };

  try {
    await addDoc(collection(db, "recursos_humanos"), data);
    mostrarModal();
    form.reset();
  } catch (error) {
    console.error("Error al guardar la evaluación:", error);
    alert("❌ Error al guardar. Intente nuevamente.");
  }
});

// Función para calcular el color del semáforo
function calcularSemaforo(formulario) {
  let puntaje = 0;
  let total = 0;

  total++;
  if (formulario.turnos_cubiertos.value === "Sí") puntaje++;

  total++;
  if (formulario.horarios_cumplidos.value === "Sí") puntaje += 1;
  else if (formulario.horarios_cumplidos.value === "Parcialmente") puntaje += 0.5;

  total++;
  if (formulario.tiempo_cumplido.value === "Sí") puntaje += 1;
  else if (formulario.tiempo_cumplido.value === "A veces") puntaje += 0.5;

  total++;
  if (formulario.comunicacion_interna.value === "Fluida") puntaje += 1;
  else if (formulario.comunicacion_interna.value === "Regular") puntaje += 0.5;

  const porcentaje = (puntaje / total) * 100;

  if (porcentaje >= 80) return "Verde";
  if (porcentaje >= 50) return "Amarillo";
  return "Rojo";
}

// Función para mostrar el modal de éxito
function mostrarModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-contenido">
      <span class="cerrar" onclick="document.getElementById('modal').style.display='none'">&times;</span>
      <h2>✅ Evaluación enviada con éxito</h2>
      <p>Gracias por su colaboración.</p>
    </div>`;
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}
