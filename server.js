const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const usersFile = path.join(__dirname, 'users.json');

app.use(express.static('public'));
app.use(express.json());

// SIGNUP route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  let users = {};

  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '{}');
  } catch (err) {
    console.error('Error reading users file:', err);
  }

  if (users[username]) {
    return res.json({ success: false, message: 'Username already exists' });
  }

  users[username] = { password };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// LOGIN route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = {};

  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '{}');
  } catch (err) {
    console.error('Error reading users file:', err);
  }

  if (users[username] && users[username].password === password) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Chat socket
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
