// Login del panel de administrador (Firebase Authentication, correo + contraseña).

auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "panel.html";
  }
});

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorBox = document.getElementById("form-error");
  const btn = document.getElementById("btn-login");
  errorBox.classList.remove("visible");

  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Entrando…';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "panel.html";
  } catch (err) {
    console.error(err);
    errorBox.textContent = "Correo o contraseña incorrectos, o el usuario administrador aún no existe.";
    errorBox.classList.add("visible");
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});
