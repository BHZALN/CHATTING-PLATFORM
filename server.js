document.addEventListener("DOMContentLoaded", () => {
  // LOGIN BUTTON
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!username || !password) return alert("Please enter username and password");

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

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
  }

  // SIGNUP BUTTON
  const signupBtn = document.getElementById('signupBtn');
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      const username = document.getElementById('signupUsername').value.trim();
      const password = document.getElementById('signupPassword').value.trim();

      if (!username || !password) return alert("Please enter username and password");

      try {
        const res = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
          alert('Signup successful! Please login.');
          window.location.href = 'index.html'; // or login.html if you rename it
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        alert('Server error. Try again later.');
      }
    });
  }

  // CHAT SOCKET LOGIC (on chat.html only)
  if (window.location.pathname.endsWith('chat.html')) {
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const username = localStorage.getItem('username') || 'Anonymous';

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        socket.emit('chat message', `${username}: ${input.value.trim()}`);
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
});
