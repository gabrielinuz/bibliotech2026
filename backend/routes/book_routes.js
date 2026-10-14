/**
*  Project     : Bibliotech
*  Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*  License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
 * Description : Rutas de API para la gestión documental de libros PDF.
 */

 const express = require('express');
 const router = express.Router();
 const bookController = require('../controllers/book_controller');
 const uploadMiddleware = require('../config/multer_config');
 const { verifyToken } = require('../middleware/auth_middleware');
 const { validateBookUpload } = require('../middleware/validation_middleware');
 
 // Todas las rutas de libros requieren sesión activa
 router.use(verifyToken);
 
 // Cargar un nuevo documento PDF
 router.post('/upload', uploadMiddleware, validateBookUpload, bookController.uploadBook);
 
 // Obtener la biblioteca del cliente actual
 router.get('/my-books', bookController.getMyBooks);
 
 // Eliminar un documento por ID
 router.delete('/:id', bookController.deleteBook);
 
 module.exports = router;
 