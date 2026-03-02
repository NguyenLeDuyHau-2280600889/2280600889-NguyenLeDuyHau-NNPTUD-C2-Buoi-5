var express = require('express');
var router = express.Router();

// In-memory store for demo purposes
let users = [
  {
    id: 1,
    username: 'johndoe',
    password: 'password1',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatarUrl: 'https://i.sstatic.net/l60Hf.png',
    status: false,
    role: 1,
    loginCount: 0,
    createdAt: '2026-02-01T19:28:25.000Z',
    updatedAt: '2026-02-01T19:28:25.000Z',
    deleted: false
  },
  {
    id: 2,
    username: 'janesmith',
    password: 'password2',
    email: 'jane@example.com',
    fullName: 'Jane Smith',
    avatarUrl: 'https://i.sstatic.net/l60Hf.png',
    status: false,
    role: 2,
    loginCount: 0,
    createdAt: '2026-02-01T19:28:25.000Z',
    updatedAt: '2026-02-01T19:28:25.000Z',
    deleted: false
  }
];

// Helper to get next id
function nextId() {
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// GET /users - get all (exclude soft-deleted by default)
router.get('/', function (req, res, next) {
  const { username, email, role, status, includeDeleted } = req.query;
  let result = users.filter(u => includeDeleted === 'true' ? true : !u.deleted);

  if (username) result = result.filter(u => u.username.toLowerCase().includes(username.toLowerCase()));
  if (email) result = result.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
  if (role) result = result.filter(u => String(u.role) === String(role));
  if (status !== undefined) result = result.filter(u => String(u.status) === String(status));

  res.json(result);
});

// GET /users/:id - get by id
router.get('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id && !u.deleted);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST /users - create new user
router.post('/', function (req, res, next) {
  const { username, password, email, fullName, avatarUrl, role } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'username, password and email are required' });
  if (users.some(u => u.username === username)) return res.status(409).json({ message: 'username already exists' });
  if (users.some(u => u.email === email)) return res.status(409).json({ message: 'email already exists' });

  const newUser = {
    id: nextId(),
    username,
    password,
    email,
    fullName: fullName || '',
    avatarUrl: avatarUrl || 'https://i.sstatic.net/l60Hf.png',
    status: false,
    role: role || null,
    loginCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - update user
router.put('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id && !u.deleted);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  const { username, password, email, fullName, avatarUrl, status, role, loginCount } = req.body;

  if (username && users.some(u => u.username === username && u.id !== id)) return res.status(409).json({ message: 'username already exists' });
  if (email && users.some(u => u.email === email && u.id !== id)) return res.status(409).json({ message: 'email already exists' });

  const updated = {
    ...users[index],
    username: username || users[index].username,
    password: password || users[index].password,
    email: email || users[index].email,
    fullName: fullName !== undefined ? fullName : users[index].fullName,
    avatarUrl: avatarUrl || users[index].avatarUrl,
    status: status !== undefined ? status : users[index].status,
    role: role !== undefined ? role : users[index].role,
    loginCount: loginCount !== undefined ? Math.max(0, loginCount) : users[index].loginCount,
    updatedAt: new Date().toISOString()
  };
  users[index] = updated;
  res.json(updated);
});

// DELETE /users/:id - soft delete
router.delete('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id && !u.deleted);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users[index].deleted = true;
  users[index].updatedAt = new Date().toISOString();
  res.status(204).send();
});

// POST /users/enable - enable by email + username
router.post('/enable', function (req, res, next) {
  const { email, username } = req.body;
  if (!email || !username) return res.status(400).json({ message: 'email and username are required' });
  const user = users.find(u => u.email === email && u.username === username && !u.deleted);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.status = true;
  user.updatedAt = new Date().toISOString();
  res.json({ message: 'User enabled', user });
});

// POST /users/disable - disable by email + username
router.post('/disable', function (req, res, next) {
  const { email, username } = req.body;
  if (!email || !username) return res.status(400).json({ message: 'email and username are required' });
  const user = users.find(u => u.email === email && u.username === username && !u.deleted);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.status = false;
  user.updatedAt = new Date().toISOString();
  res.json({ message: 'User disabled', user });
});

module.exports = router;
