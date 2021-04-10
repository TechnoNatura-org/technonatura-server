const express = require('express');
const blogRouter = express.Router();

blogRouter.get('/post/:id', (req, res) => {});
blogRouter.get('/posts', (req, res) => {});
blogRouter.post('/post', (req, res) => {});

module.exports = blogRouter;
