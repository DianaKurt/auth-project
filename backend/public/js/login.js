// Если у тебя есть локальный бэкенд
const LOCAL_API_URL = 'http://localhost:5000';
const PROD_API_URL = 'https://auth-project-2-f7z0.onrender.com';

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? LOCAL_API_URL
  : PROD_API_URL;

console.log('Using API URL:', API_URL);

const form = document.getElementById('loginForm');
if (!form) {
  console.error('Login form not found');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = 'users.html';

  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});
