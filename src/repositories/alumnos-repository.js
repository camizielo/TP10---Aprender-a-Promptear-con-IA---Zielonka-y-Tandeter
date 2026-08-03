import BaseRepository from './base-repository.js';

// Se duplican estas dos funciones de sanitización acá porque viven como
// funciones privadas (no exportadas) dentro de base-repository.js, y la
// restricción de esta tarea es no tocar ese archivo. Si en el futuro más
// repositories necesitan sobreescribir getAllAsync con su propio JOIN,
// convendría exportarlas desde base-repository.js para no seguir
// duplicando esta lógica en cada uno.
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
    if (limit === undefined || limit === null || limit === '') {
        return LIMITE_POR_DEFECTO;
    }
    const numero = Number(limit);
    if (!Number.isInteger(numero) || numero <= 0 || numero > LIMITE_MAXIMO) {
        return LIMITE_MAXIMO;
    }
    return numero;
}

export default class AlumnosRepository extends BaseRepository {
    constructor() {
        super('alumnos');
        console.log('Estoy en: AlumnosRepository-new.constructor()');
    }

    getAllAsync = async (page, limit) => {
        const paginaSanitizada = sanitizarPagina(page);
        const limiteSanitizado = sanitizarLimite(limit);
        const offset = (paginaSanitizada - 1) * limiteSanitizado;

        console.log(`AlumnosRepository-new.getAllAsync(page=${paginaSanitizada}, limit=${limiteSanitizado})`);

        const sqlDatos = `SELECT alumnos.*, cursos.nombre AS nombre_curso
                           FROM alumnos
                           LEFT JOIN cursos ON alumnos.id_curso = cursos.id
                           LIMIT $1 OFFSET $2`;
        const sqlTotal = `SELECT COUNT(*) AS total FROM alumnos`;

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

    createAsync = async (entity) => {
        console.log(`AlumnosRepository-new.createAsync(${JSON.stringify(entity)})`);
        const sql = ` INSERT INTO alumnos (
                            nombre              ,
                            apellido            ,
                            id_curso            ,
                            fecha_nacimiento    ,
                            hace_deportes
                        ) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const values = [
            entity?.nombre           ?? '',
            entity?.apellido         ?? '',
            entity?.id_curso         ?? 0,
            entity?.fecha_nacimiento ?? null,
            entity?.hace_deportes    ?? 0
        ];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`AlumnosRepository-new.updateAsync(${JSON.stringify(entity)})`);
        let id = entity.id;
        const previousEntity = await this.getByIdAsync(id);
        if (previousEntity == null) return 0;

        const sql = `UPDATE alumnos SET
                        nombre              = $2,
                        apellido            = $3,
                        id_curso            = $4,
                        fecha_nacimiento    = $5,
                        hace_deportes       = $6
                    WHERE id = $1`;
        const values = [
            id,
            entity?.nombre           ?? previousEntity?.nombre,
            entity?.apellido         ?? previousEntity?.apellido,
            entity?.id_curso         ?? previousEntity?.id_curso,
            entity?.fecha_nacimiento ?? previousEntity?.fecha_nacimiento,
            entity?.hace_deportes    ?? previousEntity?.hace_deportes
        ];
        return await this.db.queryRowCount(sql, values);
    }
}