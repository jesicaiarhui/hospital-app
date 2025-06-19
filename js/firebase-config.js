// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-njgJVKA7Wv65Ql8dnYjFqxSaIWB1B9c",
  authDomain: "hospital-evaluacion.firebaseapp.com",
  projectId: "hospital-evaluacion",
  storageBucket: "hospital-evaluacion.firebasestorage.app",
  messagingSenderId: "918201475092",
  appId: "1:918201475092:web:e0c3866388ca58b0374701",
  measurementId: "G-XENCVH6YRE"
};

const app = initializeApp(firebaseConfig);

export { app, firebaseConfig };
