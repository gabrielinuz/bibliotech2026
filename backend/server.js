/**
 * Project     : Bibliotech
 * Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
 * Description : Punto de entrada principal para el servidor Backend Express.
*/

/**
 * Carga las variables de entorno desde archivo .env 
 * para no exponer claves en el código.
 * Un archivo .env es un archivo de texto plano utilizado 
 * en el desarrollo de software para almacenar variables de entorno 
 * y credenciales sensibles (claves API, credenciales de bases de datos, 
 * tokens) fuera del código fuente. Se sitúa en la raíz del proyecto, 
 * usa pares clave-valor y nunca debe subirse al control de versiones (Git). 
 */
 require('dotenv').config();

/**
 * Express es un framework web minimalista, rápido y flexible para Node.js, 
 * diseñado para facilitar la creación de aplicaciones back-end y APIs. 
 * Proporciona una capa ligera de características fundamentales, \
 * como el enrutamiento y la gestión de middleware, \
 * permitiendo construir servidores web de manera eficiente \
 * sin imponer estructuras rígidas.
 */
const express = require('express');

/**
 * Módulo/Biblioteca que permite peticiones desde el origen del frontend:
 */
const cors = require('cors');

/**
 * Módulo/Biblioteca para el manejo de rutas:
 */
const path = require('path');

/**
 * Módulo/Biblioteca para el manejo del filesystem:
 */
const fs = require('fs');

/**
 * Importar las rutas definidas arriba (API y Navegación)
 */
 const authRoutes = require('./routes/auth_routes');
 const bookRoutes = require('./routes/book_routes');
 const adminRoutes = require('./routes/admin_routes');
 const viewRoutes = require('./routes/view_routes');
 const testsRoutes = require('./routes/tests_routes');

// Filtro de errores global
const errorMiddleware = require('./middleware/error_middleware');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuración de Carpetas y Rutas Estáticas ---
// Carpeta de subidas (Audios) Crear 'uploads' si no existe al iniciar el server
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Servir archivos estáticos del FRONTEND 
// (esto permite que el HTML acceda a ../css y ../js)
// Como server.js está en /backend, subimos un nivel para encontrar /frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Registrar rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);

// --- Registrar rutas de Navegación del Frontend ---
// Se coloca al final para que actúe como capturador de rutas de UI

/**
 * Usar una variable de entorno NODE_ENV en el .env para usar
 * el modo testing o production.
 */
if (process.env.NODE_ENV === 'testing') 
{
    app.use('/', testsRoutes);
} 
else 
{
    app.use('/', viewRoutes);
}

// --- Middleware Centralizado de Filtro de Errores ---
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 SampleVault listo en:`);
    console.log(`   Punto de entrada: http://localhost:${PORT}`);
    console.log(`==========================================`);
});