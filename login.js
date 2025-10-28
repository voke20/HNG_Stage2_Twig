document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear errors
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;

    // Validation
    if (!email) {
      emailError.textContent = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError.textContent = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      passwordError.textContent = "Password is required";
      isValid = false;
    }

    if (!isValid) return;

    // Check credentials first
    if (email === "demo@ticketflow.com" && password === "demo123") {
      const session = {
        email: email,
        name: "Demo User",
        token: "demo-token-" + Date.now()
      };
      localStorage.setItem("ticketapp_session", JSON.stringify(session));
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
      return;
    }

    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      const session = {
        email: foundUser.email,
        name: foundUser.firstName + " " + foundUser.lastName,
        token: "token-" + Date.now()
      };
      localStorage.setItem("ticketapp_session", JSON.stringify(session));
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      showToast("Invalid email or password", "error");
    }
  });

  // Toast functions
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.className = type === 'error' ? 'toast error' : 'toast';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }

  window.hideToast = function() {
    document.getElementById('toast').classList.add('hidden');
  };
});