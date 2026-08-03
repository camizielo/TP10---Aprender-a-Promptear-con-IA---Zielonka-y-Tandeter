import db from './db-pg.js';

const LIMITE_POR_DEFECTO = 20;
const LIMITE_MAXIMO = 100;

function sanitizarPagina(page) {
    const numero = Number(page);
    if (!Number.isInteger(numero) || numero < 1) {
        return 1;
    }
    return numero;
}

function sanitizarLimite(limit) {
    // No vino (undefined/null/''): usamos el default sensato.
    if (limit === undefined || limit === null || limit === '') {
        return LIMITE_POR_DEFECTO;
    }
    const numero = Number(limit);
    // Vino, pero es inválido (no es entero, es 0, o es negativo) o excede
    // el tope: en todos esos casos lo ajustamos al tope máximo permitido.
    if (!Number.isInteger(numero) || numero <= 0 || numero > LIMITE_MAXIMO) {
        return LIMITE_MAXIMO;
    }
    return numero;
}

export default class BaseRepository {
    constructor(tabla) {
        console.log(`Estoy en: BaseRepository.constructor(${tabla})`);
        this.tabla = tabla;
        this.db = db;
    }

    getAllAsync = async (page, limit) => {
        const paginaSanitizada = sanitizarPagina(page);
        const limiteSanitizado = sanitizarLimite(limit);
        const offset = (paginaSanitizada - 1) * limiteSanitizado;

        console.log(`BaseRepository[${this.tabla}].getAllAsync(page=${paginaSanitizada}, limit=${limiteSanitizado})`);

        const sqlDatos = `SELECT * FROM ${this.tabla} LIMIT $1 OFFSET $2`;
        const sqlTotal = `SELECT COUNT(*) AS total FROM ${this.tabla}`;

        const [datos, resultadoTotal] = await Promise.all([
            this.db.queryAll(sqlDatos, [limiteSanitizado, offset]),
            this.db.queryOne(sqlTotal)
        ]);

        if (datos == null) return null;

        const total = resultadoTotal ? parseInt(resultadoTotal.total, 10) : 0;

        return {
            data: datos,
            page: paginaSanitizada,
            limit: limiteSanitizado,
            total,
            totalPages: Math.ceil(total / limiteSanitizado)
        };
    }

    getByIdAsync = async (id) => {
        console.log(`BaseRepository[${this.tabla}].getByIdAsync(${id})`);
        const sql = `SELECT * FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
    }

    deleteByIdAsync = async (id) => {
        console.log(`BaseRepository[${this.tabla}].deleteByIdAsync(${id})`);
        const sql = `DELETE FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}