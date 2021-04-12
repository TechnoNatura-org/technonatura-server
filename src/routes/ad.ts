const express = require('express');
const AdRouter = express.Router();

AdRouter.get('/ad/:id', (req, res) => {});
AdRouter.get('/ads', (req, res) => {});
AdRouter.post('/ad', (req, res) => {});

module.exports = AdRouter;
