// src/middlewares/validar-alumno-middleware.js
import { StatusCodes } from 'http-status-codes';

function esStringValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
}

function esNumeroPositivo(valor) {
    const numero = Number(valor);
    return !isNaN(numero) && numero > 0;
}

function esFechaValida(valor) {
    return !isNaN(Date.parse(valor));
}

function esBooleanoOBinario(valor) {
    return typeof valor === 'boolean' || valor === 0 || valor === 1;
}

// Para POST: todos los campos son obligatorios.
export function validarAlumnoCompleto(req, res, next) {
    const entity = req.body || {};

    if (!esStringValido(entity.nombre)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo nombre es obligatorio y debe ser un texto no vacío.');
    }
    if (!esStringValido(entity.apellido)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo apellido es obligatorio y debe ser un texto no vacío.');
    }
    if (!esNumeroPositivo(entity.id_curso)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo id_curso es obligatorio y debe ser un número positivo.');
    }
    if (!esFechaValida(entity.fecha_nacimiento)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo fecha_nacimiento es obligatorio y debe ser una fecha válida.');
    }
    if (!esBooleanoOBinario(entity.hace_deportes)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo hace_deportes es obligatorio y debe ser un valor booleano (true/false) o 0/1.');
    }
    next();
}

// Para PUT: cada campo se valida SOLO si vino en el body (update parcial).
export function validarAlumnoParcial(req, res, next) {
    const entity = req.body || {};

    if (entity.nombre !== undefined && !esStringValido(entity.nombre)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo nombre debe ser un texto no vacío.');
    }
    if (entity.apellido !== undefined && !esStringValido(entity.apellido)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo apellido debe ser un texto no vacío.');
    }
    if (entity.id_curso !== undefined && !esNumeroPositivo(entity.id_curso)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo id_curso debe ser un número positivo.');
    }
    if (entity.fecha_nacimiento !== undefined && !esFechaValida(entity.fecha_nacimiento)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo fecha_nacimiento debe ser una fecha válida.');
    }
    if (entity.hace_deportes !== undefined && !esBooleanoOBinario(entity.hace_deportes)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo hace_deportes debe ser un valor booleano (true/false) o 0/1.');
    }
    next();
}