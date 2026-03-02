var express = require('express');
var router = express.Router();

let categories = [
  { "id": 1, "name": "Clothes", "slug": "clothes", "image": "https://i.imgur.com/QkIa5tT.jpeg", "creationAt": "2026-02-01T19:28:25.000Z", "updatedAt": "2026-02-01T19:28:25.000Z" },
  { "id": 2, "name": "Electronics", "slug": "electronics", "image": "https://i.imgur.com/ZANVnHE.jpeg", "creationAt": "2026-02-01T19:28:25.000Z", "updatedAt": "2026-02-01T19:28:25.000Z" },
  { "id": 3, "name": "Furniture", "slug": "furniture", "image": "https://i.imgur.com/Qphac99.jpeg", "creationAt": "2026-02-01T19:28:25.000Z", "updatedAt": "2026-02-01T19:28:25.000Z" },
  { "id": 4, "name": "Shoes", "slug": "shoes", "image": "https://i.imgur.com/qNOjJje.jpeg", "creationAt": "2026-02-01T19:28:25.000Z", "updatedAt": "2026-02-01T19:28:25.000Z" },
  { "id": 5, "name": "Miscellaneous", "slug": "miscellaneous", "image": "https://i.imgur.com/BG8J0Fj.jpg", "creationAt": "2026-02-01T19:28:25.000Z", "updatedAt": "2026-02-01T19:28:25.000Z" }
];

/* GET categories listing. */
router.get('/', function(req, res, next) {
  const { name, slug } = req.query;
  let filteredCategories = categories;

  if (name) {
    filteredCategories = filteredCategories.filter(category => category.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (slug) {
    filteredCategories = filteredCategories.filter(category => category.slug === slug);
  }

  res.json(filteredCategories);
});

// GET /categories/:id - Lấy category theo id
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const category = categories.find(category => category.id === id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

// POST /categories - Tạo category mới
router.post('/', function(req, res, next) {
  const { name, image } = req.body;
  if (!name || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newId = Math.max(...categories.map(c => c.id)) + 1;
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
  const newCategory = {
    id: newId,
    name,
    slug,
    image,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// PUT /categories/:id - Cập nhật category
router.put('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const { name, image } = req.body;
  const updatedCategory = {
    ...categories[index],
    name: name || categories[index].name,
    image: image || categories[index].image,
    updatedAt: new Date().toISOString()
  };
  if (name) {
    updatedCategory.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
  }
  categories[index] = updatedCategory;
  res.json(updatedCategory);
});

// DELETE /categories/:id - Xóa category
router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }
  categories.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
