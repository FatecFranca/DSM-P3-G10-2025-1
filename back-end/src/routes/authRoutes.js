const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de login
router.post('/login', authController.login);

// Rota para validar token
router.get('/validate-token', authController.validateToken);

// Rota de registro
router.post('/register', authController.register);

module.exports = router;