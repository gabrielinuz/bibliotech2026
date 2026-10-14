/**
*    Project     : Bibliotech
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { validateRegister, validateLogin } = require('../middleware/validation_middleware');

// Ruta para el registro: POST /api/auth/register con validación intermedia
router.post('/register', validateRegister, authController.register);

// Ruta para el login: POST /api/auth/login con validación intermedia
router.post('/login', validateLogin, authController.login);

module.exports = router;