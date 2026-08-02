import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export default function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).send('No se proporcionó un token de autenticación.');
    }

    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer' || !partes[1]) {
        return res.status(StatusCodes.UNAUTHORIZED).send('El formato del token es inválido. Se espera: Bearer <token>.');
    }

    const token = partes[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioAutenticado = payload;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).send('El token expiró. Volvé a iniciar sesión.');
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(StatusCodes.UNAUTHORIZED).send('Token inválido.');
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send('Token inválido.');
        }
    }
}