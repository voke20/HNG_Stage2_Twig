document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const csrfToken = document.querySelector('input[name="_csrf_token"]').value;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear all errors
    document.querySelectorAll('.error').forEach(err => err.textContent = "");

    const first = firstName.value.trim();
    const last = lastName.value.trim();
    const userEmail = email.value.trim();
    const userPassword = password.value.trim();
    const confirmPass = confirmPassword.value.trim();

    let isValid = true;

    // Validation
    if (!first) {
      document.getElementById("firstName-error").textContent = "First name is required";
      isValid = false;
    }

    if (!last) {
      document.getElementById("lastName-error").textContent = "Last name is required";
      isValid = false;
    }

    if (!userEmail) {
      document.getElementById("email-error").textContent = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      document.getElementById("email-error").textContent = "Invalid email format";
      isValid = false;
    }

    if (!userPassword) {
      document.getElementById("password-error").textContent = "Password is required";
      isValid = false;
    } else if (userPassword.length < 6) {
      document.getElementById("password-error").textContent = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPass) {
      document.getElementById("confirmPassword-error").textContent = "Please confirm your password";
      isValid = false;
    } else if (userPassword !== confirmPass) {
      document.getElementById("confirmPassword-error").textContent = "Passwords do not match";
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    try {
      const response = await fetch('/signup_submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          email: userEmail,
          password: userPassword,
          confirmPassword: confirmPass
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Account created successfully! Redirecting to login...", "success");
        setTimeout(() => {
          window.location.href = data.redirect || "/login";
        }, 2000);
      } else {
        showToast(data.message || "Error creating account", "error");
        submitBtn.textContent = "Create Account";
        submitBtn.disabled = false;
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
      submitBtn.textContent = "Create Account";
      submitBtn.disabled = false;
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