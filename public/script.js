const BACKEND_URL = 'https://chatting-platformee.onrender.com'; // ✅ FIXED

// ===== LOGIN =====
document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!username || !password) return alert("Please enter username and password");

  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    const data = JSON.parse(text || '{}');

    if (data.success) {
      localStorage.setItem('username', username);
      window.location.href = 'chat.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Server error. Try again later.');
  }
});

// ===== SIGNUP =====
document.getElementById('signupBtn')?.addEventListener('click', async () => {
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!username || !password) {
    return alert("Please enter both username and password.");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    const data = JSON.parse(text || '{}');

    if (data.success) {
      alert('Signup successful. Please login.');
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('Server error. Try again.');
  }
});

// ===== CHAT PAGE SOCKET.IO =====
if (window.location.pathname.endsWith('chat.html')) {
  const socket = io(BACKEND_URL); // connect to backend socket

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const username = localStorage.getItem('username') || 'Anonymous';

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', `${username}: ${input.value}`);
      input.value = '';
    }
  });

  socket.on('chat message', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
}
