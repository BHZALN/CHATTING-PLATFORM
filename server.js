const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

const usersFile = path.join(__dirname, 'users.json');

app.use(express.static('public'));
app.use(express.json());

document.getElementById('signupBtn')?.addEventListener('click', async () => {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error('Network error');

    const data = await res.json();
    if (data.success) {
      alert('Signup successful! Please login.');
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error or invalid response');
  }
});

document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error('Network error');

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('username', username);
      window.location.href = 'chat.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error or invalid response');
  }
});


io.on('connection', socket => {
  socket.on('chat message', data => {
    io.emit('chat message', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
