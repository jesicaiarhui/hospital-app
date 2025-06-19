import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const formulario = document.getElementById("insumos");

// Crear y agregar el modal de éxito
const modal = document.createElement("div");
modal.id = "modal-exito";
modal.innerHTML = `
  <div class="modal-contenido">
    <span class="cerrar" onclick="document.getElementById('modal-exito').style.display='none'">&times;</span>
    <h2>✅ Evaluación enviada con éxito</h2>
    <p>Gracias por su colaboración.</p>
  </div>`;
document.body.appendChild(modal);

// Función para determinar el color del semáforo en base a las respuestas
function calcularSemaforo(respuestas) {
  const { faltaron_insumos, porcentaje, incidentes, acceso_adecuado } = respuestas;
  let puntaje = 0;

  if (faltaron_insumos === "No") puntaje += 1;
  if (porcentaje >= 80) puntaje += 1;
  if (incidentes === "No") puntaje += 1;
  if (acceso_adecuado === "Sí") puntaje += 1;

  if (puntaje === 4) return "Verde";
  if (puntaje >= 2) return "Amarillo";
  return "Rojo";
}

// Manejar envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    sector: document.getElementById("sector").value,
    faltaron_insumos: formulario.faltaron_insumos.value,
    faltantes: document.getElementById("faltantes").value,
    porcentaje: parseInt(document.getElementById("porcentaje").value),
    incidentes: formulario.incidentes.value,
    descripcion_incidente: document.getElementById("descripcion_incidente").value,
    necesidades: document.getElementById("necesidades").value,
    acceso_adecuado: formulario.acceso_adecuado.value,
    comentarios_acceso: document.getElementById("comentarios_acceso").value,
    observaciones: document.getElementById("observaciones").value,
    fecha: new Date().toISOString().split("T")[0], // Guardamos la fecha en formato "YYYY-MM-DD"
    timestamp: serverTimestamp() // Usa el timestamp del servidor
  };

  const colorSemaforo = calcularSemaforo(data);

  try {
    await addDoc(collection(db, "medicamentos_insumos"), {
      ...data,
      colorSemaforo
    });

    formulario.reset();
    modal.style.display = "flex";
  } catch (error) {
    alert("❌ Error al guardar: " + error.message);
  }
});
