// js/direccion.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      const email = user.email.toLowerCase();
      const autorizados = ["director@hospital.com", "secretario@hospital.com"];

      if (autorizados.includes(email)) {
        mostrarContenido();
      } else {
        alert("Acceso no autorizado. Solo dirección puede ver esta página.");
        signOut(auth).then(() => window.location.href = "login.html");
      }
    } else {
      window.location.href = "login.html";
    }
  });

  document.getElementById("btnSalir").addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "login.html";
  });
});

function mostrarContenido() {
  document.getElementById("loading").style.display = "none";
  document.body.classList.remove("oculto");

  document.getElementById("area").addEventListener("change", actualizarVista);
  document.getElementById("periodo").addEventListener("change", actualizarVista);

  actualizarVista();
}

/**
 * Actualiza la vista según área y período seleccionado
 */
async function actualizarVista() {
  const areaSelect = document.getElementById("area");
  const periodoSelect = document.getElementById("periodo");

  const area = areaSelect.value;           // ej: "recursos_tecnologicos"
  const periodo = periodoSelect.value;     // ej: "diario", "semanal", "mensual", "anual"

  // Actualizar textos
  document.getElementById("titulo-area").textContent = `Área: ${formatearTextoArea(area)}`;
  document.getElementById("texto-periodo").textContent = `Evaluación por ${periodo}`;

  // Obtener datos
  const datos = await obtenerDatosEvaluacion(area, periodo);

  if (!datos || datos.length === 0) {
    actualizarSemaforo(null);
    actualizarGrafico([]);
  } else {
    actualizarSemaforo(datos);
    actualizarGrafico(datos);
  }
}

/**
 * Convierte el valor de área a texto legible para mostrar
 */
function formatearTextoArea(area) {
  switch (area) {
    case "recursos_humanos": return "Recursos Humanos";
    case "recursos_tecnologicos": return "Recursos Tecnológicos";
    case "infraestructura": return "Infraestructura";
    case "medicamentos_e_insumos": return "Medicamentos e Insumos";
    default: return area;
  }
}

/**
 * Obtiene los datos desde Firestore filtrando según el área y periodo
 */
async function obtenerDatosEvaluacion(area, periodo) {
  const coleccion = collection(db, area);

  // Fecha base para filtro
  const ahora = new Date();
  let fechaInicio;

  switch (periodo) {
    case "diario":
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      break;

    case "semanal":
      // Obtener primer día de la semana (Lunes)
      const diaSemana = ahora.getDay(); // domingo=0, lunes=1 ...
      const diffLunes = (diaSemana === 0) ? 6 : diaSemana - 1; // si es domingo, retroceder 6 días
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - diffLunes);
      fechaInicio.setHours(0,0,0,0);
      break;

    case "mensual":
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      break;

    case "anual":
      fechaInicio = new Date(ahora.getFullYear(), 0, 1);
      break;

    default:
      fechaInicio = new Date(0); // Desde 1970
  }

  const q = query(coleccion, where("timestamp", ">=", Timestamp.fromDate(fechaInicio)));

  try {
    const snapshot = await getDocs(q);
    const resultados = [];
    snapshot.forEach(doc => {
      resultados.push(doc.data());
    });
    return resultados;
  } catch (error) {
    console.error("Error al obtener datos de Firestore:", error);
    return [];
  }
}

/**
 * Actualiza el semáforo según datos recibidos
 */
function actualizarSemaforo(datos) {
  const estadoTexto = document.querySelector(".estado-texto");
  const luces = document.querySelectorAll(".luz");

  luces.forEach(l => l.classList.remove("activo"));

  if (!datos || datos.length === 0) {
    document.getElementById("porcentaje").textContent = "--%";
    estadoTexto.textContent = "Estado: Sin datos";
    return;
  }

  const promedio = datos.reduce((acc, cur) => acc + (cur.estado || 0), 0) / datos.length;
  const porcentaje = Math.round(promedio);

  document.getElementById("porcentaje").textContent = `${porcentaje}%`;

  if (porcentaje < 40) {
    luces[0].classList.add("activo"); // rojo
    estadoTexto.textContent = "Estado: Crítico";
  } else if (porcentaje < 70) {
    luces[1].classList.add("activo"); // amarillo
    estadoTexto.textContent = "Estado: Regular";
  } else {
    luces[2].classList.add("activo"); // verde
    estadoTexto.textContent = "Estado: Óptimo";
  }
}

/**
 * Actualiza el gráfico con los datos recibidos
 */
function actualizarGrafico(datos) {
  const ctx = document.getElementById("grafico-estadisticas").getContext("2d");

  if (!datos || datos.length === 0) {
    if (window.graficoExistente) window.graficoExistente.destroy();
    return;
  }

  // Etiquetas simples: Fecha o índice
  const labels = datos.map((d, i) => d.fecha || `Dato ${i + 1}`);
  const valores = datos.map(d => d.estado || 0);

  const data = {
    labels,
    datasets: [{
      label: "Estado de evaluación",
      data: valores,
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgb(75, 192, 192)",
      borderWidth: 1
    }]
  };

  if (window.graficoExistente) {
    window.graficoExistente.destroy();
  }

  window.graficoExistente = new Chart(ctx, {
    type: "bar",
    data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}
