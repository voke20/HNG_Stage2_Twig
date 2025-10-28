document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const csrfToken = document.querySelector('input[name="_csrf_token"]').value;

  form.addEventListener("submit", async (e) => {
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

    try {
      const response = await fetch('/login_check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          _username: email,
          _password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = data.redirect || "/dashboard";
        }, 1000);
      } else {
        showToast(data.message || "Invalid email or password", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
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