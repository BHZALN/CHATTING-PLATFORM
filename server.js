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

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  let users = {};

  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '{}');
  } catch (err) {
    console.error('Failed to read users.json', err);
  }

  if (users[username]) {
    return res.json({ success: false, message: 'Username already exists' });
  }

  users[username] = { password };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  return res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '{}');

  if (users[username] && users[username].password === password) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: 'Invalid credentials' });
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
