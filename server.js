const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// CORS SETUP
app.use(cors({
  origin: 'https://xischat-io-vuew.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true
}));



// Location of users.json
const usersFile = path.join(__dirname, 'users.json');

// Serve frontend files from public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- SIGNUP ---
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "Missing credentials" });

  let users = {};
  try {
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading users file:', err);
  }

  if (users[username]) {
    return res.json({ success: false, message: 'Username already exists' });
  }

  users[username] = { password };

  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing users file:', err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// --- LOGIN ---
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

// --- SOCKET.IO CHAT ---
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// --- RUN SERVER ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
