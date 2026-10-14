/**
*    Project     : Bibliotech
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');

// Importamos los middlewares centralizados
const { verifyToken, isAdmin } = require('../middleware/auth_middleware');

/**
 * Aplicamos la cadena de seguridad a todas las rutas:
 * 1. ¿Quién sos? (verifyToken)
 * 2. ¿Tenés permiso? (isAdmin)
 */
router.use(verifyToken, isAdmin);

// Listar todos los usuarios registrados
router.get('/users', adminController.getAllUsers);

// Eliminar un usuario del sistema por su ID
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;