/**
*    Project     : Bibliotech
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const bcrypt = require('bcrypt'); // Biblioteca para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens de sesión
const userRepo = require('../repositories/user_repo'); // Importamos el repositorio de usuarios

/**
 * Deserialización moderna: "Del objeto que devuelve este require, buscá la propiedad que se 
 * llame exactamente SECRET_KEY y creá una constante con ese mismo nombre y valor".
 *  */ 
const { SECRET_KEY } = require('../middleware/auth_middleware'); 

class AuthController 
{
    // Registro de usuarios clientes
    async register(req, res, next) 
    {
        try 
        {
            const { username, password } = req.body;

            // Hashing seguro de contraseña
            const hashedPassword = await bcrypt.hash(password, 10);            
            
            // Persistencia mediante repositorio (asigna rol 'client' por defecto)
            const userId = await userRepo.create(username, hashedPassword, 'client');
            
            res.status(201).json({ 
                message: "Usuario registrado con éxito.", 
                userId 
            });
        }
        catch (error)
        {
            next(error); // Delegar al filtro de errores global (errorMiddleware)
        }
    }

    // Inicio de sesión
    async login(req, res, next) 
    {
        try
        {
            const { username, password } = req.body;

            // Buscar usuario con su rol asociado
            const user = await userRepo.findByUsername(username);

            // Verificar existencia de usuario y contraseña
            if (!user || !(await bcrypt.compare(password, user.password)))
            {
                return res.status(401).json({ message: "Credenciales inválidas." });
            }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    role: user.role 
                }, 
                SECRET_KEY, 
                { expiresIn: '2h' }
            );

            res.json({ 
                message: "Login exitoso.", 
                token, 
                role: user.role 
            });
        }
        catch (error)
        {
            next(error); // Delegar al filtro de errores global
        }
    }
}

module.exports = new AuthController();
