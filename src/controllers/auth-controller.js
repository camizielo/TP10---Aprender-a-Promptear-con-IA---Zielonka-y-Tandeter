import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
    try {
        const { usuario, clave } = req.body;

        if (usuario === process.env.AUTH_USUARIO && clave === process.env.AUTH_CLAVE) {
            const token = jwt.sign(
                { usuario },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.status(StatusCodes.OK).json({ token });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).send('Usuario o clave incorrectos.');
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno del servidor');
    }
});

export default router;