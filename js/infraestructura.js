import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("infraestructura");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sector = document.getElementById("sector").value.trim();
  const estado = parseInt(document.getElementById("estado").value);
  const problemaEncontrado = form.querySelector("input[name='problema_encontrado']:checked")?.value || "";
  const detalleProblema = document.getElementById("detalle_problema").value.trim();
  const reportadoA = document.getElementById("reportado_a").value.trim();
  const solucionado = form.querySelector("input[name='solucionado']:checked")?.value || "";
  const tiempo = document.getElementById("tiempo").value.trim();
  const observaciones = document.getElementById("observaciones").value.trim();
  const fecha = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Calcular color semáforo (opcional si después se calcula desde promedio)
  let colorSemaforo = "";
  if (estado >= 80) {
    colorSemaforo = "verde";
  } else if (estado >= 50) {
    colorSemaforo = "amarillo";
  } else {
    colorSemaforo = "rojo";
  }

  const evaluacion = {
    fecha,
    sector,
    estado,
    problemaEncontrado,
    detalleProblema,
    reportadoA,
    solucionado,
    tiempo,
    observaciones,
    colorSemaforo,
    timestamp: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "infraestructura"), evaluacion);
    document.getElementById("modal-exito").style.display = "flex";
    form.reset();
  } catch (error) {
    console.error("Error al guardar evaluación:", error);
    alert("Hubo un error al guardar la evaluación.");
  }
});
