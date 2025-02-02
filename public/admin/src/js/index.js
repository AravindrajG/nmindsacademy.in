document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const loader = document.getElementById('loader');
      loader.style.display = 'flex';

      const emailInput = loginForm.querySelector("input[type='email']").value;
      const passwordInput = loginForm.querySelector("input[type='password']").value;


      // Validate credentials
      if (emailInput && passwordInput ) {
        const formData = {userName: emailInput, password:passwordInput}

        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(res.status == 401) {
          alert(data.message);
        }
        if(res.status == 404) {
          alert(data.message);
        }
        if (res.ok) {
          localStorage.setItem('admin', JSON.stringify(data.user));
          localStorage.setItem('authToken', data.token)
          window.location.href = "adminDash.html";
        }
      } else {
        alert("Invalid email or password. Please try again.");
      }
      loader.style.display = 'none';
    });
  });