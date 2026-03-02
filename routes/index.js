var express = require('express');
var router = express.Router();
/* GET home page. */
//localhost:3000/api/v1/
router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to API v1', endpoints: ['/users', '/roles', '/products', '/categories'] });
});

module.exports = router;
