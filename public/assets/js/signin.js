// Password visibility toggle
const togglePassword = () => {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.far');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }
  };

  const signinForm = {
    async handleSubmit(event) {
      event.preventDefault();

      // Get form values
      const formData = {
        email: document.getElementById('name').value.trim(),
        password: document.getElementById('password').value.trim()
      };

      // Basic validation
      if (!this.validateForm(formData)) {
        return;
      }

      try {
        const response = await fetch('/api/users/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data if needed
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('authToken', data.token)
          window.location.href = '/'; // Redirect to dashboard
        } else {
          alert(data.message || 'Sign in failed');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        alert('An error occurred during sign in');
      }
    },

    validateForm(data) {
      if (!data.email || !data.password) {
        alert('All fields are required');
        return false;
      }
      return true;
    }
  };

  // Add event listeners
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const eyeIcon = document.querySelector('.far');

    if (form) {
      form.addEventListener('submit', (e) => signinForm.handleSubmit(e));
    }

    if (eyeIcon) {
      eyeIcon.addEventListener('click', togglePassword);
    }
  });