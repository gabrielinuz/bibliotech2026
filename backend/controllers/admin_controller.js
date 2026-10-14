/**
* Project     : Bibliotech
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
*/

const userRepo = require('../repositories/user_repo');
const bookRepo = require('../repositories/book_repo');
const fileHelper = require('../utils/file_helper/file_helper');

class AdminController 
{
    // Listar todos los usuarios con sus roles
    async getAllUsers(req, res, next)
    {
        try
        {
            const users = await userRepo.findAll();
            res.json(users);
        }
        catch (error)
        {
            next(error);
        }
    }

    // Eliminar al usuario y limpiar recursivamente sus archivos PDF en disco
    async deleteUser(req, res, next)
    {
        try
        {
            const targetUserId = req.params.id;
            const adminId = req.userId; 

            // Regla de Negocio: Evitar auto-eliminación
            if (targetUserId == adminId) {
                return res.status(403).json({ 
                    message: "Operación denegada: No puedes eliminar tu propia cuenta de administrador." 
                });
            }

            // Obtener todos los libros cargados por el usuario objetivo
            const userBooks = await bookRepo.findByUserId(targetUserId);
            
            // Eliminar de la base de datos (con cascada de DB)
            const success = await userRepo.delete(targetUserId);

            if (!success) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            // Limpiar almacenamiento en disco
            userBooks.forEach(book => {
                fileHelper.deleteFile(book.file_path);
            });

            res.json({ 
                message: `Usuario eliminado con éxito. Se removieron ${userBooks.length} archivos PDF.` 
            });
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new AdminController();