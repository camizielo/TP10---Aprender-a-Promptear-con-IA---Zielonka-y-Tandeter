import { StatusCodes } from 'http-status-codes';

export default function parsearId(req, res, next) {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(StatusCodes.BAD_REQUEST).send('El id debe ser un número entero positivo.');
    }

    req.params.id = id;
    next();
}