var express = require('express');
var router = express.Router();

// In-memory roles store
let roles = [
  { id: 1, name: 'admin', description: 'Administrator', createdAt: '2026-02-01T19:28:25.000Z', updatedAt: '2026-02-01T19:28:25.000Z', deleted: false },
  { id: 2, name: 'user', description: 'Regular user', createdAt: '2026-02-01T19:28:25.000Z', updatedAt: '2026-02-01T19:28:25.000Z', deleted: false }
];

function nextRoleId() { return roles.length ? Math.max(...roles.map(r => r.id)) + 1 : 1; }

// GET /roles
router.get('/', function (req, res, next) {
  const { includeDeleted } = req.query;
  const result = roles.filter(r => includeDeleted === 'true' ? true : !r.deleted);
  res.json(result);
});

// GET /roles/:id
router.get('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const role = roles.find(r => r.id === id && !r.deleted);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
});

// POST /roles
router.post('/', function (req, res, next) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });
  if (roles.some(r => r.name === name)) return res.status(409).json({ message: 'role name exists' });
  const newRole = { id: nextRoleId(), name, description: description || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deleted: false };
  roles.push(newRole);
  res.status(201).json(newRole);
});

// PUT /roles/:id
router.put('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const index = roles.findIndex(r => r.id === id && !r.deleted);
  if (index === -1) return res.status(404).json({ message: 'Role not found' });
  const { name, description } = req.body;
  if (name && roles.some(r => r.name === name && r.id !== id)) return res.status(409).json({ message: 'role name exists' });
  roles[index] = { ...roles[index], name: name || roles[index].name, description: description !== undefined ? description : roles[index].description, updatedAt: new Date().toISOString() };
  res.json(roles[index]);
});

// DELETE /roles/:id - soft delete
router.delete('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  const index = roles.findIndex(r => r.id === id && !r.deleted);
  if (index === -1) return res.status(404).json({ message: 'Role not found' });
  roles[index].deleted = true;
  roles[index].updatedAt = new Date().toISOString();
  res.status(204).send();
});

module.exports = router;
