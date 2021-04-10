const express = require('express');
const blogRouter = express.Router();

blogRouter.get('/post/:id', (req, res) => {});
blogRouter.get('/posts', (req, res) => {
  res.json({ m: 'je' });
});
blogRouter.post('/post', (req, res) => {
  res.json({ m: 'je' });
});

module.exports = blogRouter;
