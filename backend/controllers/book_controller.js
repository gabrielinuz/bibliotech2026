/**
* Project     : Sample Vault
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
*/

const fileHelper = require('../utils/file_helper/file_helper');
const bookRepo = require('../repositories/book_repo');

class BookController 
{
    // Subir un libro PDF y guardarlo en la base de datos
    async uploadBook(req, res, next) 
    {
        try
        {
            const { title, author, category, pages } = req.body;
            const userId = req.userId;
            const filename = req.file.filename;
            const filePath = `/uploads/${filename}`;

            // Persistencia mediante Stored Procedure
            const insertId = await bookRepo.create({
                user_id: userId,
                filename,
                title,
                author,
                category,
                pages: parseInt(pages) || 0,
                file_path: filePath
            });

            res.status(201).json({ 
                message: "Documento PDF cargado exitosamente en la biblioteca.", 
                id: insertId,
                path: filePath 
            });
        }
        catch (error)
        {
            // Limpieza física preventiva ante errores de base de datos
            if (req.file) {
                fileHelper.deleteFile(`/uploads/${req.file.filename}`);
            }
            next(error);
        }
    }

    // Listar libros del cliente autenticado
    async getMyBooks(req, res, next)
    {
        try
        {
            const books = await bookRepo.findByUserId(req.userId);
            res.json(books);
        }
        catch (error)
        {
            next(error);
        }
    }

    // Eliminar un libro de la biblioteca
    async deleteBook(req, res, next) 
    {
        try 
        {
            const { id } = req.params;
            const userId = req.userId;

            // Obtener información del libro para conocer la ruta de almacenamiento
            const book = await bookRepo.findById(id, userId);
            
            if (!book) {
                return res.status(404).json({ message: "El documento no existe o no tienes permisos para eliminarlo." });
            }

            // Eliminar registro en base de datos
            await bookRepo.delete(id, userId);

            // Eliminar archivo físico
            fileHelper.deleteFile(book.file_path); 
            
            return res.json({ message: "Registro eliminado y archivo físico removido con éxito." });
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new BookController();
