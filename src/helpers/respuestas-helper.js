
import { StatusCodes } from 'http-status-codes';

export function responderOk(res, data) {
    res.status(StatusCodes.OK).json(data);
}

export function responderCreated(res, data) {
    res.status(StatusCodes.CREATED).json(data);
}

export function responderNotFound(res, mensaje) {
    res.status(StatusCodes.NOT_FOUND).send(mensaje);
}

export function responderBadRequest(res, mensaje) {
    res.status(StatusCodes.BAD_REQUEST).send(mensaje);
}

export function responderError(res, error, statusCode) {
    console.log(error);
    res.status(statusCode).send(`Error: ${error.message}`);
}