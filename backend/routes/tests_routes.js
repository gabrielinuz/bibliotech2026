/**
* Project     : Bibliotech
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
* Description : Ruta de navegación del Frontend para servir pruebas unitarias en modo testing.
*/

const express = require('express');
const router = express.Router();
// const path = require('path');

/**
 * Módulo/Biblioteca para el manejo de rutas:
 */
const path = require('path');

// --- Rutas de Navegación del Frontend HTML ---

// Al entrar a http://localhost:3000/ cargamos el html de los tests
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/tests.html'));
});

module.exports = router;