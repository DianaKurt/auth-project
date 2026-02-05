const API_URL = 'http://localhost:4000';
const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    alert('Registration successful!');
    window.location.href = 'index.html';

  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});
