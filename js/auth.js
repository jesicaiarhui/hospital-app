document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const autorizados = ["director@hospital.com", "secretario@hospital.com"];

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      if (autorizados.includes(email)) {
        // Usuario autorizado, redirige
        window.location.href = "vista-direccion.html";
      } else {
        // Usuario no autorizado, muestra error y cierra sesión
        document.getElementById("error").textContent = "Acceso no autorizado.";
        firebase.auth().signOut();
      }
    })
    .catch(error => {
      console.error("Error en login:", error);
      document.getElementById("error").textContent = "Error: " + error.message;
    });
});
